import axios, { AxiosError } from 'axios';
import { SignInCredentials, signOut, SignUpCredentials, UserData, UpdatePasswordArgs } from 'redux-manager';

const DEFAULT_ERROR_MESSAGE = 'An unexpected problem has occurred, please try again later.';
axios.interceptors.response.use(
  response => {
    if (response.data.message) console.log(response.data.message);
    return response;
  },
  error => {
    let message = DEFAULT_ERROR_MESSAGE;
    if (error.response?.data) {
      const dataType = typeof error.response.data;
      if (dataType === 'string') message = error.response.data;
      else if (dataType === 'object') message = error.response.data.message;
    }
    console.log(message);
    if (error.response?.status === 401) signOut();
    throw error;
  }
);

const endpoints = {
  signIn: '/api/auth/sign-in',
  signUp: '/api/auth/sign-up',
  signOut: '/api/auth/sign-out',
  user: '/api/auth/user',
  updatePassword: '/api/auth/update-password',
  refreshToken: '/api/auth/refresh-token',
  autoSignIn: '/api/auth/auto-sign-in',
};

const api = {
  signIn: (credentials: SignInCredentials) => axios.post<{ token: string; user: User }>(endpoints.signIn, credentials),
  signUp: (credentials: SignUpCredentials) => axios.post(endpoints.signUp, credentials),
  signOut: () => axios.post(endpoints.signOut),
  updateUser: (data: UserData) => axios.post<{ user: User }>(endpoints.user, data),
  getUser: () => axios.get<{ user: User }>(endpoints.user),
  updatePassword: (data: UpdatePasswordArgs) => axios.post(endpoints.updatePassword, data),
  refreshToken: () => axios.post<{ token: string }>(endpoints.refreshToken),
  autoSignIn: () => axios.post<{ token: string; user: User }>(endpoints.autoSignIn),
};

export type ApiError = AxiosError<{ message?: string }>;

export const isApiError = (payload: any): payload is ApiError => axios.isAxiosError(payload);

export const getErrorMessage = (e: unknown): string => (isApiError(e) ? e.response?.data.message || 'Oops, Something went wrong...' : (e as Error).message);

export const setAccessToken = (token: string) => {
  axios.defaults.headers.common['Authorization'] = token;
  sessionStorage.setItem('access_token', token);
};

export const getAccessToken = () => {
  return sessionStorage.getItem('access_token');
};

export const dropAccessToken = () => {
  axios.defaults.headers.common['Authorization'] = '';
  sessionStorage.removeItem('access_token');
};

export default api;
