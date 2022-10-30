import { PlaceModel } from 'models/PlaceModel';
import { createAsyncAction } from 'typesafe-actions';

enum PLACES_ACTIONS {
  GET_ALL_PLACES_START = '@places/GET_ALL_PLACES_START',
  GET_ALL_PLACES_SUCCESS = '@places/GET_ALL_PLACES_SUCCESS',
  GET_ALL_PLACES_FAILED = '@places/GET_ALL_PLACES_FAILED',
}

export const getAllPlacesAsyncAction = createAsyncAction(
  PLACES_ACTIONS.GET_ALL_PLACES_START,
  PLACES_ACTIONS.GET_ALL_PLACES_SUCCESS,
  PLACES_ACTIONS.GET_ALL_PLACES_FAILED
)<undefined, PlaceModel[], string>();
