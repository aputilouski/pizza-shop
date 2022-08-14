import { store } from '../store';

export const SIGN_IN = '##AUTH/SIGN_IN';
export const SIGN_OUT = '##AUTH/SIGN_OUT';
export type SignInCredentials = { username: string; password: string };
export const signIn = (payload: SignInCredentials) => {
  store.dispatch({ type: SIGN_IN, payload });
};
export const signOut = () => {
  store.dispatch({ type: SIGN_OUT });
};

export const SIGN_UP = '##AUTH/SIGN_UP';
export type SignUpCredentials = SignInCredentials & { name: string; confirmPassword: string };
export const signUp = (payload: SignUpCredentials) => {
  store.dispatch({ type: SIGN_UP, payload });
};

export const USER_UPDATE = '##AUTH/USER_UPDATE';
export type UserData = Omit<User, 'uuid'>;
export const updateUser = (payload: UserData) => {
  store.dispatch({ type: USER_UPDATE, payload });
};

export const PASSWORD_UPDATE = '##AUTH/PASSWORD_UPDATE';
export type UpdatePasswordArgs = { currentPassword: string; password: string; confirmPassword: string };
export const updatePassword = (payload: UpdatePasswordArgs) => {
  store.dispatch({ type: PASSWORD_UPDATE, payload });
};

export const SYNC_ACCESS_TOKEN = '##AUTH/SYNC_ACCESS_TOKEN';
