import { action, observable } from 'mobx';
import { UserModel } from '../model';
import { resetAuthorizationHeader, setAuthorizationHeader } from '../axios/axios';

export class UserStore {

  @observable user?: UserModel;

  constructor() {
    // use timeout or axios won't be defined
    setTimeout(() => {
      this.getUserFromStorage();
    });
  }

  @action setUser(user: UserModel) {
    localStorage.setItem('user', JSON.stringify(user));
    this.getUserFromStorage();
  }

  @action private getUserFromStorage(): void {
    const u = localStorage.getItem('user');
    if (u) {
      this.user = JSON.parse(u);
      setAuthorizationHeader(this.user!.token);
    }
  }

  // when the user logs out
  @action resetUser() {
    this.user = undefined;
    resetAuthorizationHeader();
    localStorage.removeItem('user');
  }

}

export default new UserStore();
