import {
  DocumentData,
  FirestoreDataConverter,
  limit,
  orderBy,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { useAppCollectionDataOnce } from 'hooks/useAppCollectionDataOnce';
import { AdvertisementModel } from 'models/Advertisiment';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import React from 'react';
import AdvertisementCard from './AdvertisementCard';

const advertisementConverter: FirestoreDataConverter<AdvertisementModel> = {
  toFirestore(animalType: WithFieldValue<AdvertisementModel>): DocumentData {
    return animalType;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AdvertisementModel {
    const data = snapshot.data(options) as AdvertisementModel;
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

const Advertisements = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [advertisements] = useAppCollectionDataOnce(
    'animals',
    advertisementConverter,
    [limit(10), orderBy('date')]
  );
  console.log(advertisements);

  return (
    <div className='bg-indigo-300 dark:bg-gray-600 p-3 md:p-5'>
      <h2 className='text-5xl text-center text-sky-900 dark:text-sky-300'>
        {dictionary.advertisementsHomePageText}
      </h2>
      <div className='my-4 flex flex-wrap'>
        {advertisements &&
          (advertisements as AdvertisementModel[]).map((adv) => (
            <AdvertisementCard key={adv.id} advertisement={adv} />
          ))}
      </div>
    </div>
  );
};

export default Advertisements;
