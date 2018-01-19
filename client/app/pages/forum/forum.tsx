import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { orderBy } from 'lodash';
import { ThreadService } from '../../services';
import { Editor, ForumNav, LoginButton, PaginationLinks, ScrollToTop } from '../../components';
import { ThreadModel } from '../../model';
import { UserStore } from '../../stores/user-store';
import { Oauth, pagination } from '../../util';
import './forum.scss';

const stickyImage = require('../../assets/sticky.gif');

interface Props extends RouteComponentProps<any> {
  userStore: UserStore;
}

interface State {
  showEditor: boolean;
  threads: ThreadModel[];
  pageThreads: ThreadModel[];
  pageLinks: (number | string)[];
}

interface RouteParams {
  categoryId: number;
  page: number;
  threadsPerPage: number;
  sortBy: string;
}

@inject('userStore')
@observer
export class Forum extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showEditor: false,
      threads: [],
      pageThreads: [],
      pageLinks: [],
    };
  }

  // easier way to get route params - will provide default values if null
  private get routeParams(): RouteParams {
    return {
      categoryId: parseInt(this.props.match.params['id'], 10),
      page: parseInt(this.props.match.params['page'], 10) || 1,
      threadsPerPage: parseInt(this.props.match.params['threadsPerPage'], 10) || 25,
      sortBy: this.props.match.params['sortBy'] || 'Latest Reply',
    };
  }

  componentDidMount() {
    this.getThreads(this.routeParams.categoryId);
  }

  // update the page if the route params change
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.match.params['id'] !== nextProps.match.params['id']) {
      this.getThreads(nextProps.match.params['id']);
    } else {
      // have to grab params from next props
      const page = parseInt(nextProps.match.params['page'], 10) || 1;
      const threadsPerPage = parseInt(nextProps.match.params['threadsPerPage'], 10) || 25;
      this.processThreads(this.state.threads, page, threadsPerPage);
    }
  }

  // fetch threads from server
  private async getThreads(categoryId: number) {
    const threads = await ThreadService.getCategoryThreads(categoryId);
    this.processThreads(threads, this.routeParams.page, this.routeParams.threadsPerPage);
  }

  // process threads and set state
  private processThreads(unorderedThreads: ThreadModel[], page: number, threadsPerPage: number): void {
    const threads = this.orderBy(unorderedThreads);
    const numPages = Math.ceil(threads.length / threadsPerPage);
    const threadIndex = (page - 1) * threadsPerPage;

    this.setState({
      threads,
      pageThreads: [...threads].splice(threadIndex, threadsPerPage),
      pageLinks: pagination(page, numPages) },
    );
  }

  // TODO:
  private orderBy(threads: ThreadModel[]) {
    return orderBy(threads, ['sticky', 'updated_at'], ['desc', 'desc']);
  }

  private navigateHere(categoryId: number, page: number, threadsPerPage: number, sortBy: string) {
    const url = `/f/${categoryId}/${page}/${threadsPerPage}/${sortBy}`;
    this.props.history.push(url);
  }

  private onNewTopic() {
    if (this.props.userStore.user) {
      this.setState({ showEditor: true });
    } else {
      Oauth.openOuathWindow();
    }
  }

  private onNewTopicClose(cancel: boolean) {
    this.setState({ showEditor: false });
    if (!cancel) {
      this.getThreads(this.routeParams.categoryId);
    }
  }

  renderHeader() {
    return (
      <div className="forum-header">
        <ForumNav categoryId={this.routeParams.categoryId} {...this.props}/>
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
    classNames += center ? ' forum-cell--center' : '';
    classNames += header ? ' forum-cell--header' : ' forum-cell--body';
    return <div className={`forum-cell flex-1 ${classNames}`} style={style}>{content}</div>;
  }

  renderThreadRows() {
    const { categoryId } = this.routeParams;
    return this.state.pageThreads.map((thread, index) => {
      const authorBluePost = thread.user.permissions === 'admin' ? 'blue' : '';
      const lastReplyBluePost = thread.last_reply.permissions === 'admin' ? 'blue' : '';
      const sticky = thread.sticky ? <img src={stickyImage} title="Sticky"/> : '';
      return (
        <div className={`forum-row ${index % 2 === 0 && 'forum-row--dark'}`} key={index}>
          {this.renderCell(sticky, { maxWidth: '50px' }, true)}
          {this.renderCell(
            <Link to={`/t/${categoryId}/${thread.id}`} className="thread__title">{thread.title}</Link>,
            { minWidth: '200px' },
          )}
          {this.renderCell(<b className={authorBluePost}>{thread.user.character_name || thread.user.battletag}</b>, { maxWidth: '150px' })}
          {this.renderCell(<b>{thread.reply_count}</b>, { maxWidth: '150px' }, true)}
          {this.renderCell(<b>{thread.view_count}</b>, { maxWidth: '150px' }, true)}
          {this.renderCell(
            <div style={{ fontSize: '8pt' }}>
              by <b className={lastReplyBluePost}>{thread.last_reply.character_name || thread.last_reply.battletag}</b>
            </div>,
            { maxWidth: '200px' },
          )}
        </div>
      );
    });
  }

  renderThreadsPerPageDropdown() {
    const { categoryId, sortBy } = this.routeParams;
    return (
      <select style={{ margin: '0 5px' }}
        value={this.routeParams.threadsPerPage}
        onChange={e => this.navigateHere(categoryId, 1, parseInt(e.target.value, 10), sortBy)}
        >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={75}>75</option>
      </select>
    );
  }

  // TOOD:
  renderSortByDropdown() {
    return (
      <select style={{ margin: '0 5px' }}>
        <option>Latest Reply</option>
        <option>Subject</option>
        <option>Author</option>
        <option># of Replies</option>
        <option># of Views</option>
        <option>Creation Date</option>
      </select>
    );
  }

  renderHeaderFooter() {
    const { categoryId, sortBy, threadsPerPage } = this.routeParams;
    return (
      <div className="forum-row forum-row--header">
        <div className="forum-cell forum-cell--header forum-cell--header-footer flex-1">
          <div>
            <span style={{ marginRight: '10px' }}>Page:</span>
            <PaginationLinks
              activePage={this.routeParams.page}
              pageLinks={this.state.pageLinks}
              onPageSelect={page => this.navigateHere(categoryId, page, threadsPerPage, sortBy)}
            />
          </div>
          <div>
            <b>Threads/Page:</b>
            {this.renderThreadsPerPageDropdown()}
            <b>Sort by:</b>
            {this.renderSortByDropdown()}
          </div>
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <div style={{ padding: '0 3px' }}>
        <div className="forum-table">

          {/* header */}
          {this.renderHeaderFooter()}

          {/* column headers */}
          <div className="forum-row forum-row--header">
            {this.renderCell(<img src={require('../../assets/flag.gif')}/>, { maxWidth: '50px' }, true, true)}
            {this.renderCell(<a>Subject</a>, { minWidth: '200px' }, false, true)}
            {this.renderCell(<a>Author</a>, { maxWidth: '150px' }, true, true)}
            {this.renderCell(<a>Replies</a>, { maxWidth: '150px' }, true, true)}
            {this.renderCell(<a>Views</a>, { maxWidth: '150px' }, true, true)}
            {this.renderCell(<a>Last Post</a>, { maxWidth: '200px' }, true, true)}
          </div>

          {/* table body */}
          {this.renderThreadRows()}

          {/* footer  */}
          {this.renderHeaderFooter()}

        </div>

        <div className="forumliner-bot-bg"/>
      </div>
    );
  }

  render() {
    return (
      <ScrollToTop>
        {this.state.showEditor && <Editor categoryId={this.routeParams.categoryId}
          onClose={cancel => this.onNewTopicClose(cancel)}/>}
        {this.renderHeader()}
        {this.renderBody()}
      </ScrollToTop>
    );
  }

}
