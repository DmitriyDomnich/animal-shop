import { AnimalType, Places } from 'locales/models';

export interface PictureModel {
  fileName: string;
  url: string;
}

export interface AdvertisementModel {
  id: string;
  date: any;
  name: string;
  description: string;
  price: number;
  type: AnimalType;
  pictures: Array<PictureModel | null>;
  place: Places;
  userId: string;
  userName: string;
  phoneNumber: string;
}
