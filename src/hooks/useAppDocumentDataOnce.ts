import { doc, FirestoreDataConverter, getFirestore } from 'firebase/firestore';
import { useMemo } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { app } from 'services/fire';

export const useAppDocumentDataOnce = <T extends object>(
  options: {
    path: string;
    converter?: FirestoreDataConverter<T>;
    pathSegments?: string[];
  } | null
) => {
  const documentQuery = useMemo(() => {
    if (!options) {
      return null;
    }
    return options.pathSegments
      ? doc(getFirestore(app), options.path, ...options.pathSegments)
      : doc(getFirestore(app), options.path);
  }, [options]);

  const [data, loading, error, snapshot] = useDocumentDataOnce(
    options
      ? options.converter
        ? documentQuery?.withConverter(options.converter)
        : documentQuery
      : null
  );

  return [data, loading, error, snapshot];
};
