import axios from '../axios/axios';
import userStore from '../stores/user-store';

// fetch user and store in local storage
const authorize = async (code: string): Promise<void> => {
  try {
    const res = await axios.post('/api/battlenet/authorize', { code });
    userStore.setUser(res.data.data);
  } catch (e) {
    console.error(e);
  }
};
  
export const UserService = {
  authorize,
};
