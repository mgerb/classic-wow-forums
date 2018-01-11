import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { get } from 'lodash';
import { ThreadService } from '../../services';
import { ForumNav, Portrait, ScrollToTop } from '../../components';
import { ThreadModel } from '../../model';
import './thread.scss';

interface Props extends RouteComponentProps<any> {}

interface State {
  thread?: ThreadModel;
}

export class Thread extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getThreads();
  }

  private async getThreads() {
    const thread = await ThreadService.getThread(this.props.match.params['id']);
    thread.replies = [thread as any, ...thread.replies]; // add the thread topic to the front of the list
    this.setState({ thread });
  }

  renderReplies(): any {
    return this.state.thread!.replies.map((reply, index) => {
      return (
        <div className="reply-container" key={index}>
          <div className="reply">
            <div className="reply__user-container">
              <Portrait imageSrc={require('../../assets/Tyren.gif')}/>
              <div>Tyren</div>
              <div>Blizzard Poster</div>
            </div>
            <div className="flex-1">
              <div className="reply__title">
                <div>
                  <b>{`${index + 1}. `}{this.state.thread!.title}</b>
                  <small style={{ paddingLeft: '5px' }}>| {reply.inserted_at}</small>
                </div>
                <div>
                  <img src={require('../../assets/quote-button.gif')} className="reply__title__button"/>
                  <img src={require('../../assets/reply-button.gif')} className="reply__title__button"/>
                </div>
              </div>
              {/* TODO: xss sanitization */}
              <div className="reply__content">{reply.content}</div>
            </div>
          </div>
        </div>
      );
    });
  }

  private navigateForumIndex() {
    this.props.history.push(`/f/${this.state.thread!.category_id}`);
  }

  render() {

    const replies = get(this.state, 'thread.replies');

    return (
      <ScrollToTop {...this.props}>

        <div style={{ padding: '16px 0 12px 0' }}>
          <ForumNav/>
        </div>

        <div className="topic-bg">
          <div className="threadTopic-container">
            <div className="threadTopic">
              <img src={require('../../assets/sticky.gif')} style={{ marginRight: '5px' }}/>
              <b>Topic: </b><small style={{ paddingLeft: '15px', color: 'white' }}>| 12/20/2005 1:11:44 AM PST</small>
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
