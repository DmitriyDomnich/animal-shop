import { Button } from '@mui/material';
import AdvertisementCard from 'components/Advertisements/AdvertisementCard';

import { useUserAdvertisements } from 'hooks/useUserAdvertisements';
import { deleteAdvertisement } from 'rdx/advertisements/thunks';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

const MyAdvertisementsPage = (props: Props) => {
  const { dictionary } = useAppSelector(selectAppLocale);

  const [advertisements, loading] = useUserAdvertisements();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const goToAdd = useCallback(() => {
    navigate('/post');
  }, [navigate]);
  const handleDelete = useCallback(
    (advId: string) => {
      dispatch(deleteAdvertisement(advId));
    },
    [dispatch]
  );

  return (
    <div className='container mx-auto bg-indigo-300 dark:bg-gray-600 p-3 md:p-5'>
      <h2 className='text-5xl text-center text-sky-900 dark:text-sky-300'>
        {dictionary.advertisementsHomePageText}
      </h2>
      <div className={`my-4 ${advertisements?.length ? 'flex flex-wrap' : ''}`}>
        {!loading && advertisements?.length ? (
          advertisements.map((adv) => (
            <AdvertisementCard key={adv.id} advertisement={adv}>
              <Button
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleDelete(adv.id);
                }}
                variant='outlined'
                size='small'
                color='error'
              >
                {dictionary.delete}
              </Button>
            </AdvertisementCard>
          ))
        ) : (
          <div className='text-center'>
            <div className='text-4xl underline dark:text-gray-300'>
              {dictionary.noUserAdvs}
            </div>
            <div className='my-5'>
              <Button onClick={goToAdd} size='large' variant='contained'>
                {dictionary.addAdvertisement}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAdvertisementsPage;
