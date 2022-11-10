import React, { useEffect, useState } from 'react';
import { Blurhash } from 'react-blurhash';

type Props = {
  blurhash: string;
  imgUrl: string;
};

const BlurHashedImage = ({ blurhash, imgUrl }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setImageLoaded(true);
    image.src = imgUrl;
  }, [imgUrl]);

  return imageLoaded ? (
    <div
      style={{
        backgroundImage: `url(${imgUrl})`,
      }}
      className='h-[240px] bg-cover bg-no-repeat bg-center'
    ></div>
  ) : (
    <Blurhash hash={blurhash} height={240} width='100%' />
  );
};
export default BlurHashedImage;
