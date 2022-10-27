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

import React, { useMemo } from 'react';

type Props = {};

const SearchBar = (props: Props) => {
  const { dictionary } = useAppSelector(selectAppLocale);

  const regions = useMemo(
    () =>
      dictionary.regions.map((region) => {
        const firstLetter = region[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          title: region,
        };
      }),
    [dictionary]
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
            className='min-w-[170px]'
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
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
