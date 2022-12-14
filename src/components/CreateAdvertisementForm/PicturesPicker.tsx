import { Button, Tooltip } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useAppUploadFile } from 'hooks/useAppUploadFile';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
} from 'firebase/storage';
import DeleteIcon from '@mui/icons-material/Delete';
import AdvertisementPicture from './AdvertisementPicture';
import { AdvertisementFormStateModel } from './index';
import { app } from 'services/fire';
import { PictureModel } from 'models/AdvertisimentModel';
import {
  UseFieldArrayReplace,
  UseFormClearErrors,
  UseFormSetError,
} from 'react-hook-form';
import { countPhotos } from 'utils/forms';

type Props = {
  advertisementId: string;
  pictures: Array<PictureModel | null>;
  onSetPictures: UseFieldArrayReplace<AdvertisementFormStateModel, 'pictures'>;
  setError: UseFormSetError<AdvertisementFormStateModel>;
  clearErrors: UseFormClearErrors<AdvertisementFormStateModel>;
};

const PicturesPicker = React.forwardRef<HTMLDivElement, Props>(
  (
    { setError, pictures, advertisementId, onSetPictures, clearErrors },
    startDivRef
  ) => {
    const [uploadFile] = useAppUploadFile();
    const handleAddPicture = useCallback(
      async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const file = target.files![0];
        if (pictures.find((picture) => picture?.fileName.includes(file.name))) {
          return;
        }
        const uploadResult = await uploadFile(advertisementId, file, {
          contentType: file.type,
        });
        const downloadURL = await getDownloadURL(uploadResult.ref);
        let isNewPictureUrlSet = false;
        const newPictures = pictures.map((pictureUrl) => {
          if (!isNewPictureUrlSet && !pictureUrl) {
            isNewPictureUrlSet = true;
            return {
              url: downloadURL,
              fileName: file.name,
            };
          }
          return pictureUrl;
        });
        onSetPictures(newPictures);
        if (countPhotos(newPictures) > 0) {
          clearErrors('pictures');
        }
      },
      [pictures, uploadFile, advertisementId, onSetPictures, clearErrors]
    );
    const handleDeletePicture = useCallback(
      async (selectedPicture: PictureModel) => {
        const pictureRef = ref(
          getStorage(app),
          `adv_${advertisementId}/${selectedPicture.fileName}`
        ); // todo: move to fire service
        await deleteObject(pictureRef);
        const newPictures = pictures
          .filter((picture) => {
            return !picture || !picture.url.includes(selectedPicture.fileName);
          })
          .concat(null);
        onSetPictures(newPictures);
        if (!countPhotos(newPictures)) {
          setError(
            'pictures',
            {
              message: 'minPhotoLength',
            },
            {
              shouldFocus: true,
            }
          );
        }
      },
      [advertisementId, onSetPictures, pictures, setError]
    );

    const resultPictures = useMemo(() => {
      const picturesCopy = [...pictures];

      return picturesCopy.map((picture, index) => {
        if (picture) {
          return (
            <AdvertisementPicture
              key={index}
              imgSrc={picture.url}
              className={` bg-cover bg-center flex flex-col-reverse justify-between p-2 ${
                index === 0 ? ' border-yellow-300 border-4' : ''
              }`}
              render={() => (
                <Button
                  onClick={handleDeletePicture.bind(null, picture)}
                  color='error'
                  variant='contained'
                >
                  <DeleteIcon />
                </Button>
              )}
            />
          );
        }
        return (
          <AdvertisementPicture key={index}>
            <>
              <input
                type='file'
                className='hidden'
                accept='image/png, image/jpeg, image/gif, image/webp'
                onChange={handleAddPicture}
                id={`file${index}`}
              />
              <label
                className={
                  'cursor-pointer bg-gray-300 dark:bg-gray-800 rounded-md flex justify-center items-center w-full h-full'
                }
                htmlFor={`file${index}`}
              >
                <AddAPhotoIcon />
              </label>
            </>
          </AdvertisementPicture>
        );
      });
    }, [handleAddPicture, handleDeletePicture, pictures]);

    return (
      <Tooltip
        placement='right'
        title='?????????????? ?? ???????????????????? ???????????????? ???????? ????????????, ?? ???? ???????? ?? ??????????????????, ?????? ?????????????????? ???????????? ????????????????. ?????????????????????????? ?????????? ???? 5???? ?? ?????????????? .jpg .jpeg, .png, .gif.'
      >
        <div
          ref={startDivRef}
          className='flex scroll-mt-32 flex-wrap space-x-2 space-y-2 max-w-[935px]'
        >
          {resultPictures}
        </div>
      </Tooltip>
    );
  }
);

export default PicturesPicker;
