import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { limit, where } from 'firebase/firestore';
import { useAppCollectionDataOnce } from 'hooks/useAppCollectionDataOnce';
import { AdvertisementModel } from 'models/AdvertisimentModel';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import AdvertisementCard from './AdvertisementCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { advertisementsConverter } from 'services/fire';
import { useAppAuth } from 'hooks/useAppAuth';
import {
  deleteUserFollowedAdvertisement,
  postUserFollowedAdvertisement,
} from 'rdx/advertisements/thunks';
import { useUserFollowedAdvertisements } from 'hooks/useUserFollowedAdvertisements';

const Advertisements = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [user] = useAppAuth();
  const [advertisements, advsLoading] = useAppCollectionDataOnce({
    path: 'animals',
    converter: advertisementsConverter,
    queryConstraints: [where('userId', '!=', user!.uid), limit(10)],
  });
  const dispatch = useAppDispatch();
  const [followedAdvs, followedLoading] = useUserFollowedAdvertisements();
  const handleFollowAdvertisement = useCallback(
    (adv: AdvertisementModel) => {
      dispatch(
        postUserFollowedAdvertisement(adv, {
          email: user!.email!,
          uid: user!.uid,
        })
      );
    },
    [dispatch, user]
  );

  const handleUnfollowAdvertisement = useCallback(
    (advId: string) => {
      dispatch(deleteUserFollowedAdvertisement(advId, user!.uid));
    },
    [dispatch, user]
  );

  return (
    <div className='bg-indigo-300 dark:bg-gray-600 p-3 md:p-5 my-5'>
      <h2 className='text-5xl text-center text-sky-900 dark:text-sky-300'>
        {dictionary.advertisementsHomePageText}
      </h2>
      <div className='my-4 flex flex-wrap'>
        {!advsLoading &&
          !followedLoading &&
          advertisements &&
          (advertisements as AdvertisementModel[]).map((adv) => (
            <AdvertisementCard key={adv.id} advertisement={adv}>
              {followedAdvs!.find(
                (followedAdv) => followedAdv.id === adv.id
              ) ? (
                <Button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleUnfollowAdvertisement(adv.id);
                  }}
                  size='small'
                >
                  <FavoriteIcon />
                </Button>
              ) : (
                <Button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleFollowAdvertisement(adv);
                  }}
                  size='small'
                >
                  <FavoriteBorderIcon />
                </Button>
              )}
            </AdvertisementCard>
          ))}
      </div>
    </div>
  );
};

export default Advertisements;
