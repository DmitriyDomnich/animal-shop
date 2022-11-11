import React from 'react';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';

const Page404 = () => {
  const { dictionary } = useAppSelector(selectAppLocale);

  return (
    <div className='container font-seymour text mx-auto p-3 flex items-center h-[80vh] text-3xl md:text-5xl lg:text-7xl text justify-center'>
      <span className='bg-clip-text font-bold leading-normal text-transparent bg-gradient-to-r from-[red] to-[blue]'>
        {dictionary.pageNotFound}
      </span>
    </div>
  );
};

export default Page404;
