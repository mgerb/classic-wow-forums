import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ThreadService } from '../../services';

interface Props extends RouteComponentProps<any> {}

interface State {}

export class Thread extends React.Component<Props, State> {

  componentDidMount() {
    this.getThreads();
  }

  private async getThreads() {
    const thread = await ThreadService.getThread(this.props.match.params['id']);
    console.log(thread);
  }

  render() {
    return (
      <div></div>
    );
  }
}
