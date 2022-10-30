import { ActionType } from 'typesafe-actions';
import * as appActions from './app/actions';
import * as animalsActions from './animals/actions';
import * as placesActions from './places/actions';
import * as advertisementsActions from './advertisements/actions';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'rdx';

const allActions = {
  appActions,
  animalsActions,
  placesActions,
  advertisementsActions,
};

export type RootActions = ActionType<typeof allActions>;
export type ThunkAppType = ThunkAction<
  Promise<void>,
  RootState,
  undefined,
  RootActions
>;
