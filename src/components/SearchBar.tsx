import React, { useCallback, useMemo, useState } from 'react';
import {
  Autocomplete,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import SearchIcon from '@mui/icons-material/Search';
import { usePlaces } from 'hooks/usePlaces';
import { useSearchParams } from 'react-router-dom';
import { Places } from 'locales/models';
import { useSearchAutocomplete } from 'hooks/useSearchAutocomplete';

const SearchBar = () => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [searchTerm, setSearchTerm] = useState('');
  const [terms, areTermsLoading] = useSearchAutocomplete(
    searchTerm.length > 2 ? searchTerm : null
  );

  const handleSearchTermChange = useCallback(
    (ev: any) => {
      setSearchTerm(ev!.target.value);
    },
    [setSearchTerm]
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
  const handleSearchPress = useCallback(() => {
    const prevTagQuery = searchParams.get('tags');
    if (!searchTerm) {
      setSearchParams((prev) => {
        const prevSearchParams = new URLSearchParams(prev);
        prevSearchParams.delete('tags');
        return prevSearchParams;
      });
    }
    if (searchTerm && (!prevTagQuery || prevTagQuery !== searchTerm)) {
      setSearchParams((prev) => {
        const prevSearchParams = new URLSearchParams(prev);
        prevSearchParams.set('tags', searchTerm);
        return prevSearchParams;
      });
    }
  }, [searchParams, searchTerm, setSearchParams]);
  const handleAutocompleteOptionSelect = useCallback(
    (_: React.SyntheticEvent<Element, Event>, val: string | null) => {
      setSearchTerm(val ? val : '');
    },
    [setSearchTerm]
  );

  return (
    <form className='h-44 bg-indigo-300 dark:bg-gray-600 flex justify-center items-center p-3'>
      <div className='flex w-full md:w-2/3 space-x-2'>
        <div className='flex-grow'>
          <Autocomplete
            options={terms}
            loading={areTermsLoading}
            onChange={handleAutocompleteOptionSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position='end'>
                      {areTermsLoading ? <CircularProgress size={20} /> : null}
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearchTermChange}
                label={dictionary.searchBarText}
              />
            )}
          />
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
            onClick={handleSearchPress}
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
