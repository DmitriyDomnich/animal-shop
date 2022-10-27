import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { setLocale, setTheme } from 'rdx/app/actions';
import { selectAppLocale, selectAppTheme } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import ThemeSwitch from './ThemeSwitch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Languages } from 'locales/models';
import { Avatar, Button, Menu, MenuItem, Tooltip } from '@mui/material';
import { useAppAuth } from 'hooks/useAppAuth';
import { signOut } from 'firebase/auth';
import { AuthContext, ColorModeContext } from 'App';

type AvatarConfig = {
  alt: string;
  src: string;
  children: JSX.Element | string;
};
const styles = {
  locale:
    'cursor-pointer text-slate-600 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300 ',
};

const Topbar = () => {
  const theme = useAppSelector(selectAppTheme);
  const { dictionary, name: currentLocaleName } =
    useAppSelector(selectAppLocale);
  const [user] = useAppAuth();
  const dispatch = useAppDispatch();
  const userAvatarRef = useRef(null);
  const [userOptionsOpen, setUserOptionsOpen] = useState(false);
  const colorMode = React.useContext(ColorModeContext);

  const avatar = useMemo(() => {
    if (!user) {
      return null;
    }
    const avatarConfig: Partial<AvatarConfig> = {
      alt: user?.displayName!,
    };

    if (user?.photoURL) {
      avatarConfig.src = user.photoURL;
    } else {
      const str = user?.displayName?.split(' ')!;
      const firstNameLetter = str[0][0];
      const lastNameLetter = str[1][0];
      avatarConfig.children = (
        <span>
          {firstNameLetter}
          {lastNameLetter}
        </span>
      );
    }
    return avatarConfig;
  }, [user]);

  const onThemeChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      colorMode.toggleColorMode();
      dispatch(setTheme(ev.target.checked ? 'dark' : 'light'));
    },
    [dispatch, colorMode]
  );
  const onLocaleChange = useCallback(
    (language: Languages) => {
      if (currentLocaleName !== language) {
        dispatch(setLocale(language));
      }
    },
    [dispatch, currentLocaleName]
  );

  const onUserOptionsOpen = useCallback(
    () => setUserOptionsOpen(true),
    [setUserOptionsOpen]
  );
  const onUserOptionsClose = useCallback(
    () => setUserOptionsOpen(false),
    [setUserOptionsOpen]
  );

  const auth = useContext(AuthContext);
  const onSignOut = useCallback(
    () => signOut(auth).then((_) => setUserOptionsOpen(false)),
    [auth]
  );

  return (
    <nav className='w-full md:w-4/5 mx-auto drop-shadow-xl sticky top-0 px-2 py-1 bg-slate-200 dark:bg-slate-700 h-16 flex items-center justify-between'>
      <div>
        {user && (
          <div className='flex space-x-2 items-center'>
            <Button variant='contained'>{dictionary.addAdvertisement}</Button>
            <Tooltip title={dictionary.userOptions}>
              <div ref={userAvatarRef}>
                <Avatar
                  {...avatar}
                  onClick={onUserOptionsOpen}
                  className='cursor-pointer'
                />
              </div>
            </Tooltip>
            <Menu
              anchorEl={userAvatarRef.current}
              open={userOptionsOpen}
              onClose={onUserOptionsClose}
            >
              <MenuItem onClick={onUserOptionsClose}>Profile</MenuItem>
              <MenuItem onClick={onUserOptionsClose}>My account</MenuItem>
              <MenuItem onClick={onSignOut}>{dictionary.signOut}</MenuItem>
            </Menu>
          </div>
        )}
      </div>
      <div className='flex items-center'>
        <div className='space-x-2'>
          <Button color='secondary'>
            <FavoriteIcon />
          </Button>
          <span
            className={`${styles.locale} ${
              currentLocaleName === 'ua' ? 'underline' : ''
            }`}
            onClick={onLocaleChange.bind(null, 'ua')}
          >
            🇺🇦
          </span>
          <span className='mx-3 text-slate-700 dark:text-slate-100'>|</span>
          <span
            className={`${styles.locale} ${
              currentLocaleName === 'en' ? 'underline' : ''
            }`}
            onClick={onLocaleChange.bind(null, 'en')}
          >
            🇺🇸
          </span>
        </div>
        <ThemeSwitch onChange={onThemeChange} checked={theme === 'dark'} />
      </div>
    </nav>
  );
};

export default Topbar;
