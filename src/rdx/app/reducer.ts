import { allLocales } from 'locales/allLocales';
import { Languages, LanguageDictionary } from 'locales/models';
import { ActionType, getType } from 'typesafe-actions';
import * as Actions from './actions';

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
      return {
        ...state,
        locale: {
          name: action.payload,
          dictionary: allLocales[action.payload],
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
