import { RootState } from 'rdx';

export const selectAppTheme = ({ app }: RootState) => app.theme;
export const selectAppLocale = ({ app }: RootState) => app.locale;
