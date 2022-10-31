import { AdvertisementModel } from 'models/AdvertisimentModel';
import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { advertisementsConverter } from 'services/fire';
import { useAppDocumentDataOnce } from './useAppDocumentDataOnce';

export const useAdvertisement = (): [AdvertisementModel, boolean] => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const advId = useMemo(
    () => searchParams.get('advId') || null,
    [searchParams]
  );
  const [advertisement, loading] = useAppDocumentDataOnce(
    location.state
      ? null
      : advId
      ? {
          path: 'animals',
          pathSegments: [advId],
          converter: advertisementsConverter,
        }
      : null
  );
  return [location.state || advertisement, loading as boolean];
};
