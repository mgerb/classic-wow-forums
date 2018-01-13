import { AvatarModel } from './avatar';

export interface CharacterModel {
  achievementPoints: number;
  battlegroup: string;
  class: number;
  gender: number;
  guild: string;
  lastModified: number;
  level: number;
  name: string;
  race: number;
  realm: string;
  spec: any;

  avatarList?: AvatarModel[];
  races?: number[];
}
