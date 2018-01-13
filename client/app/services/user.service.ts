import { chain } from 'lodash';
import axios from '../axios/axios';
import userStore from '../stores/user-store';
import { CharacterModel } from '../model';
import { CharacterService } from './character.service';

// fetch user and store in local storage
const authorize = async (code: string): Promise<void> => {
  try {
    const res = await axios.post('/api/user/authorize', { code });
    userStore.setUser(res.data.data);
  } catch (e) {
    console.error(e);
  }
};

const getCharacters = async (): Promise<any> => {
  try {
    const res = await axios.get('/api/user/characters');
    const characters = res.data.data.characters;
    if (!!characters) {
      res.data.data.characters = filterCharacters(characters);
    }
    return res.data.data;
  } catch (e) {
    console.error(e);
  }
  return null;
};

const filterCharacters = (chars: CharacterModel[]): CharacterModel[] => {
  return chain(chars)
    .filter(c => !!CharacterService.getClass(c.class))
    .map((c) => {
      c.races = CharacterService.getClass(c.class).races;
      c.avatarList = CharacterService.getFilteredAvatarList(c.races);
      return c;
    })
    .value();
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
