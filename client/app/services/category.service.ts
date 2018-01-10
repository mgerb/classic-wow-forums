import { cloneDeep } from 'lodash';
import axios from '../axios/axios';
import { CategoryModel } from '../model';

let categoryCache: CategoryModel[];
const getCategories = async () => {
  // return cache if it exists
  if (categoryCache) {
    return Promise.resolve(cloneDeep(categoryCache));
  }

  const res = await axios.get('/api/category');
  categoryCache = cloneDeep(res.data.data);
  return res.data.data;
};

export const CategoryService = {
  getCategories,
};
