import { cloneDeep } from 'lodash';
import axios from '../axios/axios';
import { CategoryModel } from '../model';

export class CategoryService {
  private static categoryCache: CategoryModel[];

  public static async getCategories(): Promise<CategoryModel[]> {
    // return cache if it exists
    if (CategoryService.categoryCache) {
      return Promise.resolve(cloneDeep(CategoryService.categoryCache));
    }

    const res = await axios.get('/api/category');
    CategoryService.categoryCache = cloneDeep(res.data.data);
    return res.data.data;
  }
}
