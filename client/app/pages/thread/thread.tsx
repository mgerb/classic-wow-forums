import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { chain, get, find } from 'lodash';
import marked from 'marked';
import { DateTime } from 'luxon';
import { inject, observer } from 'mobx-react';
import { CharacterService, ThreadService } from '../../services';
import { Editor, PaginationLinks, Portrait, ScrollToTop } from '../../components';
import { ReplyModel, ThreadModel } from '../../model';
import { UserStore } from '../../stores/user-store';
import { Oauth, pagination } from '../../util';
import './thread.scss';

interface Props extends RouteComponentProps<any> {
  userStore: UserStore;
  page: number;
}

interface State {
  editingReply?: ReplyModel;
  quotedReply?: ReplyModel;
  showEditor: boolean;
  thread?: ThreadModel;
  replies: ReplyModel[];
  pageLinks: (number | string)[];
}

@inject('userStore')
@observer
export class Thread extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      showEditor: false,
      replies: [],
      pageLinks: [],
    };
  }

  componentDidMount() {
    this.getReplies();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.match.params['page'] !== nextProps.match.params['page']) {
      this.processReplies(this.state.thread!, nextProps);
    }
  }

  private routeParams(props: Props = this.props) {
    return {
      categoryId: parseInt(props.match.params['categoryId'], 10),
      threadId: parseInt(props.match.params['threadId'], 10),
      page: parseInt(props.match.params['page'], 10) || 1,
    };
  }

  private navigateHere(page: number) {
    const { categoryId, threadId } = this.routeParams();
    const url = `/t/${categoryId}/${threadId}/${page}`;
    this.props.history.push(url);
  }

  private async getReplies() {
    const thread = await ThreadService.getThread(this.props.match.params['threadId']);
    this.processReplies(thread);
  }

  private processReplies(thread: ThreadModel, props: Props = this.props) {
    thread.replies = chain(thread.replies)
      .orderBy(['inserted_at'], ['asc'])
      .map((r, i) => { r.index = i; return r; })
      // remove hidden replies only for normal users
      .reject(r => !this.props.userStore.isModOrAdmin() && r.hidden)
      .value();
    const { page } = this.routeParams(props);
    const numPages = Math.ceil(thread.replies.length / 20);
    const replyIndex = (page - 1) * 20;

    this.setState({
      thread,
      replies: [...thread.replies].splice(replyIndex, 20),
      pageLinks: pagination(page, numPages),
    });
  }

  private onReplyClick() {
    this.props.userStore.user ? this.setState({ showEditor: true }) : Oauth.openOuathWindow();
  }

  private onQuoteClick(reply: ReplyModel) {
    this.props.userStore.user ?
    this.setState({
      showEditor: true,
      quotedReply: reply,
    }) :
    Oauth.openOuathWindow();
  }

  private onEditClick(reply: ReplyModel) {
    this.setState({
      editingReply: reply,
      showEditor: true,
    });
  }

  private onEditorClose(cancel: boolean) {
    this.setState({
      showEditor: false,
      quotedReply: undefined,
      editingReply: undefined,
    });
    if (!cancel) {
      this.getReplies();
    }
  }

  private async onModButtonClick(params: { id: number, hidden?: boolean}) {
    await ThreadService.modUpdateReply(params);
    this.getReplies();
  }

  private navigateForumIndex() {
    this.props.history.push(`/f/${this.state.thread!.category_id}`);
  }

  private getTimeFormat(dateTime: string) {
    return DateTime.fromISO(dateTime).toLocaleString({
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  }

  private renderQuotedReply(reply: ReplyModel) {
    const quotedReply = find(this.state.thread!.replies, { id: reply.quote_id });
    return (quotedReply &&
      <blockquote className="blockquote">
        <small>Q u o t e:</small>
        <small dangerouslySetInnerHTML={{ __html: marked(quotedReply.content, { sanitize: true }) }}/>
      </blockquote>
    );
  }

  renderUserInfo(reply: ReplyModel) {
    const { battletag, character_avatar, character_class, character_guild, character_name, character_realm, permissions } = reply.user;
    return (
      <div className="reply__user-container">
        <Portrait imageSrc={CharacterService.getAvatar(character_avatar)}/>
        <div style={{ textAlign: 'center' }}>
          <div className="character-name">{character_name || battletag}</div>
          {character_class && <div><small>{character_class}</small></div>}
          {character_guild && <div><small><b>Guild: </b>{character_guild}</small></div>}
          {character_realm && <div><small><b>Realm: </b>{character_realm}</small></div>}
          {permissions === 'admin' && <div className="blue">Admin Poster</div>}
        </div>
      </div>
    );
  }

  renderEditbutton(reply: ReplyModel): any {
    if (get(this.props, 'userStore.user.id') === reply.user_id) {
      return <a style={{ paddingRight: '10px' }} onClick={() => this.onEditClick(reply)}>Edit</a>;
    }
  }

  renderModButtons(reply: ReplyModel, index: number): any {
    const { id, hidden } = reply;
    if (index !== 0 && this.props.userStore.isModOrAdmin()) {
      return (
        <a style={{ paddingRight: '10px' }} onClick={() => this.onModButtonClick({ id, hidden: !hidden })}>
          {hidden ? <span className="red">Unhide</span> : <span>Hide</span>}
        </a>
      );
    }
  }

  renderReplies(): any {
    return this.state.replies.map((reply, index) => {
      const replyDark = index % 2 === 0 ? 'reply--dark' : '';
      const bluePost = reply.user.permissions === 'admin' ? 'blue-post' : '';
      return (
        <div className="reply-container" key={index}>
          <div className={`reply ${replyDark}`}>
            {this.renderUserInfo(reply)}
            <div className="flex-1">

              <div className="reply__title">
                <div>
                  <b>{`${reply.index! + 1}. `}{index > 0 && 'Re: '}{this.state.thread!.title}</b>
                  <small style={{ paddingLeft: '5px' }}>| {this.getTimeFormat(reply.inserted_at)}</small>
                </div>
                <div className="flex flex--center">
                  {this.renderModButtons(reply, index)}
                  {this.renderEditbutton(reply)}
                  <img src={require('../../assets/quote-button.gif')}
                    className="reply__title__button"
                    onClick={() => this.onQuoteClick(reply)}/>
                  <img src={require('../../assets/reply-button.gif')}
                    className="reply__title__button"
                    onClick={() => this.onReplyClick()}/>
                </div>
              </div>

              <div className="reply__content markdown-container">
                {this.renderQuotedReply(reply)}
                <div className={bluePost} dangerouslySetInnerHTML={{ __html: marked(reply.content, { sanitize: true }) }}/>
                {reply.edited && <small className="red">[ post edited by {reply.user.character_name || reply.user.battletag} ]</small>}
              </div>

            </div>
          </div>
        </div>
      );
    });
  }

  renderPagingBg() {
    return (
      <div className="paging-bg">
        <PaginationLinks activePage={this.routeParams().page}
          pageLinks={this.state.pageLinks}
          onPageSelect={page => this.navigateHere(page)}
          showArrows={true}
          />
      </div>
    );
  }

  render() {

    const { editingReply, thread, replies, showEditor, quotedReply } = this.state;

    if (!thread) {
      return <div></div>;
    }

    return (
      <ScrollToTop {...this.props}>
        {showEditor &&
          <Editor threadId={this.props.match.params['threadId']}
            onClose={cancel => this.onEditorClose(cancel)}
            quotedReply={quotedReply}
            editingReply={editingReply}
          />
        }
        <div className="topic-bg">
          <div className="threadTopic-container">
            <div className="threadTopic">
              {thread.sticky && <img src={require('../../assets/sticky.gif')} style={{ marginRight: '5px' }}/>}
              <b>Topic: </b>
              <small style={{ paddingLeft: '15px', color: 'white' }}>| {this.getTimeFormat(thread!.inserted_at)}</small>
            </div>
          </div>
          <img src={require('../../assets/forum-index.gif')}
            onClick={() => this.navigateForumIndex()}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {this.renderPagingBg()}
        <div className="reply-body">
          {replies && this.renderReplies()}
        </div>
        {this.renderPagingBg()}

        <div className="forumliner-bot-bg"/>
        <img src={require('../../assets/forum-index-bot.gif')}
          onClick={() => this.navigateForumIndex()}
          style={{ cursor: 'pointer', float: 'right' }}
        />

        <div style={{ height: '200px' }}/>
      </ScrollToTop>

    );
  }
}
