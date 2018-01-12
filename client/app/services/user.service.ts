import axios from '../axios/axios';
import userStore from '../stores/user-store';
import { CharacterModel } from '../model';

// fetch user and store in local storage
const authorize = async (code: string): Promise<void> => {
  try {
    const res = await axios.post('/api/user/authorize', { code });
    userStore.setUser(res.data.data);
  } catch (e) {
    console.error(e);
  }
};

const getCharacters = async (): Promise<CharacterModel | null> => {
  try {
    const res = await axios.get('/api/user/characters');
    return res.data.data.characters;
  } catch (e) {
    console.error(e);
  }
  return null;
};

const saveCharacter = async (character: any): Promise<any> => {
  try {
    const res = await axios.put('/api/user/characters', character);
    const user = res.data.data;
    userStore.setCharacterInfo(user);
    return user;
  } catch (e) {
    console.error(e);
  }
  return null;
};
  
export const UserService = {
  authorize,
  saveCharacter,
  getCharacters,
};
