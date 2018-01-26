import axios from '../axios/axios';
import { ThreadModel } from '../model';

const getCategoryThreads = async (category_id: number): Promise<ThreadModel[]> => {
  try {
    const res = await axios.get(`/api/thread?category_id=${category_id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
  }

  return [];
};

const getThread = async (thread_id: string | number): Promise<ThreadModel> => {
  try {
    const res = await axios.get(`/api/thread/${thread_id}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
  }

  return [] as any;
};

export interface ModUpdate {
  id: number;
  sticky?: boolean;
  locked?: boolean;
  hidden?: boolean;
}

const modUpdateThread = async (params: ModUpdate): Promise<any> => {
  try {
    const res = await axios.put('/api/thread/mod', params);
    return res.data.data;
  } catch (e) {
    console.log(e);
  }
};

const modUpdateReply = async (params: { id: number, hidden?: boolean }): Promise<any> => {
  try {
    const res = await axios.put('/api/reply/mod', params);
    return res.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const ThreadService = {
  getCategoryThreads,
  getThread,
  modUpdateReply,
  modUpdateThread,
};
