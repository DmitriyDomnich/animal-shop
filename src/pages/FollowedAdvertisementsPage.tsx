import { Button, CircularProgress } from '@mui/material';
import AdvertisementCard from 'components/Advertisements/AdvertisementCard';
import { useUserFollowedAdvertisements } from 'hooks/useUserFollowedAdvertisements';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useCallback } from 'react';
import { deleteUserFollowedAdvertisement } from 'rdx/advertisements/thunks';
import { useAppAuth } from 'hooks/useAppAuth';

const FollowedAdvertisementsPage = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [followedAdvs, followedLoading] = useUserFollowedAdvertisements();
  const [user] = useAppAuth();
  const dispatch = useAppDispatch();

  const handleUnfollow = useCallback(
    (advId: string) => {
      dispatch(deleteUserFollowedAdvertisement(advId, user!.uid));
    },
    [dispatch, user]
  );

  return (
    <div className='container mx-auto p-5 my-5 text-gray-800 dark:text-gray-200'>
      <h2 className='text-4xl text-center my-4'>
        {dictionary.followedAdvertisements}
      </h2>
      {!followedLoading ? (
        followedAdvs?.length ? (
          <div className='p-5 flex flex-wrap bg-indigo-300 dark:bg-gray-600 space-x-3 space-y-3'>
            {followedAdvs.map((adv) => (
              <AdvertisementCard key={adv.id} advertisement={adv}>
                <Button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleUnfollow(adv.id);
                  }}
                  size='small'
                >
                  <FavoriteIcon />
                </Button>
              </AdvertisementCard>
            ))}
          </div>
        ) : (
          <h4 className='p-5 text-center'>{dictionary.noFollowedAdvs}</h4>
        )
      ) : (
        <div className='text-center'>
          <CircularProgress size={40} />
        </div>
      )}
    </div>
  );
};

export default FollowedAdvertisementsPage;
