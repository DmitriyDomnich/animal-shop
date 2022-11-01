import React, { useCallback, useMemo } from 'react';
import {
  Autocomplete,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import SearchIcon from '@mui/icons-material/Search';
import { usePlaces } from 'hooks/usePlaces';
import { useSearchParams } from 'react-router-dom';
import { Places } from 'locales/models';

const SearchBar = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [, setSearchParams] = useSearchParams();

  const [places] = usePlaces();

  const handleRegionChange = useCallback(
    (
      ev: React.SyntheticEvent<Element, Event>,
      val: {
        firstLetter: string;
        title: Places;
      } | null
    ) => {
      if (val) {
        setSearchParams((prev) => {
          const newSearchParams = new URLSearchParams(prev);
          newSearchParams.set('place', val.title);
          return newSearchParams;
        });
      } else {
        setSearchParams((prev) => ({ ...new URLSearchParams(prev) }));
      }
    },
    [setSearchParams]
  );

  const regions = useMemo(
    () =>
      places.map((region) => {
        const firstLetter = region.name[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          title: region.name,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dictionary, places]
  );

  return (
    <form className='h-44 bg-indigo-300 dark:bg-gray-600 flex justify-center items-center p-3'>
      <div className='flex w-full md:w-2/3 space-x-2'>
        <div className='flex-grow'>
          <FormControl fullWidth>
            <InputLabel htmlFor='outlined-adornment-amount'>
              {dictionary.searchBarText}
            </InputLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              }
              label={dictionary.searchBarText}
            />
          </FormControl>
        </div>
        <div>
          <Autocomplete
            options={regions.sort(
              (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
            )}
            onChange={handleRegionChange}
            className='min-w-[170px]'
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => dictionary.places[option.title]}
            renderInput={(params) => (
              <TextField {...params} label={dictionary.filterByRegion} />
            )}
          />
        </div>
        <div>
          <Button
            className='h-full'
            color='secondary'
            endIcon={<SearchIcon />}
            variant='outlined'
          >
            <span className='font-bold'>{dictionary.search}</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
