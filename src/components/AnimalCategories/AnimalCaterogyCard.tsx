import React, { useCallback, useMemo } from 'react';
import { AnimalTypeModel } from 'models/AnimalTypeModel';
import { generateRandomLightColor } from 'utils/colors';
import { useAppSelector } from 'rdx/hooks';
import { selectAppLocale } from 'rdx/app/selectors';

type Props = {
  animalType: AnimalTypeModel;
  onChoose: (name: string | null) => void;
  active: boolean;
};

const AnimalCaterogyCard = ({ animalType, onChoose, active }: Props) => {
  const color = useMemo(() => generateRandomLightColor(), []);
  const { dictionary } = useAppSelector(selectAppLocale);

  const handleChoose = useCallback(() => {
    onChoose(active ? null : animalType.name);
  }, [active, animalType.name, onChoose]);

  return (
    <div
      onClick={handleChoose}
      className={`flex hover:underline cursor-pointer flex-col first:ml-4 first:mt-3 space-y-3 h-auto rounded-lg basis-44 ${
        active && 'border-4 border-teal-600'
      }`}
    >
      <div
        style={{
          backgroundColor: color,
        }}
        className='rounded-full overflow-hidden h-44 flex items-center justify-center'
      >
        <div
          className='bg-cover rounded-full bg-center w-4/5 h-4/5 bg-no-repeat'
          style={{ backgroundImage: `url(${animalType.imgURL}` }}
        ></div>
      </div>
      <h4 className='self-center text-2xl text-gray-800 dark:text-gray-200'>
        {dictionary.AnimalType[animalType.name]}
      </h4>
    </div>
  );
};

export default AnimalCaterogyCard;
