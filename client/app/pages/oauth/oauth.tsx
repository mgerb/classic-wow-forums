import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { parse } from 'query-string';
import { ContentContainer } from '../../components';
import { UserService } from '../../services';

interface Props extends RouteComponentProps<any> {}

interface State {
  errorMessage?: string;
}

export class Oauth extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.login(this.props.location.search);
  }

  private async login(queryString: string) {
    try {
      const code = parse(queryString).code;
      await UserService.authorize(code);
      window.opener.location.reload();
      window.close();
    } catch (e) {
      this.setState({
        errorMessage: 'Unable to log in. Your account may not be in the right region, or you may not have set a battletag.',
      });
    }
  }

  render() {
    return (
      <ContentContainer style={{ minHeight: '500px', padding: '50px', textAlign: 'center' }}>
        <b>{this.state.errorMessage}</b>
      </ContentContainer>
    );
  }
}
