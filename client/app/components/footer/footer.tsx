import React from 'react';
// import bottom_blizzlogo from '../../assets/bottom-blizzlogo.gif';

import './footer.scss';

interface Props {}

interface State {}

export class Footer extends React.Component<Props, State> {

  render() {
    return (
      <div className="bottom-bg">
        {/*  don't show the blizzard logo for now */}
        {/* <img src={bottom_blizzlogo}/> */}
      </div>
    );
  }
}
