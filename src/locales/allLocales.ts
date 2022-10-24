import { enLocale as en } from './en';
import { uaLocale as ua } from './ua';
import { LanguageDictionary, Languages } from './models';

export const allLocales: Record<Languages, LanguageDictionary> = {
  en,
  ua,
};
