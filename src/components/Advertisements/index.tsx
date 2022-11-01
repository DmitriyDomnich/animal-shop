import React, { useCallback, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import {
  limit,
  orderBy,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import { AdvertisementModel } from 'models/AdvertisimentModel';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import AdvertisementCard from './AdvertisementCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppAuth } from 'hooks/useAppAuth';
import {
  deleteUserFollowedAdvertisement,
  postUserFollowedAdvertisement,
} from 'rdx/advertisements/thunks';
import { useUserFollowedAdvertisements } from 'hooks/useUserFollowedAdvertisements';
import { useSearchParams } from 'react-router-dom';
import Fire from 'services/fire';

type AdvertisementsState = {
  loading: boolean;
  data: AdvertisementModel[];
  error: null | any;
};

const Advertisements = () => {
  const [searchParams] = useSearchParams();
  const { dictionary } = useAppSelector(selectAppLocale);
  const dispatch = useAppDispatch();
  const [user] = useAppAuth();
  const [lastVisibleDoc, setLastVisibleDoc] =
    useState<QueryDocumentSnapshot<AdvertisementModel>>();
  const [advertisements, setAdvertisements] = useState<AdvertisementsState>({
    loading: false,
    data: [],
    error: null,
  });

  useEffect(() => {
    setAdvertisements((prev) => ({ ...prev, loading: true, error: null }));
    const filters = Array.from(searchParams.entries()).map(([key, val]) =>
      where(key, '==', val)
    );

    const constraints = [
      where('date', '<=', new Date().setMinutes(0, 0)),
      ...filters,
      orderBy('date', 'desc'),
      limit(2),
    ];
    Fire.getAdvertisements(constraints).then((val) => {
      if (val) {
        setAdvertisements({
          data: val.data,
          error: null,
          loading: false,
        });
        setLastVisibleDoc(() => val.lastSnapshotRef);
      } else {
        setAdvertisements((prev) => ({
          ...prev,
          loading: false,
          error: 'Something Went Wrong',
        }));
        setLastVisibleDoc(() => undefined);
      }
    });
  }, [searchParams]);

  const handleLoadMore = useCallback(async () => {
    setAdvertisements((prev) => ({ ...prev, loading: true, error: null }));
    const filters = Array.from(searchParams.entries()).map(([key, val]) =>
      where(key, '==', val)
    );
    Fire.getAdvertisements([
      where('date', '<=', new Date().setMinutes(0, 0)),
      ...filters,
      orderBy('date', 'desc'),
      startAfter(lastVisibleDoc),
      limit(2),
    ]).then((val) => {
      if (val) {
        setAdvertisements((prev) => ({
          data: prev.data.concat(val.data),
          error: null,
          loading: false,
        }));
        setLastVisibleDoc(() => val.lastSnapshotRef);
      } else {
        setAdvertisements((prev) => ({
          ...prev,
          loading: false,
          error: 'Something Went Wrong',
        }));
        setLastVisibleDoc(() => undefined);
      }
    });
  }, [lastVisibleDoc, searchParams]);

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
      {!followedLoading && advertisements?.data?.length ? (
        <>
          <h2 className='text-5xl text-center text-sky-900 dark:text-sky-300'>
            {dictionary.advertisementsHomePageText}
          </h2>
          <div className='my-4 flex flex-wrap'>
            {(advertisements.data as AdvertisementModel[]).map((adv) => (
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
          <div className='my-4 flex flex-col items-center space-y-3'>
            {advertisements.loading && advertisements.data.length ? (
              <CircularProgress color='error' />
            ) : null}
            <Button
              variant='contained'
              onClick={handleLoadMore}
              color='primary'
            >
              {dictionary.loadMore}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Advertisements;
