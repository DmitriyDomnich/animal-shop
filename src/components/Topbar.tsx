import React, { useCallback } from 'react';
import { Switch } from '@mui/material';
import { setTheme } from 'rdx/app/actions';
import { selectAppTheme } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';

const Topbar = () => {
  const theme = useAppSelector(selectAppTheme);
  const dispatch = useAppDispatch();

  const onThemeChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setTheme(ev.target.checked ? 'dark' : 'light'));
    },
    [dispatch]
  );

  return (
    <nav className='bg-slate-200 dark:bg-slate-700 h-16'>
      <Switch onChange={onThemeChange} checked={theme === 'dark'} />
    </nav>
  );
};

export default Topbar;
