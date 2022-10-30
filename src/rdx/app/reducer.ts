import { allLocales } from 'locales/allLocales';
import { Languages, LanguageDictionary } from 'locales/models';
import moment from 'moment';
import { ActionType, getType } from 'typesafe-actions';
import * as Actions from './actions';
import 'moment/locale/uk';

export type Theme = 'dark' | 'light';
export type AppActions = ActionType<typeof Actions>;

export interface AppState {
  theme: Theme;
  locale: {
    name: Languages;
    dictionary: LanguageDictionary;
  };
}

const prefferedLanguage =
  (localStorage.getItem('locale') as Languages) ||
  (navigator.language.slice(0, 2) as Languages);
moment.locale(prefferedLanguage === 'ua' ? 'uk' : prefferedLanguage);
if (!localStorage.getItem('locale')) {
  localStorage.setItem('locale', prefferedLanguage);
}

let theme = localStorage.getItem('theme') as Theme | null;
if (!theme) {
  const currentHours = new Date().getHours();
  theme = currentHours > 8 && currentHours < 16 ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
}

const initialState: AppState = {
  theme,
  locale: {
    name: prefferedLanguage,
    dictionary: allLocales[prefferedLanguage],
  },
};

export const appReducer = (
  state: AppState = initialState,
  action: AppActions
): AppState => {
  switch (action.type) {
    case getType(Actions.setLocale): {
      const locale = action.payload;
      localStorage.setItem('locale', locale);
      moment.locale(locale === 'ua' ? 'uk' : locale);
      return {
        ...state,
        locale: {
          name: locale,
          dictionary: allLocales[locale],
        },
      };
    }
    case getType(Actions.setTheme): {
      const theme = action.payload;
      localStorage.setItem('theme', theme);
      if (theme === 'light') {
        document.body.classList.remove('dark');
      } else {
        document.body.classList.add('dark');
      }
      return {
        ...state,
        theme: action.payload,
      };
    }
    default:
      return state;
  }
};
