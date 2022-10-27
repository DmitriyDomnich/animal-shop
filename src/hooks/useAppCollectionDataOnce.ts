import {
  collection,
  FirestoreDataConverter,
  getFirestore,
  query,
  QueryConstraint,
} from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { app } from 'services/fire';

export const useAppCollectionDataOnce = <T extends object>(
  path: string,
  converter: null | FirestoreDataConverter<T> = null,
  queryConstraints?: QueryConstraint[]
) => {
  const collectionQuery = useMemo(
    () =>
      query(collection(getFirestore(app), path), ...(queryConstraints || [])),
    [path, queryConstraints]
  );

  const [data, loading, error, snapshot] = useCollectionDataOnce(
    converter ? collectionQuery.withConverter(converter) : collectionQuery
  );

  return [data, loading, error, snapshot];
};
