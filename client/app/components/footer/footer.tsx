import React from 'react';

import bottom_blizzlogo from '../../assets/bottom-blizzlogo.gif';

import './footer.scss';

interface Props {}

interface State {}

export class Footer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className="bottom-bg">
        <img src={bottom_blizzlogo}/>
      </div>
    );
  }

}
