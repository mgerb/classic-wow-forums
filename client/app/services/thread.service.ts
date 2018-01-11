import { orderBy } from 'lodash';
import axios from '../axios/axios';
import { ThreadModel } from '../model';

const getCategoryThreads = async (category_id: string): Promise<ThreadModel[]> => {
  try {
    const res = await axios.get(`/api/thread?category_id=${category_id}`);
    return orderBy(res.data.data as ThreadModel[], (thread: ThreadModel) => {
      return -(new Date(thread.updated_at));
    });
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

export const ThreadService = {
  getCategoryThreads,
  getThread,
};
