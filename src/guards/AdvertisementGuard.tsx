import { useAppAuth } from 'hooks/useAppAuth';
import { useAppDocumentDataOnce } from 'hooks/useAppDocumentDataOnce';
import { AdvertisementModel } from 'models/AdvertisimentModel';
import { useMemo } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { advertisementsConverter } from 'services/fire';

export const AdvertisementGuard = ({ children }: { children: JSX.Element }) => {
  const [user] = useAppAuth();
  const [searchParams] = useSearchParams();

  const advId = useMemo(() => searchParams.get('advId'), [searchParams]);

  const [adv] = useAppDocumentDataOnce(
    advId
      ? {
          path: 'animals',
          pathSegments: [advId],
          converter: advertisementsConverter,
        }
      : null
  );

  if ((adv as AdvertisementModel)?.userId === user?.uid) {
    return <Navigate to={`/post?advId=${advId}`} />;
  }

  return children;
};
