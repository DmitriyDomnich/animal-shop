import React, { useMemo } from 'react';
import { AnimalTypeModel } from 'models/AnimalTypeModel';
import { generateRandomLightColor } from 'utils/colors';
import { useAppSelector } from 'rdx/hooks';
import { selectAppLocale } from 'rdx/app/selectors';

type Props = {
  animalType: AnimalTypeModel;
};

const AnimalCaterogyCard = ({ animalType }: Props) => {
  const color = useMemo(() => generateRandomLightColor(), []);
  const { dictionary } = useAppSelector(selectAppLocale);

  return (
    <div className='flex hover:underline group cursor-pointer flex-col first:ml-4 first:mt-3 space-y-3 h-auto basis-36'>
      <div
        style={{ backgroundColor: color }}
        className='rounded-full group-hover:shadow-xl transition-shadow overflow-hidden h-36 flex items-center justify-center'
      >
        <div
          className='bg-cover rounded-full bg-center w-4/5 h-4/5 bg-no-repeat'
          style={{ backgroundImage: `url(${animalType.imgURL}` }}
        ></div>
      </div>
      <h4 className='self-center text-2xl text-gray-800 dark:text-gray-200'>
        {dictionary.animalTypes[animalType.name]}
      </h4>
    </div>
  );
};

export default AnimalCaterogyCard;
