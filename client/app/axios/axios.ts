import axios, { AxiosInstance, AxiosResponse } from 'axios';
import userStore from '../stores/user-store';

// create our own instance of axios so we can set request headers
const ax: AxiosInstance = axios.create();

// response interceptors
ax.interceptors.response.use(
  (config: AxiosResponse) => {
    return config;
  },
  (error: any) => {
    // if code is unauthorized (401) then logout if already logged in
    if (error.response.status === 401 && userStore.user) {
      userStore.resetUser();
    }

    return Promise.reject(error);
  },
);

export function setAuthorizationHeader(jwt: string): void {
  ax.defaults.headers.common['Authorization'] = jwt;
}

export function resetAuthorizationHeader(): void {
  ax.defaults.headers.common['Authorization'] = '';
}

export default ax;
