import { AdvertisementModel } from 'models/Advertisiment';
import React, { useMemo } from 'react';
import { Card, CardContent, CardMedia, Button } from '@mui/material';
import { useAppSelector } from 'rdx/hooks';
import { selectAppLocale } from 'rdx/app/selectors';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';

type Props = {
  advertisement: AdvertisementModel;
};

const AdvertisementCard = ({ advertisement }: Props) => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const createdAt = useMemo(() => {
    const { date } = advertisement;
    return moment(
      new Timestamp(date.seconds, date.nanoseconds).toDate()
    ).format('lll');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advertisement, dictionary]);

  return (
    <>
      <div className='cursor-pointer p-1 flex-grow sm:flex-grow-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4'>
        <Card>
          <CardMedia
            component='img'
            height='140'
            image={advertisement.pictures[0]}
          />
          <CardContent className='relative'>
            <h2 className='font-bold text-xl line-clamp-2 cursor-text'>
              {advertisement.description}
            </h2>
            <h4 className='text-sm my-6'>
              {advertisement.place} - {createdAt}
            </h4>
            <h2 className='font-bold text-lg flex justify-between'>
              <span>
                {advertisement.price} {dictionary.hryvnia}
              </span>
              <Button size='small'>
                <FavoriteBorderIcon />
              </Button>
            </h2>
          </CardContent>
        </Card>
      </div>
      <div className='cursor-pointer p-1 flex-grow sm:flex-grow-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4'>
        <Card>
          <CardMedia
            component='img'
            height='140'
            image={advertisement.pictures[0]}
          />
          <CardContent className='relative'>
            <h2 className='font-bold text-xl line-clamp-2 cursor-text'>
              {advertisement.description}
            </h2>
            <h4 className='text-sm my-6'>
              {advertisement.place} - {createdAt}
            </h4>
            <h2 className='font-bold text-lg flex justify-between'>
              <span>
                {advertisement.price} {dictionary.hryvnia}
              </span>
              <Button size='small'>
                <FavoriteBorderIcon />
              </Button>
            </h2>
          </CardContent>
        </Card>
      </div>
      <div className='cursor-pointer p-1 flex-grow sm:flex-grow-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4'>
        <Card>
          <CardMedia
            component='img'
            height='140'
            image={advertisement.pictures[0]}
          />
          <CardContent className='relative'>
            <h2 className='font-bold text-xl line-clamp-2 cursor-text'>
              {advertisement.description}
            </h2>
            <h4 className='text-sm my-6'>
              {advertisement.place} - {createdAt}
            </h4>
            <h2 className='font-bold text-lg flex justify-between'>
              <span>
                {advertisement.price} {dictionary.hryvnia}
              </span>
              <Button size='small'>
                <FavoriteBorderIcon />
              </Button>
            </h2>
          </CardContent>
        </Card>
      </div>
      <div className='cursor-pointer p-1 flex-grow sm:flex-grow-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4'>
        <Card>
          <CardMedia
            component='img'
            height='140'
            image={advertisement.pictures[0]}
          />
          <CardContent className='relative'>
            <h2 className='font-bold text-xl line-clamp-2 cursor-text'>
              {advertisement.description}
            </h2>
            <h4 className='text-sm my-6'>
              {advertisement.place} - {createdAt}
            </h4>
            <h2 className='font-bold text-lg flex justify-between'>
              <span>
                {advertisement.price} {dictionary.hryvnia}
              </span>
              <Button size='small'>
                <FavoriteBorderIcon />
              </Button>
            </h2>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdvertisementCard;
