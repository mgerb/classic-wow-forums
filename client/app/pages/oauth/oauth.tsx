import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { parse } from 'query-string';
import axios from '../../axios/axios';

interface Props extends RouteComponentProps<any> {}

interface State {}

export class Oauth extends React.Component<Props, State> {
  componentDidMount() {
    this.login(this.props.location.search);
  }

  private async login(queryString: string) {
    try {
      const code = parse(queryString).code;
      const res = await axios.post('/api/battlenet/authorize', { code });
      const account = res.data.data;
      localStorage.setItem('account', JSON.stringify(account));
      window.opener.location.reload();
      // TODO: this doesn't work on mobile currently
      window.close();
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return <div />;
  }
}
