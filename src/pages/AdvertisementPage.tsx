import React, { useCallback, useState } from 'react';
import { useAdvertisement } from 'hooks/useAdvertisement';
import { selectAppLocale } from 'rdx/app/selectors';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import moment from 'moment';
import { Avatar, Button, CircularProgress } from '@mui/material';
import { useUserFollowedAdvertisements } from 'hooks/useUserFollowedAdvertisements';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  deleteUserFollowedAdvertisement,
  postUserFollowedAdvertisement,
} from 'rdx/advertisements/thunks';
import { useAppAuth } from 'hooks/useAppAuth';
import { useAppDocumentDataOnce } from 'hooks/useAppDocumentDataOnce';
import { PublisherModel } from 'models/UserModel';

const AdvertisementPage = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [followedAdvs, followedLoading] = useUserFollowedAdvertisements();
  const [advertisement, advLoading] = useAdvertisement();
  const [currUser] = useAppAuth();
  const dispatch = useAppDispatch();

  const [advPublisher, advPublisherLoading] = useAppDocumentDataOnce({
    path: 'users',
    pathSegments: [advertisement.userId],
  });

  const [showPhone, setShowPhone] = useState(false);

  const handleUnfollowAdvertisement = useCallback(() => {
    dispatch(deleteUserFollowedAdvertisement(advertisement.id, currUser!.uid));
  }, [advertisement.id, dispatch, currUser]);
  const handleFollowAdvertisement = useCallback(() => {
    dispatch(
      postUserFollowedAdvertisement(advertisement, {
        email: currUser!.email!,
        uid: currUser!.uid,
      })
    );
  }, [advertisement, dispatch, currUser]);
  const changeShowPhone = useCallback(
    () => setShowPhone((prev) => !prev),
    [setShowPhone]
  );

  return (
    <>
      <div className='container my-5 mx-auto'>
        {followedLoading || advLoading || advPublisherLoading ? (
          <CircularProgress />
        ) : (
          <>
            <div className='p-5 flex flex-wrap bg-gray-200 dark:bg-gray-700 rounded-b-lg shadow-lg'>
              <div className='basis-full md:basis-2/5'>
                <Carousel
                  statusFormatter={(curr, total) =>
                    `${curr} ${dictionary.of} ${total}`
                  }
                >
                  {advertisement.pictures.filter(Boolean).map((picture) => (
                    <div key={picture!.url}>
                      <img src={picture!.url} alt={picture!.fileName} />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className='basis-full md:basis-3/5 p-3 flex flex-col space-y-5'>
                <h6 className='text-sm text-gray-800 dark:text-gray-200 italic flex justify-between'>
                  <span>
                    {dictionary.published}{' '}
                    {moment(advertisement.date).calendar()},{' '}
                    <span className='underline font-bold'>
                      {dictionary.AnimalType[advertisement.type]}
                    </span>
                  </span>
                  {followedAdvs!.find(
                    (followedAdv) => followedAdv.id === advertisement.id
                  ) ? (
                    <Button
                      color='secondary'
                      onClick={handleUnfollowAdvertisement}
                      size='small'
                    >
                      <FavoriteIcon />
                    </Button>
                  ) : (
                    <Button
                      color='secondary'
                      onClick={handleFollowAdvertisement}
                      size='small'
                    >
                      <FavoriteBorderIcon />
                    </Button>
                  )}
                </h6>
                <h2 className='text-5xl text-gray-800 dark:text-gray-200'>
                  {advertisement.name}
                </h2>
                <h3 className='text-4xl font-bold text-teal-800 dark:text-teal-300'>
                  {+advertisement.price
                    ? `${advertisement.price} ${dictionary.hryvnia}`
                    : dictionary.free}
                </h3>
                <h4 className='text-4xl font-bold text-gray-800 dark:text-gray-200 uppercase'>
                  {dictionary.description}
                </h4>
                <div className='text-md text-gray-800 dark:text-gray-200'>
                  {advertisement.description}
                </div>
              </div>
            </div>
            <div className='flex flex-col space-y-3 my-5 w-full md:w-1/3 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg p-5'>
              <h4 className='text-2xl font-bold text-gray-800 dark:text-gray-200 uppercase'>
                {dictionary.publisher}
              </h4>
              <h3 className='text-3xl text-gray-800 dark:text-gray-200 flex space-x-3'>
                <Avatar src={(advPublisher as PublisherModel)!.imageUrl} />
                <span>{advertisement.userName}</span>
              </h3>
              <h4 className='text-xl text-gray-800 dark:text-gray-200'>
                <span className='text-slate-500'>{dictionary.location}:</span>{' '}
                {dictionary.places[advertisement.place]} {dictionary.region}
              </h4>
              <div className='flex space-x-3'>
                <Button
                  onClick={changeShowPhone}
                  variant='contained'
                  color='warning'
                >
                  {showPhone ? advertisement.phoneNumber : dictionary.showPhone}
                </Button>
                <Button variant='contained'>{dictionary.message}</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdvertisementPage;
