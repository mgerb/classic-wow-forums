import React from 'react';

import './content-container.scss';

interface Props {
  className?: string;
  style?: any;
}

interface State {}

export class ContentContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={`content-container ${this.props.className}`} style={this.props.style}>
        <div className="border-container">
          <div className="border border__left"/>
          <div className="border border__right"/>
          <div className="border border__bottom"/>
          <div className="border border__top"/>
          <div className="border border__top-left"/>
          <div className="border border__top-right"/>
          <div className="border border__bottom-left"/>
          <div className="border border__bottom-right"/>
        </div>
        {this.props.children}
      </div>
    );
  }
}
