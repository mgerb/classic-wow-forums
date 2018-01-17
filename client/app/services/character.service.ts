import { find, filter, get } from 'lodash';
import { AvatarModel } from '../model';

const getAvatar = (title?: string): any => {
  const av = find(avatarList, { title });
  return get(av, 'imageSrc') || avatarList[0].imageSrc;
};

const getClass = (index: number): {id: number, name: string; races: number[] } => {
  return find(classList, { id: index })!;
};

const getFilteredAvatarList = (raceIdList: number[]) => {
  return filter(avatarList, (av) => {
    return raceIdList.includes(av.raceId);
  });
};

// taken right from API data
const classList = [
  {
    id: 1,
    name: 'Warrior',
    races: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: 2,
    name: 'Paladin',
    races: [1, 3],
  },
  {
    id: 3,
    name: 'Hunter',
    races: [1, 4, 5, 6, 7],
  },
  {
    id: 4,
    name: 'Rogue',
    races: [1, 2, 3, 4, 5, 7, 8],
  },
  {
    id: 5,
    name: 'Priest',
    races: [1, 3, 4, 7, 8],
  },
  {
    id: 7,
    name: 'Shaman',
    races: [5, 6, 7],
  },
  {
    id: 8,
    name: 'Mage',
    races: [2, 3, 7, 8],
  },
  {
    id: 9,
    name: 'Warlock',
    races: [2, 3, 5, 8],
  },
  {
    id: 11,
    name: 'Druid',
    races: [4, 6],
  },
];

const avatarList: AvatarModel[] = [
  {
    raceId: 0,
    title: 'unknown',
    imageSrc: require('../assets/avatars/unknown.gif'),
  },
  {
    raceId: 1,
    title: 'dwarf_f',
    imageSrc: require('../assets/avatars/Dwarf_female.gif'),
  },
  {
    raceId: 1,
    title: 'dwarf_m',
    imageSrc: require('../assets/avatars/Dwarf_male.gif'),
  },
  {
    raceId: 2,
    title: 'gnome_f',
    imageSrc: require('../assets/avatars/Gnome_female.gif'),
  },
  {
    raceId: 2,
    title: 'gnome_m',
    imageSrc: require('../assets/avatars/Gnome_male.gif'),
  },
  {
    raceId: 3,
    title: 'human_f',
    imageSrc: require('../assets/avatars/Human_female.gif'),
  },
  {
    raceId: 3,
    title: 'human_m',
    imageSrc: require('../assets/avatars/Human_male.gif'),
  },
  {
    raceId: 4,
    title: 'night_elf_f',
    imageSrc: require('../assets/avatars/Night_elf_female.gif'),
  },
  {
    raceId: 4,
    title: 'night_elf_m',
    imageSrc: require('../assets/avatars/Night_elf_male.gif'),
  },
  {
    raceId: 5,
    title: 'orc_f',
    imageSrc: require('../assets/avatars/Orc_female.gif'),
  },
  {
    raceId: 5,
    title: 'orc_m',
    imageSrc: require('../assets/avatars/Orc_male.gif'),
  },
  {
    raceId: 6,
    title: 'tauren_f',
    imageSrc: require('../assets/avatars/Tauren_female.gif'),
  },
  {
    raceId: 6,
    title: 'tauren_m',
    imageSrc: require('../assets/avatars/Tauren_male.gif'),
  },
  {
    raceId: 7,
    title: 'troll_f',
    imageSrc: require('../assets/avatars/Troll_female.gif'),
  },
  {
    raceId: 7,
    title: 'troll_m',
    imageSrc: require('../assets/avatars/Troll_male.gif'),
  },
  {
    raceId: 8,
    title: 'undead_f',
    imageSrc: require('../assets/avatars/Undead_female.gif'),
  },
  {
    raceId: 8,
    title: 'undead_m',
    imageSrc: require('../assets/avatars/Undead_male.gif'),
  },
  {
    raceId: 0,
    title: 'ordinn',
    imageSrc: require('../assets/avatars/Ordinn.gif'),
  },
];

export const CharacterService = {
  avatarList,
  getAvatar,
  getClass,
  getFilteredAvatarList,
};
