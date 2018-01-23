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
const upArrow = require('../../assets/arrow-up.gif');
const downArrow = require('../../assets/arrow-down.gif');

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
  sortBy: ColumnHeader;
  sortOrder: 'asc' | 'desc';
}

// TODO: refactor this on back end to match UI
enum ColumnHeader {
  subject = 'Subject',
  author = 'Author',
  replies = 'Replies',
  views = 'Views',
  lastPost= 'Last Post',
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
  private routeParams(props: Props = this.props): RouteParams {
    return {
      categoryId: parseInt(props.match.params['id'], 10),
      page: parseInt(props.match.params['page'], 10) || 1,
      threadsPerPage: parseInt(props.match.params['threadsPerPage'], 10) || 25,
      sortBy: props.match.params['sortBy'] || ColumnHeader.lastPost,
      sortOrder: props.match.params['sortOrder'] || 'desc',
    };
  }

  componentDidMount() {
    this.getThreads(this.routeParams().categoryId);
  }

  // update the page if the route params change
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.match.params['id'] !== nextProps.match.params['id']) {
      this.getThreads(nextProps.match.params['id']);
    } else {
      this.processThreads(this.state.threads, nextProps);
    }
  }

  // fetch threads from server
  private async getThreads(categoryId: number) {
    const threads = await ThreadService.getCategoryThreads(categoryId);
    this.processThreads(threads);
  }

  // process threads and set state
  private processThreads(unorderedThreads: ThreadModel[], props: Props = this.props): void {
    const { threadsPerPage, page } = this.routeParams(props);
    const threads = this.orderBy(unorderedThreads, props);
    const numPages = Math.ceil(threads.length / threadsPerPage);
    const threadIndex = (page - 1) * threadsPerPage;

    this.setState({
      threads,
      pageThreads: [...threads].splice(threadIndex, threadsPerPage),
      pageLinks: pagination(page, numPages) },
    );
  }

  private orderBy(threads: ThreadModel[], props: Props) {
    const { sortBy, sortOrder } = this.routeParams(props);
    const titleMap: any = {
      [ColumnHeader.subject]: (t: any) => t.title.toLowerCase(),
      [ColumnHeader.author]: (t: any) => {
        return t.user.character_name ? t.user.character_name.toLowerCase() : t.user.battletag.toLowerCase();
      },
      [ColumnHeader.replies]: 'reply_count',
      [ColumnHeader.views]: 'view_count',
      [ColumnHeader.lastPost]: 'updated_at',
    };

    // always sort sticky to top
    return orderBy(threads, ['sticky', titleMap[sortBy]], ['desc', sortOrder]);
  }

  private navigateHere(categoryId: number, page: number, threadsPerPage: number, sortBy: ColumnHeader, sortOrder: 'asc' | 'desc') {
    const url = `/f/${categoryId}/${page}/${threadsPerPage}/${sortBy}/${sortOrder}`;
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
      this.getThreads(this.routeParams().categoryId);
    }
  }

  renderHeader() {
    return (
      <div className="forum-header">
        <ForumNav categoryId={this.routeParams().categoryId} {...this.props}/>
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

  renderCell(content: JSX.Element | string, style: any, center?: boolean) {
    let classNames: string = '';
    classNames += center ? ' forum-cell--center' : '';
    return <div className={`forum-cell flex-1 forum-cell--body ${classNames}`} style={style}>{content}</div>;
  }

  renderThreadRows() {
    const { categoryId } = this.routeParams();
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
    const { categoryId, sortBy, sortOrder } = this.routeParams();
    return (
      <select style={{ margin: '0 5px' }}
        value={this.routeParams().threadsPerPage}
        onChange={e => this.navigateHere(categoryId, 1, parseInt(e.target.value, 10), sortBy, sortOrder)}
        >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={75}>75</option>
      </select>
    );
  }

  renderHeaderFooter() {
    const { categoryId, sortBy, threadsPerPage, sortOrder } = this.routeParams();
    return (
      <div className="forum-row forum-row--header">
        <div className="forum-cell forum-cell--header forum-cell--header-footer flex-1">
          <div>
            <span style={{ marginRight: '10px' }}>Page:</span>
            <PaginationLinks
              activePage={this.routeParams().page}
              pageLinks={this.state.pageLinks}
              onPageSelect={page => this.navigateHere(categoryId, page, threadsPerPage, sortBy, sortOrder)}
            />
          </div>
          <div>
            <b>Threads/Page:</b>
            {this.renderThreadsPerPageDropdown()}
          </div>
        </div>
      </div>
    );
  }

  renderSortingArrow(show: boolean, sortOrder: string) {
    const imgSrc = sortOrder === 'asc' ? upArrow : downArrow;
    return show ? <img src={imgSrc}/> : null;
  }

  renderHeaderCell(columnHeader: ColumnHeader, style: any, center: boolean) {
    const { categoryId, page, threadsPerPage, sortBy, sortOrder } = this.routeParams();
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const centerClass = center ? 'forum-cell--center' : '';

    return (
      <div className={`forum-cell forum-cell--header flex-1 ${centerClass}`} style={style}>
        <a onClick={() => this.navigateHere(categoryId, page, threadsPerPage, columnHeader, newSortOrder)}>
          <span>{columnHeader}</span>
          {this.renderSortingArrow(sortBy === columnHeader, sortOrder)}
        </a>
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
            <div className={`forum-cell forum-cell--header flex-1 forum-cell--center`} style={{ maxWidth: '50px' }}>
              <img src={require('../../assets/flag.gif')}/>
            </div>
            {this.renderHeaderCell(ColumnHeader.subject, { minWidth: '200px' }, false)}
            {this.renderHeaderCell(ColumnHeader.author, { maxWidth: '150px' }, true)}
            {this.renderHeaderCell(ColumnHeader.replies, { maxWidth: '150px' }, true)}
            {this.renderHeaderCell(ColumnHeader.views, { maxWidth: '150px' }, true)}
            {this.renderHeaderCell(ColumnHeader.lastPost, { maxWidth: '200px' }, true)}
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
        {this.state.showEditor && <Editor categoryId={this.routeParams().categoryId}
          onClose={cancel => this.onNewTopicClose(cancel)}/>}
        {this.renderHeader()}
        {this.renderBody()}
      </ScrollToTop>
    );
  }

}
