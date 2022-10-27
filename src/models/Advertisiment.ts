import { Timestamp } from 'firebase/firestore';
import { AnimalTypes } from 'locales/models';

interface Advertisement {
  id: string;
  age: number;
  color: string;
  date: Timestamp;
  description: string;
  facts: string[];
  price: number;
  type: AnimalTypes;
  pictures: string[];
}

export interface AdvertisementModel extends Advertisement {
  place: string;
}
export interface AdvertisementResponseModel extends AdvertisementModel {
  placeId: string;
}
