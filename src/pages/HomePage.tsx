import React from 'react';
import SearchBar from 'components/SearchBar';
import AnimalCategories from 'components/AnimalCategories/index';
import Advertisements from 'components/Advertisements';

const HomePage = () => {
  // const { dictionary } = useAppSelector(selectAppLocale);

  return (
    <div className='container mx-auto'>
      <SearchBar />
      <AnimalCategories />
      <Advertisements />
    </div>
  );
};

export default HomePage;
