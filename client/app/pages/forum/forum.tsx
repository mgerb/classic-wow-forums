import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { cloneDeep, filter, orderBy, reject } from 'lodash';
import { ThreadService, ModUpdate } from '../../services';
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
  initialThreads: ThreadModel[];
  pageThreads: ThreadModel[];
  pageLinks: (number | string)[];
  searchText: string;
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
      initialThreads: [],
      pageThreads: [],
      pageLinks: [],
      searchText: '',
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
    let threads = await ThreadService.getCategoryThreads(categoryId);
    // remove hidden threads from normal users
    threads = reject(threads, t => !this.props.userStore.isModOrAdmin() && t.hidden);
    this.setState({ initialThreads: threads });
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
      pageLinks: pagination(page, numPages),
    });
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

  private onSearch(event: any) {
    event.preventDefault();
    const threads = filter(cloneDeep(this.state.initialThreads), (t) => {
      return t.title.toLowerCase().match(this.state.searchText.toLowerCase());
    });

    this.processThreads(threads);
  }

  private async onModItemClick(params: ModUpdate) {
    await ThreadService.modUpdateThread(params);
    this.getThreads(this.routeParams().categoryId);
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
      <div>
        <form className="flex" style={{ marginBottom: 0 }} onSubmit={e => this.onSearch(e)}>
          <img src={require('../../assets/forum-menu-left.gif')}/>
          <img src={require('../../assets/forum-menu-newtopic.gif')}
            className="clickable"
            onClick={() => this.onNewTopic()}/>
          <img src={require('../../assets/forum-menu-right.gif')}/>
          <img src={require('../../assets/forum-menu-search-left.gif')}/>
          <div className="forum-menu-search-bg">
            <input name="SearchText" onChange={event => this.setState({ searchText: event.target.value })}/>
          </div>
          <input type="image" name="submit"
            src={require('../../assets/forum-menu-search.gif')}
            className="clickable" style={{ outline: 'none' }}/>
          <div className="forumliner-bg"/>
        </form>

        {this.renderTable()}
      </div>
    );
  }

  renderThreadRows() {
    const { categoryId } = this.routeParams();
    return this.state.pageThreads.map((thread, index) => {
      const { id, sticky, hidden, last_reply, locked, reply_count, title, user, view_count } = thread;
      const authorBluePost = user.permissions === 'admin' ? 'blue' : '';
      const lastReplyBluePost = last_reply.permissions === 'admin' ? 'blue' : '';
      const stickyElement = sticky ? <img src={stickyImage} title="Sticky"/> : '';
      return (
        <tr className="forum-row forum-row__body" key={index}>
          <td className={`forum-cell forum-cell--body forum-cell--center`}>{stickyElement}</td>
          <td className={`forum-cell forum-cell--body`}>
            <Link to={`/t/${categoryId}/${id}`} className="thread__title">{title}</Link>
            {this.props.userStore.isModOrAdmin() &&
              <span className="forum-cell__mod-controls">
                <a onClick={() => this.onModItemClick({ id, sticky: !sticky })}>{sticky ? 'Unstick' : 'Stick'}</a>
                <a onClick={() => this.onModItemClick({ id, locked: !locked })}>{locked ? 'Unlock' : 'Lock'}</a>
                <a onClick={() => this.onModItemClick({ id, hidden: !hidden })}>{hidden ? 'Unhide' : 'Hide'}</a>
              </span>
            }
          </td>
          <td className={`forum-cell forum-cell--body`}>
            <b className={authorBluePost}>{user.character_name || user.battletag}</b>
          </td>
          <td className={`forum-cell forum-cell--body forum-cell--center`}>
            <b>{reply_count}</b>
          </td>
          <td className={`forum-cell forum-cell--body forum-cell--center`}>
            <b>{view_count}</b>
          </td>
          <td className={`forum-cell forum-cell--body`}>
            <div style={{ fontSize: '8pt' }}>
              by <b className={lastReplyBluePost}>{last_reply.character_name || last_reply.battletag}</b>
            </div>
          </td>
        </tr>
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
      <tr className="forum-table__header">
        <td colSpan={100} className="forum-cell forum-cell--header">
          <div className="flex forum-cell--header-footer">
            <div className="flex">
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
        </td>
      </tr>
    );
  }

  renderSortingArrow(show: boolean, sortOrder: string) {
    const imgSrc = sortOrder === 'asc' ? upArrow : downArrow;
    return show ? <img src={imgSrc}/> : null;
  }

  renderHeaderCell(columnHeader: ColumnHeader, center: boolean) {
    const { categoryId, page, threadsPerPage, sortBy, sortOrder } = this.routeParams();
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const centerClass = center ? 'forum-cell--center' : '';

    return (
      <td className={`forum-cell forum-cell--header ${centerClass}`}>
        <a onClick={() => this.navigateHere(categoryId, page, threadsPerPage, columnHeader, newSortOrder)}>
          <span>{columnHeader}</span>
          {this.renderSortingArrow(sortBy === columnHeader, sortOrder)}
        </a>
      </td>
    );
  }

  renderTable() {
    return (
      <div style={{ padding: '0 3px' }}>
        <table className="forum-table">
          <tbody>

            {/* header */}
            {this.renderHeaderFooter()}

            <tr className="forum-table__header">
              <td className={`forum-cell forum-cell--header forum-cell--center`} style={{ maxWidth: '50px' }}>
                <img src={require('../../assets/flag.gif')}/>
              </td>
              {this.renderHeaderCell(ColumnHeader.subject, false)}
              {this.renderHeaderCell(ColumnHeader.author, true)}
              {this.renderHeaderCell(ColumnHeader.replies, true)}
              {this.renderHeaderCell(ColumnHeader.views, true)}
              {this.renderHeaderCell(ColumnHeader.lastPost, true)}
            </tr>

            {/* body */}
            {this.renderThreadRows()}

            {/* footer  */}
            {this.renderHeaderFooter()}

          </tbody>
        </table>
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
