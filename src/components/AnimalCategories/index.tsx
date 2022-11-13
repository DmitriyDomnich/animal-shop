import React, { useCallback } from 'react';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import { AnimalTypeModel } from 'models/AnimalTypeModel';
import AnimalCaterogyCard from './AnimalCaterogyCard';
import { useAnimalTypes } from 'hooks/useAnimalTypes';
import { useSearchParams } from 'react-router-dom';

const AnimalCategories = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [animalTypes] = useAnimalTypes();

  const [searchParams, setSearchParams] = useSearchParams();

  const handleTypeChoose = useCallback(
    (typeName: string | null) =>
      setSearchParams((prev) => {
        const newSearchParams = new URLSearchParams(prev);
        if (typeName) {
          newSearchParams.set('type', typeName);
        } else {
          newSearchParams.delete('type');
        }
        return newSearchParams;
      }),
    [setSearchParams]
  );

  return (
    <div className='my-16'>
      <h2 className='text-5xl text-center my-6 text-sky-900 dark:text-sky-300'>
        {dictionary.animalCategories}
      </h2>
      <div className='flex flex-wrap w-full justify-center lg:justify-start p-3 md:p-5 space-x-4 space-y-3'>
        {(animalTypes as AnimalTypeModel[])?.map((animalType) => (
          <AnimalCaterogyCard
            active={searchParams.get('type') === animalType.name}
            onChoose={handleTypeChoose}
            animalType={animalType}
            key={animalType.id}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimalCategories;
