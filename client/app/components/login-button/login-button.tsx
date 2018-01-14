import React from 'react';
import { inject, observer } from 'mobx-react';
import { Portrait } from '../portrait/portrait';
import { UserStore } from '../../stores/user-store';
import { CharacterService } from '../../services';

interface Props {
  className?: string;
  userStore?: UserStore;
  onNavigate: (des: string) => any;
}

interface State {}

// TODO: add prod url
const oauthUrl: string =
  process.env.NODE_ENV === 'production'
    ? ''
    : 'https://us.battle.net/oauth/authorize?redirect_uri=https://localhost/oauth&scope=wow.profile&client_id=2pfsnmd57svcpr5c93k7zb5zrug29xvp&response_type=code';

@inject('userStore')
@observer
export class LoginButton extends React.Component<Props, State> {

  login() {
    window.open(oauthUrl, '_blank', 'resizeable=yes, height=900, width=1200');
  }

  renderPortrait() {
    const avatarSrc = CharacterService.getAvatar(this.props.userStore!.user!.character_avatar!);
    return (
      <div style={{ padding: '10px' }}>
        <div onClick={() => this.props.onNavigate('/user-account')} style={{ cursor: 'pointer' }}>
          {avatarSrc && <Portrait imageSrc={avatarSrc}/>}
        </div>
        <div style={{ textAlign: 'center' }}>
          {!avatarSrc && <p><a onClick={() => this.props.onNavigate('/user-account')}>Account</a></p>}
          <div><b>{this.props.userStore!.user!.battletag}</b></div>
          <div><b>{this.props.userStore!.user!.character_name}</b></div>
        </div>
      </div>
    );
  }

  renderLoginButton() {
    return (
      <div>
        <img src={require('../../assets/login-bot-left.gif')} />
        <img src={require('../../assets/login-bot-login.gif')} style={{ cursor: 'pointer' }} onClick={this.login.bind(this)} />
        <img src={require('../../assets/login-bot-right.gif')} />
      </div>
    );
  }
  render() {
    return (
      <div className={this.props.className}>
        {this.props.userStore!.user ? this.renderPortrait() : this.renderLoginButton()}
      </div>
    );
  }
}
