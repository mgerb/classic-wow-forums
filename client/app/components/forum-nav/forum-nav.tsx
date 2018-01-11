import React from 'react';
import './forum-nav.scss';

interface Props {}

interface State {}

export class ForumNav extends React.Component<Props, State> {

  render() {
    return (
      <div>
        <img src={require('../../assets/wow-base-general.gif')}/>
        <div className="forum-nav">
          <small>Forum Nav:</small><select style={{ minWidth: '194px' }}></select>
        </div>
      </div>
    );
  }
}
