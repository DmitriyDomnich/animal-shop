import { AdvertisementModel } from 'models/AdvertisimentModel';
import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';
import { useAppSelector } from 'rdx/hooks';
import { selectAppLocale } from 'rdx/app/selectors';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

type Props = {
  advertisement: AdvertisementModel;
  children?: JSX.Element;
};

const AdvertisementCard = ({ advertisement, children }: Props) => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const navigate = useNavigate();
  const createdAt = useMemo(() => {
    const { date } = advertisement;
    return moment(date).format('lll');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advertisement, dictionary]);

  const goToAdv = useCallback(() => {
    navigate(`/adv?advId=${advertisement.id}`, {
      state: advertisement,
    });
  }, [navigate, advertisement]);

  return (
    <>
      <div
        onClick={goToAdv}
        className='cursor-pointer p-1 flex-grow sm:flex-grow-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 max-w-[366px] transition-transform hover:-translate-y-2'
      >
        <Card>
          <CardMedia
            component='img'
            height={140}
            image={advertisement.pictures[0]!.url}
          />
          <CardContent>
            <h2 className='font-bold text-xl line-clamp-2 cursor-text'>
              {advertisement.name}
            </h2>
            <h4 className='text-sm my-6'>
              {dictionary.places[advertisement.place]} {dictionary.region} -{' '}
              {createdAt}
            </h4>
            <h2 className='font-bold text-lg flex justify-between'>
              <span>
                {advertisement.price
                  ? `${advertisement.price} ${dictionary.hryvnia}`
                  : dictionary.free}
              </span>
              <div className='flex space-x-2'>{children}</div>
            </h2>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdvertisementCard;
