import React from 'react';
import './portrait.scss';

interface Props {
  imageSrc: any;
  style?: any;
}

interface State {
}

export class Portrait extends React.Component<Props, State> {

  componentDidMount() {}

  render() {
    return (
      <div className="portrait" style={this.props.style}>
        <img src={require('../../assets/portrait-top.gif')}/>
        <div>
          <img src={require('../../assets/level-circle.gif')} className="portrait__level-circle"/>
          <img src={require('../../assets/portrait-left.gif')}/>
          <img src={this.props.imageSrc}/>
          <img src={require('../../assets/portrait-right.gif')}/>
        </div>
        <img src={require('../../assets/portrait-bot.gif')}/>
      </div>
    );
  }
}
