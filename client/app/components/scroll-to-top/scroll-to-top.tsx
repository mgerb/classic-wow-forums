import React from 'react';

export class ScrollToTop extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return this.props.children;
  }
}
