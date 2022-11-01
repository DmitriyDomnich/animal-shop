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
  AnimalType: Record<AnimalType, string>;
  advertisementsHomePageText: string;
  hryvnia: string;
  places: Record<Places, string>;
  region: string;
  createAdvertisement: string;
  updateAdvertisement: string;
  describeInDetail: string;
  enterName: string;
  category: string;
  photo: string;
  photoText: string;
  description: string;
  writeMore: string;
  symbols: [string, string];
  location: string;
  contactDetails: string;
  yourName: string;
  email: string;
  phoneNumber: string;
  post: string;
  price: string;
  update: string;
  delete: string;
  free: string;
  yourAdvertisements: string;
  noUserAdvs: string;
  followedAdvertisements: string;
  noFollowedAdvs: string;
  of: string;
  published: string;
  publisher: string;
  showPhone: string;
  message: string;
  loadMore: string;
}
export type Places = 'KHR' | 'KY' | 'LV' | 'CHT' | 'CHN' | 'OD' | 'KHE';
export type AnimalType =
  | 'Dog'
  | 'Cat'
  | 'Other'
  | 'Bird'
  | 'Aqua'
  | 'Reptile'
  | 'Rodent'
  | 'Exotic';

export type Languages = 'ua' | 'en';
