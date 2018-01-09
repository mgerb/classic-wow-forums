import React from 'react';

interface Props {
  className?: string;
}

interface State {}

// TODO: add prod url
const oauthUrl: string =
  process.env.NODE_ENV === 'production'
    ? ''
    : 'https://us.battle.net/oauth/authorize?redirect_uri=https://localhost/oauth&scope=wow.profile&client_id=2pfsnmd57svcpr5c93k7zb5zrug29xvp&response_type=code';

export class LoginButton extends React.Component<Props, State> {
  login() {
    window.open(oauthUrl, '_blank', 'resizeable=yes, height=900, width=1200');
  }

  render() {
    return (
      <div {...this.props}>
        <img src={require('../../assets/login-bot-left.gif')} />
        <img src={require('../../assets/login-bot-login.gif')} style={{ cursor: 'pointer' }} onClick={this.login.bind(this)} />
        <img src={require('../../assets/login-bot-right.gif')} />
      </div>
    );
  }
}
