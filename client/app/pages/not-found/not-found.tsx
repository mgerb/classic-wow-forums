import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContentContainer } from '../../components';
import './not-found.scss';

interface Props extends RouteComponentProps<any> {}

interface State {}

export class NotFound extends React.Component<Props, State> {

  render() {
    return (
      <ContentContainer className="not-found">
        <h1>Oops! This page doesn't exist!</h1>
      </ContentContainer>
    );
  }

}
