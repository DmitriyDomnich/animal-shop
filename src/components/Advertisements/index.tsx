import { Button } from '@mui/material';
import { limit, orderBy } from 'firebase/firestore';
import { useAppCollectionDataOnce } from 'hooks/useAppCollectionDataOnce';
import { AdvertisementModel } from 'models/AdvertisimentModel';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import React from 'react';
import AdvertisementCard from './AdvertisementCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { advertisementsConverter } from 'services/fire';

const Advertisements = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [advertisements, loading] = useAppCollectionDataOnce({
    path: 'animals',
    converter: advertisementsConverter,
    queryConstraints: [limit(10), orderBy('date')],
  });

  return (
    <div className='bg-indigo-300 dark:bg-gray-600 p-3 md:p-5'>
      <h2 className='text-5xl text-center text-sky-900 dark:text-sky-300'>
        {dictionary.advertisementsHomePageText}
      </h2>
      <div className='my-4 flex flex-wrap'>
        {advertisements &&
          !loading &&
          (advertisements as AdvertisementModel[]).map((adv) => (
            <AdvertisementCard key={adv.id} advertisement={adv}>
              <Button size='small'>
                <FavoriteBorderIcon />
              </Button>
            </AdvertisementCard>
          ))}
      </div>
    </div>
  );
};

export default Advertisements;
