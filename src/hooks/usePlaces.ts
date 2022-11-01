import { PlaceModel } from 'models/PlaceModel';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import { selectPlaces } from 'rdx/places/selectors';
import { getAllPlaces } from 'rdx/places/thunks';
import { useEffect } from 'react';

export const usePlaces = (): [PlaceModel[], boolean, string | null] => {
  const [places, loading, error] = useAppSelector(selectPlaces);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllPlaces());
  }, [dispatch]);

  return [places, loading, error];
};
