import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  FirestoreError,
  getFirestore,
  query,
  QueryConstraint,
  QuerySnapshot,
} from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { app } from 'services/fire';

export const useAppCollectionDataOnce = <T extends object>(
  options: {
    path: string;
    converter: null | FirestoreDataConverter<T>;
    queryConstraints?: QueryConstraint[];
  } | null
): [
  any[] | undefined,
  boolean,
  FirestoreError | undefined,
  QuerySnapshot<DocumentData> | undefined
] => {
  const collectionQuery = useMemo(() => {
    if (options) {
      const { converter, path, queryConstraints } = options;
      let resultQuery = query(
        collection(getFirestore(app), path),
        ...(queryConstraints || [])
      );
      if (converter) {
        resultQuery = resultQuery.withConverter(converter);
      }
      return resultQuery;
    }
    return null;
  }, [options]);

  const [data, loading, error, snapshot] =
    useCollectionDataOnce(collectionQuery);

  return [data, loading, error, snapshot];
};
