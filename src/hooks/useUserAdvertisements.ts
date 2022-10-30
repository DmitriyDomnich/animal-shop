import { AdvertisementModel } from 'models/AdvertisimentModel';
import { selectUserAdvertisements } from 'rdx/advertisements/selectors';
import { getUserAdvertisements } from 'rdx/advertisements/thunks';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import { useEffect } from 'react';
import { useAppAuth } from './useAppAuth';

export const useUserAdvertisements = (): [
  AdvertisementModel[] | null,
  boolean,
  string | null
] => {
  const [user] = useAppAuth();
  const dispatch = useAppDispatch();
  const [userAdvertisements, loading, error] = useAppSelector(
    selectUserAdvertisements
  );

  useEffect(() => {
    dispatch(getUserAdvertisements(user!.uid));
  }, [user, dispatch]);

  return [userAdvertisements, loading, error];
};
