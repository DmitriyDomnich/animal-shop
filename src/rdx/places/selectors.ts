import { PlaceModel } from 'models/PlaceModel';
import { RootState } from 'rdx';

export const selectPlaces = ({
  places,
}: RootState): [PlaceModel[], boolean, string | null] => [
  places.list,
  places.isListLoading,
  places.error,
];
