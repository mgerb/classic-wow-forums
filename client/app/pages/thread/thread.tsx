import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { get, find, map } from 'lodash';
import marked from 'marked';
import { DateTime } from 'luxon';
import { CharacterService, ThreadService } from '../../services';
import { Editor, Portrait, ScrollToTop } from '../../components';
import { ReplyModel, ThreadModel } from '../../model';
import './thread.scss';

interface Props extends RouteComponentProps<any> {}

interface State {
  quotedReply?: ReplyModel;
  showEditor: boolean;
  thread?: ThreadModel;
}

export class Thread extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      showEditor: false,
    };
  }

  componentDidMount() {
    this.getReplies();
  }

  private async getReplies() {
    const thread = await ThreadService.getThread(this.props.match.params['threadId']);
    thread.replies = map(thread.replies, (reply) => { // add the thread topic to the front of the list
      return reply;
    });
    this.setState({ thread });
  }

  private onReplyClick() {
    this.setState({ showEditor: true });
  }

  private onQuoteClick(reply: ReplyModel) {
    this.setState({
      showEditor: true,
      quotedReply: reply,
    });
  }

  private onEditorClose(cancel: boolean) {
    this.setState({
      showEditor: false,
      quotedReply: undefined,
    });
    if (!cancel) {
      this.getReplies();
    }
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
    const { battletag, character_avatar, character_class, character_guild, character_name, character_realm } = reply.user;
    return (
      <div className="reply__user-container">
        <Portrait imageSrc={CharacterService.getAvatar(character_avatar)}/>
        <div style={{ textAlign: 'center' }}>
          <div className="character-name">{character_name || battletag}</div>
          {character_class && <div><small>{character_class}</small></div>}
          {character_guild && <div><small><b>Guild: </b>{character_guild}</small></div>}
          {character_realm && <div><small><b>Realm: </b>{character_realm}</small></div>}
        </div>
      </div>
    );
  }

  renderReplies(): any {
    return this.state.thread!.replies.map((reply, index) => {
      const replyDark = index % 2 === 0 ? 'reply--dark' : '';
      return (
        <div className="reply-container" key={index}>
          <div className={`reply ${replyDark}`}>
            {this.renderUserInfo(reply)}
            <div className="flex-1">

              <div className="reply__title">
                <div>
                  <b>{`${index + 1}. `}{index > 0 && 'Re: '}{this.state.thread!.title}</b>
                  <small style={{ paddingLeft: '5px' }}>| {this.getTimeFormat(reply.inserted_at)}</small>
                </div>
                <div>
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
                <div dangerouslySetInnerHTML={{ __html: marked(reply.content, { sanitize: true }) }}/>
              </div>

            </div>
          </div>
        </div>
      );
    });
  }

  render() {

    if (!this.state.thread) {
      return <div></div>;
    }

    const replies = get(this.state, 'thread.replies');

    return (
      <ScrollToTop {...this.props}>
        {this.state.showEditor &&
          <Editor threadId={this.props.match.params['threadId']}
            onClose={cancel => this.onEditorClose(cancel)}
            quotedReply={this.state.quotedReply}
          />
        }
        <div className="topic-bg">
          <div className="threadTopic-container">
            <div className="threadTopic">
              <img src={require('../../assets/sticky.gif')} style={{ marginRight: '5px' }}/>
              <b>Topic: </b>
              <small style={{ paddingLeft: '15px', color: 'white' }}>| {this.getTimeFormat(this.state.thread!.inserted_at)}</small>
            </div>
          </div>
          <img src={require('../../assets/forum-index.gif')}
            onClick={() => this.navigateForumIndex()}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="paging-bg"/>
        <div className="reply-body">
          {replies && this.renderReplies()}
        </div>
        <div className="paging-bg"/>
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
