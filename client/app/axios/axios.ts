import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import fingerprintjs2 from 'fingerprintjs2';
import nprogress from 'nprogress';
import userStore from '../stores/user-store';

nprogress.configure({ showSpinner: false });

// create our own instance of axios so we can set request headers
const ax: AxiosInstance = axios.create();
export default ax;

// setup our axios instance - must be done before app bootstraps
export const initializeAxios = (): Promise<void> => {
  return new Promise((resolve: any) => {
    ax.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        nprogress.start();
        return config;
      },
      (error: any) => {
        return error;
      },
    );

    // response interceptors
    ax.interceptors.response.use(
      (config: AxiosResponse) => {
        nprogress.done();
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

    const user = localStorage.getItem('user');

    if (user) {
      const jwt = JSON.parse(user!).token;
      setAuthorizationHeader(jwt);
    }

    new fingerprintjs2().get((result: string) => {
      axios.defaults.headers.common['fp'] = result;
      resolve();
    });
  });
};

export function setAuthorizationHeader(jwt: string): void {
  ax.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
}

export function resetAuthorizationHeader(): void {
  ax.defaults.headers.common['Authorization'] = '';
}
