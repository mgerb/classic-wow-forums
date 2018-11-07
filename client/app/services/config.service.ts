import axios from '../axios/axios';
import { IConfig } from '../model/config';

const getConfig = async (): Promise<IConfig> => {
  const res = await axios.get('/api/config');
  return res.data.data;
};

export const ConfigService = {
  getConfig,
};
