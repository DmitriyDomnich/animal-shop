import { AnimalTypeModel } from 'models/AnimalTypeModel';
import { ActionType, getType } from 'typesafe-actions';
import * as Actions from './actions';

export interface AnimalsState {
  animalTypes: AnimalTypeModel[] | null;
}
export type AnimalsActions = ActionType<typeof Actions>;

const initialState: AnimalsState = {
  animalTypes: null,
};

export const animalsReducer = (
  state: AnimalsState = initialState,
  action: AnimalsActions
): AnimalsState => {
  switch (action.type) {
    case getType(Actions.setAnimalType): {
      return {
        ...state,
        animalTypes: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
