import {
  getStorage,
  ref as storageRef,
  StorageError,
  UploadMetadata,
  UploadResult,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { useCallback } from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { app } from 'services/fire';

const storage = getStorage(app);
type UploadFile = (
  path: string,
  file: File,
  metadata?: UploadMetadata
) => Promise<UploadResult>;

export const useAppUploadFile = (): [
  UploadFile,
  boolean,
  UploadTaskSnapshot | undefined,
  StorageError | undefined
] => {
  const [upload, uploading, snapshot, error] = useUploadFile();

  const uploadFile = useCallback(
    (path: string, file: File, metadata?: UploadMetadata) => {
      const ref = storageRef(storage, `adv_${path}/${file.name}`);

      return upload(ref, file, metadata);
    },
    [upload]
  ) as UploadFile;
  return [uploadFile, uploading, snapshot, error];
};
