import { AdvertisementModel } from 'models/AdvertisimentModel';
import { RootState } from 'rdx';

export const selectUserAdvertisements = ({
  advertisements,
}: RootState): [AdvertisementModel[] | null, boolean, string | null] => {
  const { userAdvertisements: uA } = advertisements;
  return [uA.data, uA.loading, uA.error];
};
