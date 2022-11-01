import {
  DocumentData,
  FirestoreDataConverter,
  orderBy,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { AnimalTypeModel } from 'models/AnimalTypeModel';
import { setAnimalType } from 'rdx/animals/actions';
import { selectAnimalTypes } from 'rdx/animals/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import { useEffect } from 'react';
import { useAppCollectionDataOnce } from './useAppCollectionDataOnce';

const animalTypeConverter: FirestoreDataConverter<AnimalTypeModel> = {
  toFirestore(animalType: WithFieldValue<AnimalTypeModel>): DocumentData {
    return { name: animalType.name, imgURL: animalType.imgURL };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AnimalTypeModel {
    const data = snapshot.data(options);
    return {
      imgURL: data.imgURL,
      name: data.name,
      id: snapshot.id,
    };
  },
};

export const useAnimalTypes = () => {
  const dispatch = useAppDispatch();
  const animalTypesRedux = useAppSelector(selectAnimalTypes);
  const [animalTypes, loading, error] =
    useAppCollectionDataOnce<AnimalTypeModel>({
      path: 'animal-types',
      converter: animalTypeConverter,
      queryConstraints: [orderBy('name')],
    });

  useEffect(() => {
    dispatch(setAnimalType(animalTypes as AnimalTypeModel[]));
  }, [animalTypes, dispatch]);

  return [animalTypesRedux || animalTypes, loading, error];
};
