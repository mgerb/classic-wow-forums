import axios from '../axios/axios';
import { UserModel } from '../model';

export class UserService {

  public static storeUser(user: UserModel): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public static getUser(): UserModel {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  // fetch user and store in local storage
  public static async authorize(code: string): Promise<void> {
    try {
      const res = await axios.post('/api/battlenet/authorize', { code });
      UserService.storeUser(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }
}
