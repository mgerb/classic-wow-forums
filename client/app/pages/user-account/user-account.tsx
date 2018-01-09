import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentContainer } from '../../components';
import { UserService } from '../../services';

interface Props extends RouteComponentProps<any> {}

interface State {}

export class UserAccount extends React.Component<Props, State> {

  componentDidMount() {
    console.log(UserService.getUser());
  }

  render() {
    return (
      <ContentContainer></ContentContainer>
    );
  }
}
