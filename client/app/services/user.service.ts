import axios from '../axios/axios';
import { UserModel } from '../model';

const storeUser = (user: UserModel): void => {
  localStorage.setItem('user', JSON.stringify(user));
}

const getUser = (): UserModel => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

// fetch user and store in local storage
const authorize = async (code: string): Promise<void> => {
  try {
    const res = await axios.post('/api/battlenet/authorize', { code });
    UserService.storeUser(res.data.data);
  } catch (e) {
    console.error(e);
  }
}
  
export const UserService = {
  storeUser,
  getUser,
  authorize,
}
