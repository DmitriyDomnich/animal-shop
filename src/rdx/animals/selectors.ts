import { RootState } from 'rdx';

export const selectAnimalTypes = ({ animals }: RootState) =>
  animals.animalTypes;
