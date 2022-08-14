import { call, put, take, takeEvery, delay, fork, cancel, retry, cancelled } from 'redux-saga/effects';
import { Task, EventChannel, eventChannel } from 'redux-saga';
import authSlice from './slice';
import api, { getErrorMessage, setAccessToken, getAccessToken, dropAccessToken } from 'api';
import { SIGN_IN, SignInCredentials, SIGN_OUT, SIGN_UP, SignUpCredentials, USER_UPDATE, PASSWORD_UPDATE, UpdatePasswordArgs, signOut, SYNC_ACCESS_TOKEN } from './actions';
import { Action } from '../store';
import { replace } from 'connected-react-router';

const REFRESH_TOKEN_TIMEOUT = (eval(process.env.REACT_APP_REFRESH_TOKEN_TIMEOUT as string) || 60 * 5) * 1000;

const STORE_SET_USER = authSlice.actions.setUser.toString();

function subscribe(bc: BroadcastChannel) {
  return eventChannel(emit => {
    bc.onmessage = event => {
      const { type, payload }: Action = event.data;
      switch (type) {
        case SIGN_IN:
          setAccessToken(payload.token);
          emit(replace('/main'));
          emit(authSlice.actions.signIn(payload));
          break;

        case SIGN_OUT:
          emit(authSlice.actions.signOut());
          dropAccessToken();
          break;

        case STORE_SET_USER:
          emit(authSlice.actions.setUser(payload));
          break;

        case SYNC_ACCESS_TOKEN:
          setAccessToken(payload);
          break;

        default:
          break;
      }
    };
    return () => {
      bc.close();
    };
  });
}

function* syncAccessToken(bc: BroadcastChannel, action: Action<string>) {
  const token = action.payload;
  yield call(setAccessToken, token);
  yield call([bc, bc.postMessage], { type: SYNC_ACCESS_TOKEN, payload: token });
}

function* syncAccessTokenWorker(bc: BroadcastChannel) {
  yield takeEvery(SYNC_ACCESS_TOKEN, syncAccessToken, bc);

  const channel: EventChannel<Action> = yield call(subscribe, bc);
  try {
    while (true) {
      const action: Action = yield take(channel);
      yield put(action);
    }
  } finally {
    const result: boolean = yield cancelled();
    if (result) channel.close();
  }
}

function* signInWorker(action: Action<SignInCredentials>, bc: BroadcastChannel) {
  try {
    yield put(authSlice.actions.setErrorMessage({}));
    yield put(authSlice.actions.setLoading(true));
    const response: Awaited<ReturnType<typeof api.signIn>> = yield call(() => api.signIn(action.payload));
    yield call(setAccessToken, response.data.token);
    yield put(authSlice.actions.signIn(response.data));
    yield call([localStorage, localStorage.setItem], 'authorized', '1');
    yield call([bc, bc.postMessage], { type: SIGN_IN, payload: response.data });
    yield put(replace('/main'));
  } catch (error) {
    yield put(authSlice.actions.setErrorMessage({ [SIGN_IN]: getErrorMessage(error) }));
    throw error;
  } finally {
    yield put(authSlice.actions.setLoading(false));
  }
}

function* autoSignInWorker() {
  try {
    yield put(authSlice.actions.setPendingAuth(true));
    const result: ReturnType<typeof getAccessToken> = yield call(getAccessToken);
    if (result) {
      yield call(setAccessToken, result);
      const response: Awaited<ReturnType<typeof api.getUser>> = yield call(api.getUser);
      yield put(authSlice.actions.signIn({ user: response.data.user }));
    } else {
      const response: Awaited<ReturnType<typeof api.autoSignIn>> = yield call(api.autoSignIn);
      yield call([localStorage, localStorage.setItem], 'token_last_refresh', new Date().toISOString());
      yield put({ type: SYNC_ACCESS_TOKEN, payload: response.data.token });
      yield put(authSlice.actions.signIn({ user: response.data.user }));
    }
    yield put(replace('/main'));
  } catch (error) {
    console.error(error);
    yield put(authSlice.actions.setPendingAuth(false));
    yield call([localStorage, localStorage.removeItem], 'authorized');
  }
}

function* signOutWorker(bc: BroadcastChannel) {
  try {
    yield put(authSlice.actions.setPendingAuth(true));
    yield call(api.signOut);
  } catch (error) {
    throw error;
  } finally {
    yield put(authSlice.actions.setPendingAuth(false));
    yield put(authSlice.actions.signOut());
    yield call([localStorage, localStorage.removeItem], 'authorized');
    yield call(dropAccessToken);
    yield call([bc, bc.postMessage], { type: SIGN_OUT });
  }
}

function* signUpWorker(action: Action<SignUpCredentials>) {
  try {
    yield put(authSlice.actions.setErrorMessage({}));
    yield put(authSlice.actions.setLoading(true));
    yield call(() => api.signUp(action.payload));
    yield put(replace('/'));
  } catch (error) {
    console.error(error);
    yield put(authSlice.actions.setErrorMessage({ [SIGN_UP]: getErrorMessage(error) }));
  } finally {
    yield put(authSlice.actions.setLoading(false));
  }
}

function* refreshTokenWorker() {
  try {
    while (true) {
      yield delay(REFRESH_TOKEN_TIMEOUT);
      const last_refresh: string = yield call([localStorage, localStorage.getItem], 'token_last_refresh');
      if (new Date().getTime() - new Date(last_refresh).getTime() > REFRESH_TOKEN_TIMEOUT) {
        yield call([localStorage, localStorage.setItem], 'token_last_refresh', new Date().toISOString());
        const response: Awaited<ReturnType<typeof api.refreshToken>> = yield retry(3, 20 * 1000, api.refreshToken);
        yield put({ type: SYNC_ACCESS_TOKEN, payload: response.data.token });
      }
    }
  } catch (error) {
    yield call(signOut);
  }
}

function* updateUserWorker(bc: BroadcastChannel, action: Action<User>) {
  try {
    yield put(authSlice.actions.setErrorMessage({}));
    yield put(authSlice.actions.setLoading(true));
    const response: Awaited<ReturnType<typeof api.updateUser>> = yield call(() => api.updateUser(action.payload));
    yield put(authSlice.actions.setUser(response.data.user));
    yield call([bc, bc.postMessage], { type: STORE_SET_USER, payload: response.data.user });
  } catch (error) {
    console.error(error);
    yield put(authSlice.actions.setErrorMessage({ [USER_UPDATE]: getErrorMessage(error) }));
  } finally {
    yield put(authSlice.actions.setLoading(false));
  }
}

function* updatePasswordWorker(action: Action<UpdatePasswordArgs>) {
  try {
    yield put(authSlice.actions.setErrorMessage({}));
    yield put(authSlice.actions.setLoading(true));
    yield call(() => api.updatePassword(action.payload));
  } catch (error) {
    console.error(error);
    yield put(authSlice.actions.setErrorMessage({ [PASSWORD_UPDATE]: getErrorMessage(error) }));
  } finally {
    yield put(authSlice.actions.setLoading(false));
  }
}

function* authWather(bc: BroadcastChannel) {
  const signInAction: Action<SignInCredentials> = yield take([SIGN_IN, authSlice.actions.signIn.toString()]);
  if (signInAction.type === SIGN_IN) yield call(signInWorker, signInAction, bc);

  const updateUserTask: Task = yield takeEvery(USER_UPDATE, updateUserWorker, bc);
  const updatePasswordTask: Task = yield takeEvery(PASSWORD_UPDATE, updatePasswordWorker);
  const refreshTokenTask: Task = yield fork(refreshTokenWorker);

  const signOutAction: Action = yield take([SIGN_OUT, authSlice.actions.signOut.toString()]);

  yield cancel([updateUserTask, updatePasswordTask, refreshTokenTask]);
  if (signOutAction.type === SIGN_OUT) yield call(signOutWorker, bc);
}

export default function* main() {
  yield takeEvery(SIGN_UP, signUpWorker);

  const bc: BroadcastChannel = yield call(() => new BroadcastChannel('auth'));
  yield fork(syncAccessTokenWorker, bc);

  const result: boolean = yield call([localStorage, localStorage.getItem], 'authorized');
  if (result) yield fork(autoSignInWorker);

  while (true) {
    try {
      yield call(authWather, bc);
    } catch (error) {
      console.error(error);
    }
  }
}
