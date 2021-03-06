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
            <img src={wowlogo2} alt="Classic WoW Forums"/>
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
            <Link to="/">Home</Link>
            <span> | <Link to="/realms">Realms</Link></span>
            <span> | <a href="mailto:classicwowforums@gmail.com">Contact</a></span>
            <span> | <a href="https://github.com/mgerb/classic-wow-forums" target="_blank">Source</a></span>
          </span>
          <div className="linksbar-image linksbar-image__right"/>
        </div>

      </div>
    );
  }
}
