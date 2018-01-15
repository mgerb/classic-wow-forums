import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ThreadService } from '../../services';
import { Editor, ForumNav, LoginButton, ScrollToTop } from '../../components';
import { ThreadModel } from '../../model';
import { UserStore } from '../../stores/user-store';
import './forum.scss';
import { Oauth } from '../../util';

interface Props extends RouteComponentProps<any> {
  userStore: UserStore;
}

interface State {
  showEditor: boolean;
  threads: ThreadModel[];
}

@inject('userStore')
@observer
export class Forum extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showEditor: false,
      threads: [],
    };
  }

  componentDidMount() {
    this.getThreads(this.props.match.params['id']);
  }

  // update the page if the route params change
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.match.params !== nextProps.match.params) {
      this.getThreads(nextProps.match.params['id']);
    }
  }

  private async getThreads(categoryId: string) {
    const threads = await ThreadService.getCategoryThreads(categoryId);
    this.setState({ threads });
  }

  onNewTopic() {
    if (this.props.userStore.user) {
      this.setState({ showEditor: true });
    } else {
      Oauth.openOuathWindow();
    }
  }

  onNewTopicClose(cancel: boolean) {
    this.setState({ showEditor: false });
    if (!cancel) {
      this.getThreads(this.props.match.params['id']);
    }
  }

  renderHeader() {
    return (
      <div className="forum-header">
        <ForumNav categoryId={parseInt(this.props.match.params['id'], 10)} {...this.props}/>
        <div style={{ height: '100%' }}>
          <LoginButton onNavigate={dest => this.props.history.push(dest)}/>
        </div>
      </div>
    );
  }

  renderBody() {
    return (
      <div className="forum-body">
        <div className="flex">
          <img src={require('../../assets/forum-menu-left.gif')}/>
          <img src={require('../../assets/forum-menu-newtopic.gif')}
            className="clickable"
            onClick={() => this.onNewTopic()}/>
          <img src={require('../../assets/forum-menu-right.gif')}/>
          <img src={require('../../assets/forum-menu-search-left.gif')}/>
          <div className="forum-menu-search-bg">
            <input name="SearchText"/>
          </div>
          <img src={require('../../assets/forum-menu-search.gif')} className="clickable"/>
          <div className="forumliner-bg"/>
        </div>

        {this.renderTable()}
      </div>
    );
  }

  renderCell(content: JSX.Element | string, style: any, center?: boolean, header?: boolean) {
    let classNames: string = '';
    classNames += center && ' forum-cell--center';
    classNames += header ? ' forum-cell--header' : ' forum-cell--body';
    return <div className={`forum-cell flex-1 ${classNames}`} style={style}>{content}</div>;
  }

  renderThreadRows() {
    const categoryId = this.props.match.params['id'];
    return this.state.threads.map((thread, index) => {
      return (
        <div className={`forum-row ${index % 2 === 0 && 'forum-row--dark'}`} key={index}>
          {this.renderCell('flag', { maxWidth: '50px' })}
          {this.renderCell(<Link to={`/f/${categoryId}/${thread.id}`}>{thread.title}</Link>, { minWidth: '200px' })}
          {this.renderCell(<b>{thread.user.character_name || thread.user.battletag}</b>, { maxWidth: '150px' })}
          {this.renderCell(<b>{thread.reply_count}</b>, { maxWidth: '150px' }, true)}
          {this.renderCell(<b>{thread.view_count}</b>, { maxWidth: '150px' }, true)}
          {this.renderCell(
            <span>by <b>{thread.last_reply.character_name || thread.last_reply.battletag}</b></span>,
            { maxWidth: '200px' },
          )}
        </div>
      );
    });
  }

  renderTable() {
    return (
      <div style={{ padding: '0 3px' }}>
        <div className="forum-table">

          <div className="forum-row forum-row--header">
            <div className="forum-cell forum-cell--header flex-1">TODO:</div>
          </div>

          <div className="forum-row forum-row--header">
            {this.renderCell(<img src={require('../../assets/flag.gif')}/>, { maxWidth: '50px' }, true, true)}
            {this.renderCell(<a>Subject</a>, { minWidth: '200px' }, false, true)}
            {this.renderCell(<a>Author</a>, { maxWidth: '150px' }, true, true)}
            {this.renderCell(<a>Replies</a>, { maxWidth: '150px' }, true, true)}
            {this.renderCell(<a>Views</a>, { maxWidth: '150px' }, true, true)}
            {this.renderCell(<a>Last Post</a>, { maxWidth: '200px' }, true, true)}
          </div>

          {this.renderThreadRows()}
        </div>

        <div className="forumliner-bot-bg"/>
      </div>
    );
  }

  render() {
    return (
      <ScrollToTop>
        {this.state.showEditor && <Editor categoryId={this.props.match.params['id']}
          onClose={cancel => this.onNewTopicClose(cancel)}/>}
        {this.renderHeader()}
        {this.renderBody()}
      </ScrollToTop>
    );
  }

}
