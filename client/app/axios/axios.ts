import axios, { AxiosInstance, AxiosResponse } from 'axios';

// create our own instance of axios so we can set request headers
const ax: AxiosInstance = axios.create();

// response interceptors
ax.interceptors.response.use(
  (config: AxiosResponse) => {
    return config;
  },
  (error: any) => {
    // TODO: log the user out if they get a 401
    // if code is unauthorized (401) then logout if already logged in
    // if (error.response.status === 401 && store.getState().user.loggedIn) {
    //   store.dispatch(userActions.logout());
    // }

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
