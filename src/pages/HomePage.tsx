import React from 'react';
import SearchBar from 'components/SearchBar';
import AnimalCategories from 'components/AnimalCategories/index';
import Advertisements from 'components/Advertisements';

const HomePage = () => {
  // const { dictionary } = useAppSelector(selectAppLocale);

  return (
    <div className='w-full md:w-4/5 mx-auto'>
      <SearchBar />
      <AnimalCategories />
      <Advertisements />
    </div>
  );
};

export default HomePage;
