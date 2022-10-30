import { PlaceModel } from 'models/PlaceModel';
import { ActionType, getType } from 'typesafe-actions';
import { getAllPlacesAsyncAction } from './actions';

export interface PlacesState {
  list: PlaceModel[];
  isListLoading: boolean;
  error: string | null;
}

export type PlacesActions = ActionType<typeof getAllPlacesAsyncAction>;

const initialState: PlacesState = {
  list: [],
  isListLoading: false,
  error: null,
};

export const placesReducer = (
  state = initialState,
  action: PlacesActions
): PlacesState => {
  switch (action.type) {
    case getType(getAllPlacesAsyncAction.request):
      return {
        ...state,
        isListLoading: true,
        error: null,
      };
    case getType(getAllPlacesAsyncAction.success):
      return {
        ...state,
        list: action.payload,
        isListLoading: false,
      };
    case getType(getAllPlacesAsyncAction.failure):
      return {
        ...state,
        isListLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
