import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { setLocale, setTheme } from 'rdx/app/actions';
import { selectAppLocale, selectAppTheme } from 'rdx/app/selectors';
import { useAppDispatch, useAppSelector } from 'rdx/hooks';
import ThemeSwitch from './ThemeSwitch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import { Languages } from 'locales/models';
import { Avatar, Button, Menu, MenuItem, Tooltip } from '@mui/material';
import { useAppAuth } from 'hooks/useAppAuth';
import { signOut } from 'firebase/auth';
import { AuthContext, ColorModeContext } from 'App';
import { useNavigate } from 'react-router-dom';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useMediaQuery } from 'usehooks-ts';
import MenuIcon from '@mui/icons-material/Menu';

type AvatarConfig = {
  alt: string;
  src: string;
  children: JSX.Element | string;
};
const styles = {
  locale:
    'cursor-pointer text-slate-600 dark:text-slate-100 hover:text-slate-900 dark:hover:text-slate-300 z-10 ',
};

const Topbar = () => {
  const theme = useAppSelector(selectAppTheme);
  const { dictionary, name: currentLocaleName } =
    useAppSelector(selectAppLocale);
  const [user] = useAppAuth();
  const dispatch = useAppDispatch();
  const userAvatarRef = useRef(null);
  const [userOptionsOpen, setUserOptionsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const isMd = useMediaQuery('(min-width: 768px)');
  const isSm = useMediaQuery('(min-width: 640px)');

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

  const onAddAdvertisementClick = useCallback(
    () => navigate('/post'),
    [navigate]
  );
  const onHomeClick = useCallback(() => {
    if (showBurger) {
      setShowBurger(false);
    }
    navigate('/');
  }, [navigate, showBurger]);
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
  const handleSignOut = useCallback(
    () => signOut(auth).then((_) => setUserOptionsOpen(false)),
    [auth]
  );
  const goToYourAdvertisements = useCallback(() => {
    setUserOptionsOpen(false);
    navigate('/my-advs');
  }, [navigate, setUserOptionsOpen]);
  const goToFollowedAdvertisements = useCallback(() => {
    if (showBurger) {
      setShowBurger(false);
    }
    navigate('/followed');
  }, [navigate, showBurger]);
  const goToChats = useCallback(() => navigate('/chats'), [navigate]);

  const buttonSize = useMemo(() => (isMd ? 'medium' : 'small'), [isMd]);

  const toggleBurger = useCallback(() => {
    setShowBurger((prev) => !prev);
  }, [setShowBurger]);
  useEffect(() => {
    if (isSm && showBurger) {
      setShowBurger(false);
    }
  }, [setShowBurger, isSm, showBurger]);

  return (
    <nav className='container z-10 mx-auto drop-shadow-xl sticky top-0 px-2 py-1 bg-slate-200 dark:bg-slate-700 h-16 flex items-center justify-between'>
      {showBurger && (
        <div className='absolute left-0 w-full p-3 divide-y divide-gray-800 dark:divide-gray-200 shadow-lg -bottom-20 bg-slate-200 dark:bg-slate-700 flex flex-col items-center'>
          <div className='basis-full'>
            <Button size={buttonSize} onClick={onHomeClick}>
              <HomeIcon />
            </Button>
          </div>
          <div className='basis-full'>
            <Button
              size={buttonSize}
              onClick={goToFollowedAdvertisements}
              color='secondary'
            >
              <FavoriteIcon />
            </Button>
          </div>
        </div>
      )}
      <div>
        {user && (
          <div className='flex space-x-2 items-center'>
            <Button
              size={buttonSize}
              variant='contained'
              onClick={onAddAdvertisementClick}
            >
              {dictionary.addAdvertisement}
            </Button>
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
              <MenuItem onClick={goToYourAdvertisements}>
                {dictionary.yourAdvertisements}
              </MenuItem>
              {!isMd ? (
                <MenuItem onClick={goToChats}>
                  {dictionary.messages}
                  <span className='ml-2'>
                    <ChatBubbleIcon />
                  </span>
                </MenuItem>
              ) : null}
              <MenuItem onClick={handleSignOut}>{dictionary.signOut}</MenuItem>
            </Menu>
            {isMd ? (
              <Button onClick={goToChats} variant='text' color='secondary'>
                {dictionary.messages}
                <span className='ml-2'>
                  <ChatBubbleIcon />
                </span>
              </Button>
            ) : null}
          </div>
        )}
      </div>
      <div className='flex items-center'>
        <div className='space-x-2'>
          {!user ? (
            <Button size={buttonSize} onClick={onHomeClick}>
              <HomeIcon />
            </Button>
          ) : isSm ? (
            <>
              <Button size={buttonSize} onClick={onHomeClick}>
                <HomeIcon />
              </Button>
              <Button
                size={buttonSize}
                onClick={goToFollowedAdvertisements}
                color='secondary'
              >
                <FavoriteIcon />
              </Button>
            </>
          ) : (
            <Button size={buttonSize} onClick={toggleBurger}>
              <MenuIcon />
            </Button>
          )}
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
