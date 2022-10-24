import { ActionType } from 'typesafe-actions';
import * as appActions from './app/actions';

const allActions = {
  appActions,
};

export type RootActions = ActionType<typeof allActions>;
