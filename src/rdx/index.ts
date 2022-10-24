import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { appReducer, AppState } from './app/reducer';

export interface RootState {
  app: AppState;
}

const rootReducer = combineReducers({
  app: appReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
