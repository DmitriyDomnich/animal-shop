import { AnimalTypeModel } from 'models/AnimalTypeModel';
import { createAction } from 'typesafe-actions';
import { SET_ANIMAL_TYPES } from './action-types';

export const setAnimalType =
  createAction(SET_ANIMAL_TYPES)<AnimalTypeModel[]>();
