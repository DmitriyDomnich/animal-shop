import { Languages } from 'locales/models';
import { createAction } from 'typesafe-actions';
import { Theme } from './reducer';
import { SET_LOCALE, SET_THEME } from './action-types';

export const setTheme = createAction(SET_THEME)<Theme>();
export const setLocale = createAction(SET_LOCALE)<Languages>();
