import React from 'react';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import { AnimalTypeModel } from 'models/AnimalTypeModel';
import AnimalCaterogyCard from './AnimalCaterogyCard';
import { useAnimalTypes } from 'hooks/useAnimalTypes';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

const AnimalCategories = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [animalTypes] = useAnimalTypes();

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
