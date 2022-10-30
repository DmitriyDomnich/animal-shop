import { ref, getStorage } from 'firebase/storage';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import { app } from 'services/fire';

const storage = getStorage(app);

export const useAppDownloadUrl = (path: string) => {
  const [value, loading, error] = useDownloadURL(ref(storage, path));

  return [value, loading, error];
};
