import { createSlice } from '@reduxjs/toolkit';
import { Action } from '../store';
import { SIGN_IN, SIGN_UP, USER_UPDATE, PASSWORD_UPDATE } from './actions';

const errorKeys = [SIGN_IN, SIGN_UP, USER_UPDATE, PASSWORD_UPDATE] as const;
type ErrorKeys = { [key in typeof errorKeys[number]]?: string };

export type AuthSlice = {
  user: User | null;
  authorized: boolean;
  pendingAuth: boolean;
  loading: boolean;
  errorMessage: ErrorKeys;
};

export default createSlice({
  name: 'auth',
  initialState: {
    user: null,
    authorized: false,
    pendingAuth: false,
    loading: false,
    errorMessage: {},
  } as AuthSlice,
  reducers: {
    signIn: (state, action: Action<{ user: User }>) => {
      const { user } = action.payload;
      state.user = user;
      state.authorized = true;
      state.pendingAuth = false;
    },
    signOut: state => {
      state.user = null;
      state.authorized = false;
    },
    setUser: (state, action: Action<User>) => {
      state.user = action.payload;
    },
    setPendingAuth: (state, action: Action<boolean>) => {
      state.pendingAuth = action.payload;
    },
    setLoading: (state, action: Action<boolean>) => {
      state.loading = action.payload;
    },
    setErrorMessage: (state, action: Action<ErrorKeys>) => {
      state.errorMessage = action.payload;
    },
  },
});
