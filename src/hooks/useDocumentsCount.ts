import {
  collection,
  getCountFromServer,
  getFirestore,
  query,
  QueryConstraint,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { app } from 'services/fire';

type CountState = {
  data: number | null;
  loading: boolean;
  error: any | null;
};

export const useDocumentsCount = ({
  collectionName,
  queryConstraints,
}: {
  collectionName: string;
  queryConstraints?: QueryConstraint[];
}): [number | null, boolean, any | null] => {
  const [count, setCount] = useState<CountState>({
    data: null,
    error: null,
    loading: false,
  });

  const getCount = useCallback(async () => {
    try {
      setCount((prev) => ({ ...prev, loading: true, error: null }));
      const resultQuery = queryConstraints
        ? query(
            collection(getFirestore(app), collectionName),
            ...queryConstraints
          )
        : query(collection(getFirestore(app), collectionName));
      const snapshot = await getCountFromServer(resultQuery);
      setCount({
        data: snapshot.data().count,
        error: null,
        loading: false,
      });
    } catch (err: any) {
      setCount({
        data: null,
        error: err,
        loading: false,
      });
    }
  }, [collectionName, queryConstraints]);

  useEffect(() => {
    getCount();
  }, [getCount]);

  return [count.data, count.loading, count.error];
};
