import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { LoginButton } from '../../components';
import './forum.scss';

interface Props extends RouteComponentProps<any> {}

interface State {}

export class Forum extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
  }

  renderHeader() {
    return (
      <div className="forum-header">
        <div>
          <img src={require('../../assets/wow-base-general.gif')}/>
          <div className="forum-nav">
            <small>Forum Nav:</small><select style={{ minWidth: '194px' }}></select>
          </div>
        </div>
        <div style={{ height: '100%' }}>
          <LoginButton/>
        </div>
      </div>
    );
  }

  renderBody() {
    return (
      <div className="forum-body">
        <div className="flex">
          <img src={require('../../assets/forum-menu-left.gif')}/>
          <img src={require('../../assets/forum-menu-newtopic.gif')}/>
          <img src={require('../../assets/forum-menu-right.gif')}/>
          <img src={require('../../assets/forum-menu-search-left.gif')}/>
          <div className="forum-menu-search-bg">
            <input name="SearchText"/>
          </div>
          <img src={require('../../assets/forum-menu-search.gif')}/>
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
    return Array(40).fill('test 123').map((thread, index) => {
      return (
        <div className={`forum-row ${index % 2 === 0 && 'forum-row--dark'}`} key={index}>
          {this.renderCell(thread, { maxWidth: '50px' })}
          {this.renderCell(<Link to="#">This is a test subject that could be really long</Link>, { minWidth: '200px' })}
          {this.renderCell(<b>thread</b>, { maxWidth: '150px' })}
          {this.renderCell(<b>thread</b>, { maxWidth: '150px' }, true)}
          {this.renderCell(<b>thread</b>, { maxWidth: '150px' }, true)}
          {this.renderCell(<span>by <b>thread</b></span>, { maxWidth: '200px' })}
        </div>
      );
    });
  }

  renderTable() {
    return (
      <div style={{ padding: '0 3px' }}>
        <div className="forum-table">

          <div className="forum-row forum-row--header">
            <div className="forum-cell forum-cell--header flex-1">Test</div>
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
      <div>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }

}
