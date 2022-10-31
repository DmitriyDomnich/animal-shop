import { AdvertisementModel } from 'models/AdvertisimentModel';
import { RootState } from 'rdx';

export const selectUserAdvertisements = ({
  advertisements,
}: RootState): [AdvertisementModel[] | null, boolean, string | null] => {
  const { userAdvertisements: uA } = advertisements;
  return [uA.data, uA.loading, uA.error];
};

export const selectUserFollowedAdvertisements = ({
  advertisements,
}: RootState): [AdvertisementModel[] | null, boolean, string | null] => {
  const { followedAdvertisements: fA } = advertisements;
  return [fA.data, fA.loading, fA.error];
};
