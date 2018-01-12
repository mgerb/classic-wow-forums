import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { get, groupBy, map } from 'lodash';
import { ContentContainer, Portrait, ScrollToTop } from '../../components';
import { UserStore } from '../../stores/user-store';
import { UserService } from '../../services';
import { AvatarList, CharacterModel } from '../../model';
import './user-account.scss';

interface Props extends RouteComponentProps<any> {
  userStore?: UserStore;
}

interface State {
  characters: {[realm: string]: CharacterModel[]};
  selectedRealm?: string;
  selectedCharIndex: number;
}

@inject('userStore')
@observer
export class UserAccount extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      characters: {},
      selectedCharIndex: 0,
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
      const characters = groupBy(res, 'realm');
      this.setState({
        characters,
        selectedRealm: res[0].realm,
      });
    } catch (e) {
      console.error(e);
    }
  }

  onRealmSelect(event: any) {
    this.setState({ selectedRealm: event.target.value, selectedCharIndex: 0 });
  }

  onCharSelect(event: any) {
    this.setState({ selectedCharIndex: event.target.value as any });
  }

  renderDropDowns() {
    if (!this.selectedCharacter()) {
      return <div></div>;
    }
    return (
      <div style={{ marginBottom: '10px' }}>
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

        <div className="avatar-list">
          {AvatarList.map((val, index) => {
            return (
              <div key={index} className="avatar-list__item">
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
    const data = {
      character_name: name,
      character_class: 'Rogue', // todo get class from number
      character_guild: guild,
      character_realm: realm,
      character_avatar: 'Avatar', // TODO:
    };

    await UserService.saveCharacter(data);
  }

  render() {
    const { battletag, character_name, character_class, character_guild, character_realm } = this.props.userStore!.user!;

    return (
      <ScrollToTop>
        <ContentContainer style={{ minHeight: '500px' }}>
          <div className="flex">
            <Portrait imageSrc={require('../../assets/Tyren.gif')}/>
            <div style={{ paddingLeft: '10px' }}>
              {battletag && <div><b>Battletag: </b>{battletag}</div>}
              {character_name && <div><b>Character: </b>{character_name}</div>}
              {character_class && <div><b>Class: </b>{character_class}</div>}
              {character_guild && <div><b>Guild: </b>{character_guild}</div>}
              {character_realm && <div><b>Realm: </b>{character_realm}</div>}
            </div>
          </div>

          <div>
            <h2>Set a new default character</h2>
            {this.renderDropDowns()}
            <a onClick={() => this.onSave()}>Save</a>
          </div>

        </ContentContainer>
      </ScrollToTop>
    );
  }
}
