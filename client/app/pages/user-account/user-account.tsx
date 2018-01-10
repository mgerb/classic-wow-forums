import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentContainer } from '../../components';

interface Props extends RouteComponentProps<any> {}

interface State {}

export class UserAccount extends React.Component<Props, State> {

  componentDidMount() {}

  render() {
    return (
      <ContentContainer></ContentContainer>
    );
  }
}
