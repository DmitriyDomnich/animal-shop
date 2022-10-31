import { AdvertisementModel } from 'models/AdvertisimentModel';
import { selectUserFollowedAdvertisements } from 'rdx/advertisements/selectors';
import { getUserFollowedAdvertisements } from 'rdx/advertisements/thunks';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import { useEffect } from 'react';
import { useAppAuth } from './useAppAuth';

export const useUserFollowedAdvertisements = (): [
  AdvertisementModel[] | null,
  boolean,
  string | null
] => {
  const [user] = useAppAuth();
  const dispatch = useAppDispatch();
  const [followedAdvertisements, loading, error] = useAppSelector(
    selectUserFollowedAdvertisements
  );

  useEffect(() => {
    dispatch(getUserFollowedAdvertisements(user!.uid));
  }, [user, dispatch]);

  return [followedAdvertisements, loading, error];
};
