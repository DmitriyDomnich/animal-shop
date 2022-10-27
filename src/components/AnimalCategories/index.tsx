import React from 'react';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import {
  DocumentData,
  FirestoreDataConverter,
  orderBy,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { useAppCollectionDataOnce } from 'hooks/useAppCollectionDataOnce';
import { AnimalTypeModel } from 'models/AnimalTypeModel';
import AnimalCaterogyCard from './AnimalCaterogyCard';

const postConverter: FirestoreDataConverter<AnimalTypeModel> = {
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

const AnimalCategories = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [animalTypes] = useAppCollectionDataOnce<AnimalTypeModel>(
    'animal-types',
    postConverter,
    [orderBy('name')]
  );

  return (
    <div className='my-16'>
      <h2 className='text-5xl text-center my-6 text-sky-900 dark:text-sky-300'>
        {dictionary.animalCategories}
      </h2>
      <div className='flex flex-wrap w-full p-3 md:p-5 space-x-4 space-y-3'>
        {animalTypes &&
          (animalTypes as AnimalTypeModel[]).map(
            (animalType: AnimalTypeModel) => (
              <AnimalCaterogyCard animalType={animalType} key={animalType.id} />
            )
          )}
      </div>
    </div>
  );
};

export default AnimalCategories;
