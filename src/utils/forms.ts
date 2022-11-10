import { PictureModel } from 'models/AdvertisimentModel';

export const countPhotos = (pictures: (PictureModel | null)[]) =>
  pictures.reduce((acc, curr) => (curr ? acc + 1 : acc), 0);
