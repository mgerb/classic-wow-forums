import { action, observable } from 'mobx';
import { UserModel } from '../model';
import { resetAuthorizationHeader } from '../axios/axios';

export class UserStore {

  @observable user?: UserModel;

  constructor() {
    // use timeout or axios won't be defined
    setTimeout(() => {
      this.getUserFromStorage();
    });
  }

  @action private getUserFromStorage(): void {
    const u = localStorage.getItem('user');
    if (u) {
      this.user = JSON.parse(u);
    }
  }

  @action setUser(user: UserModel) {
    localStorage.setItem('user', JSON.stringify(user));
    this.getUserFromStorage();
  }

  @action public setCharacterInfo(info: {[key: string]: string}) {
    const { character_avatar, character_class, character_guild, character_name, character_realm } = info;
    const user = {...this.user!, 
      character_avatar,
      character_class,
      character_guild,
      character_name,
      character_realm,
    };
    this.setUser(user);
  }

  // when the user logs out
  @action resetUser() {
    this.user = undefined;
    resetAuthorizationHeader();
    localStorage.removeItem('user');
  }

}

export default new UserStore();
