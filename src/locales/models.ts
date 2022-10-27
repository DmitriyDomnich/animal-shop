export interface LanguageDictionary {
  hello: string;
  welcome: string;
  signIn: string;
  ukrainian: string;
  english: string;
  userOptions: string;
  signOut: string;
  addAdvertisement: string;
  searchBarText: string;
  search: string;
  regions: string[];
  filterByRegion: string;
  animalCategories: string;
  animalTypes: Record<AnimalTypes, string>;
  advertisementsHomePageText: string;
  hryvnia: string;
}

export type AnimalTypes =
  | 'Dog'
  | 'Cat'
  | 'Other'
  | 'Bird'
  | 'Aqua'
  | 'Reptile'
  | 'Rodent'
  | 'Exotic';

export type Languages = 'ua' | 'en';
