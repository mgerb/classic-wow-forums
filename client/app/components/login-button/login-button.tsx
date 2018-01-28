import React from 'react';
import { inject, observer } from 'mobx-react';
import { Portrait } from '../portrait/portrait';
import { UserStore } from '../../stores/user-store';
import { CharacterService } from '../../services';
import { Oauth } from '../../util';
import './login-button.scss';

interface Props {
  userStore?: UserStore;
  onNavigate: (des: string) => any;
}

interface State {}

@inject('userStore')
@observer
export class LoginButton extends React.Component<Props, State> {

  login() {
    Oauth.openOuathWindow();
  }

  renderPortrait() {
    const avatarSrc = CharacterService.getAvatar(this.props.userStore!.user!.character_avatar!);
    return (
      <div>
        <div className="portrait-container hide-tiny">
          <div onClick={() => this.props.onNavigate('/user-account')} style={{ cursor: 'pointer' }}>
            {avatarSrc && <Portrait imageSrc={avatarSrc}/>}
          </div>
          <div style={{ textAlign: 'center' }}>
            {!avatarSrc && <p><a onClick={() => this.props.onNavigate('/user-account')}>Account</a></p>}
            <div><b>{this.props.userStore!.user!.battletag}</b></div>
            <div><b>{this.props.userStore!.user!.character_name}</b></div>
          </div>
        </div>
        <div className="hide-large" style={{ padding: '10px' }}><a onClick={() => this.props.onNavigate('/user-account')}>Account</a></div>
      </div>
    );
  }

  renderLoginButton() {
    return (
      <div>
        <img src={require('../../assets/login-bot-left.gif')} />
        <img src={require('../../assets/login-bot-login.gif')} style={{ cursor: 'pointer' }} onClick={this.login.bind(this)}/>
        <img src={require('../../assets/login-bot-right.gif')} />
      </div>
    );
  }
  render() {
    return (
      <div className="login-button">
        {this.props.userStore!.user ? this.renderPortrait() : this.renderLoginButton()}
      </div>
    );
  }
}
