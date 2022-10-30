import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  advertisementsReducer,
  AdvertisementsState,
} from './advertisements/reducer';
import { animalsReducer, AnimalsState } from './animals/reducer';
import { appReducer, AppState } from './app/reducer';
import { placesReducer, PlacesState } from './places/reducer';

export interface RootState {
  app: AppState;
  animals: AnimalsState;
  places: PlacesState;
  advertisements: AdvertisementsState;
}

const rootReducer = combineReducers({
  app: appReducer,
  animals: animalsReducer,
  places: placesReducer,
  advertisements: advertisementsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
