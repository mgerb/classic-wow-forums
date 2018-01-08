import React from 'react';
import { Link } from 'react-router-dom';

import './header.scss';

import wowlogo2  from '../../assets/wowlogo2.gif';

interface Props {}

interface State {}

export class Header extends React.Component<Props, State> {

  render() {
    return (
      <div>
        <div className="wowlogo2">
          <Link to="/">
            <img src={wowlogo2}/>
          </Link>
        </div>

        <div style={{ height: '80px' }}>
          <div className="gold-bg"/>
          <div className="topbg topbg__left">
            <div className="gryph gryph__left"/>
          </div>

          <div className="topbg topbg__right">
            <div className="gryph gryph__right"/>
          </div>
        </div>

        <div className="gold-border">
          <div className="finger finger__left"/>
          <div className="finger finger__right"/>
        </div>

        <div className="linksbar">
          <div className="linksbar-image linksbar-image__left"/>
          <span className="grey">
            <a href="#">News</a> | <a href="#">Game Info</a> | <a href="#">Forums</a> | <a href="#">Links/Files</a> | <a href="#">Support</a>
          </span>
          <div className="linksbar-image linksbar-image__right"/>
        </div>

      </div>
    );
  }
}
