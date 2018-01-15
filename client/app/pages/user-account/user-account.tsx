import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { get, groupBy, map } from 'lodash';
import { ContentContainer, Portrait, ScrollToTop } from '../../components';
import { UserStore } from '../../stores/user-store';
import { CharacterService, UserService } from '../../services';
import { CharacterModel } from '../../model';
import './user-account.scss';

interface Props extends RouteComponentProps<any> {
  userStore?: UserStore;
}

interface State {
  characters: {[realm: string]: CharacterModel[]};
  selectedRealm?: string;
  selectedCharIndex: number;
  selectedAvatarIndex: number;
  insufficientScope?: boolean;
  noCharacters: boolean;
}

@inject('userStore')
@observer
export class UserAccount extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      characters: {},
      noCharacters: false,
      selectedCharIndex: 0,
      selectedAvatarIndex: 0,
    };
  }

  componentDidMount() {
    this.getCharacters();
  }

  private selectedCharacter(): CharacterModel {
    const { selectedRealm, selectedCharIndex } = this.state;
    const char = get(this.state, `characters[${selectedRealm}][${selectedCharIndex}]`);
    return char;
  }

  async getCharacters() {
    try {
      const res = await UserService.getCharacters() as any;
      if (res.characters) {
        if (res.characters.length === 0) {
          this.setState({ noCharacters: true });
          return;
        }
        const characters = groupBy(res.characters, 'realm');
        this.setState({
          characters,
          selectedRealm: res.characters[0].realm,
          insufficientScope: false,
        });
      } else {
        this.setState({ insufficientScope: true });
      }
    } catch (e) {
      console.error(e);
    }
  }

  onRealmSelect(event: any) {
    this.setState({
      selectedRealm: event.target.value,
      selectedCharIndex: 0,
      selectedAvatarIndex: 0,
    });
  }

  onCharSelect(event: any) {
    this.setState({
      selectedCharIndex: event.target.value as any,
      selectedAvatarIndex: 0,
    });
  }

  onAvatarSelect(selectedAvatarIndex: number) {
    this.setState({ selectedAvatarIndex });
  }

  renderDropDowns() {
    if (!this.selectedCharacter()) {
      return <div></div>;
    }
    return (
      <div>
        <h2>Set your default character</h2>
        <div style={{ margin: '0 10px 10px 0', display: 'inline-block' }}>
          <select value={this.selectedCharacter().realm}
            onChange={event => this.onRealmSelect(event)}>
            {map(this.state.characters, (_, realm: string) => {
              return <option key={`realm${realm}`}>{realm}</option>;
            })}
          </select>
          <select style={{ marginLeft: '5px' }}
            onChange={event => this.onCharSelect(event)}>
            {map(this.state.characters[this.state.selectedRealm!], (value, index) => {
              return <option key={this.state.selectedRealm! + index} value={index}>{value.name}</option>;
            })}
          </select>
        </div>

        <a onClick={() => this.onSave()}>Save</a>
        <div className="avatar-list">
          {this.selectedCharacter().avatarList!.map((val, index) => {
            const avatarClass = this.state.selectedAvatarIndex === index ? 'avatar-list__item--selected' : '';
            return (
              <div key={index} className={`avatar-list__item ${avatarClass}`} onClick={() => this.onAvatarSelect(index)}>
                <img src={val.imageSrc}/>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private async onSave() {
    const { name, guild, realm } = this.selectedCharacter();
    const selectedAvatar = this.selectedCharacter().avatarList![this.state.selectedAvatarIndex].title;
    const charClass = CharacterService.getClass(this.selectedCharacter().class);
    const data = {
      character_name: name,
      character_class: charClass.name,
      character_guild: guild,
      character_realm: realm,
      character_avatar: selectedAvatar,
    };

    await UserService.saveCharacter(data);
  }

  private logout() {
    this.props.userStore!.resetUser();
    window.location.pathname = '/';
  }

  private renderScopeError() {
    return (
      <div>
        <p>
          To set your default character
          we need access to your WoW profile.
        </p>
        <ul>
          <li><a href="https://us.battle.net/account/management/authorizations.html"
            target="_blank">Navigate to your Battle.net Authorized Applications</a></li>
          <li>Remove Classic WoW Forums</li>
          <li>Log out and back into Classic WoW Forums</li>
          <li>Grant Classic WoW Forums access to your WoW profile</li>
        </ul>
      </div>
    );
  }

  render() {

    if (this.state.noCharacters) {
      return <div>You have no WoW characters in your account.</div>;
    }

    // user must be logged in to view this page
    if (!this.props.userStore!.user) {
      return <div></div>;
    }

    const { battletag, character_name, character_class, character_guild, character_realm, character_avatar } = this.props.userStore!.user!;
    const { insufficientScope } = this.state;

    return (
      <ScrollToTop>
        <ContentContainer style={{ minHeight: '500px', paddingTop: '40px' }}>
          <div className="flex" style={{ marginBottom: '20px' }}>
            {character_avatar && <Portrait imageSrc={CharacterService.getAvatar(character_avatar!)}/>}
            <div style={{ paddingLeft: '10px' }}>
              {battletag && <div><b>Battletag: </b>{battletag}</div>}
              {character_name && <div><b>Character: </b>{character_name}</div>}
              {character_class && <div><b>Class: </b>{character_class}</div>}
              {character_guild && <div><b>Guild: </b>{character_guild}</div>}
              {character_realm && <div><b>Realm: </b>{character_realm}</div>}
            </div>
            <div className="flex-1" style={{ textAlign: 'right' }}>
              <a onClick={() => this.logout()}>Logout</a>
            </div>
          </div>

          <div>
            {insufficientScope === true ? this.renderScopeError() : this.renderDropDowns()}
          </div>

        </ContentContainer>
      </ScrollToTop>
    );
  }
}
