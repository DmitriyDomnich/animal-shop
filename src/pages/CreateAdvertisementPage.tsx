import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import { useSearchParams } from 'react-router-dom';
import React, { useMemo } from 'react';
import CreateAdvertisementForm from 'components/CreateAdvertisementForm';
import { useAppDocumentDataOnce } from 'hooks/useAppDocumentDataOnce';
import { AdvertisementModel } from 'models/AdvertisimentModel';
import { advertisementsConverter } from 'services/fire';

const CreateAdvertisementPage = () => {
  const [searchParams] = useSearchParams();
  const advId = useMemo(
    () => searchParams.get('advId') || null,
    [searchParams]
  );
  const [advertisement, loading] = useAppDocumentDataOnce(
    advId
      ? {
          path: 'animals',
          pathSegments: [advId],
          converter: advertisementsConverter,
        }
      : null
  );

  const { dictionary } = useAppSelector(selectAppLocale);

  return (
    <div className='container mx-auto p-4'>
      {!loading && (
        <>
          <h1 className='text-5xl text-sky-900 dark:text-sky-300 my-10 font-bold'>
            {advertisement
              ? dictionary.updateAdvertisement
              : dictionary.createAdvertisement}
          </h1>
          <CreateAdvertisementForm
            advertisement={advertisement as AdvertisementModel}
          />
        </>
      )}
    </div>
  );
};

export default CreateAdvertisementPage;
