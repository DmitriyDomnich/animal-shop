import React, { lazy, Suspense } from 'react';
import { useAppAuth } from 'hooks/useAppAuth';
import SignInPage from 'pages/SignInPage';
import { getAuth } from 'firebase/auth';
import { app } from 'services/fire';
import { createTheme, LinearProgress } from '@mui/material';
import Topbar from 'components/Topbar';
import { Theme } from 'rdx/app/reducer';
import { ThemeProvider } from '@mui/system';
import { Route, Routes } from 'react-router-dom';
import { AuthGuard } from 'guards/AuthGuard';
import { AdvertisementGuard } from 'guards/AdvertisementGuard';
import AdvertisementPage from 'pages/AdvertisementPage';
import ModuleLoader from 'components/ModuleLoader/ModuleLoader';

const auth = getAuth(app);
export const AuthContext = React.createContext(auth);
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const defaultStyles =
  'h-full min-h-screen bg-indigo-100 dark:bg-indigo-500 scroll-smooth pb-3';

const HomePage = lazy(() => import('./pages/HomePage'));
const ChatsPage = lazy(() => import('./pages/ChatsPage'));
const MyAdvertisementsPage = lazy(() => import('./pages/MyAdvertisementsPage'));
const CreateAdvertisementPage = lazy(
  () => import('./pages/CreateAdvertisementPage')
);
const FollowedAdvertisementsPage = lazy(
  () => import('./pages/FollowedAdvertisementsPage')
);

function App() {
  const [, loading] = useAppAuth();

  const [mode, setMode] = React.useState<'light' | 'dark'>(() => {
    const isDarkTheme = (localStorage.getItem('theme')! as Theme) === 'dark';
    if (isDarkTheme) {
      document.body.classList.add('dark');
    }
    return isDarkTheme ? 'dark' : 'light';
  });
  const changeColorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  if (loading) {
    return (
      <div className={defaultStyles + 'flex justify-center items-center '}>
        <LinearProgress className='w-64' />
      </div>
    );
  }

  return (
    <ColorModeContext.Provider value={changeColorMode}>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={auth}>
          <div className={defaultStyles}>
            <Topbar />
            <Routes>
              <Route
                element={
                  <AuthGuard>
                    <Suspense fallback={<ModuleLoader />}>
                      <HomePage />
                    </Suspense>
                  </AuthGuard>
                }
                index
              />
              <Route
                element={
                  <AuthGuard>
                    <AdvertisementGuard>
                      <Suspense fallback={<ModuleLoader />}>
                        <AdvertisementPage />
                      </Suspense>
                    </AdvertisementGuard>
                  </AuthGuard>
                }
                path='/adv'
              />
              <Route
                element={
                  <AuthGuard>
                    <Suspense fallback={<ModuleLoader />}>
                      <FollowedAdvertisementsPage />
                    </Suspense>
                  </AuthGuard>
                }
                path='/followed'
              />
              <Route
                element={
                  <AuthGuard>
                    <Suspense fallback={<ModuleLoader />}>
                      <CreateAdvertisementPage />
                    </Suspense>
                  </AuthGuard>
                }
                path='/post'
              />
              <Route
                element={
                  <AuthGuard>
                    <Suspense fallback={<ModuleLoader />}>
                      <MyAdvertisementsPage />
                    </Suspense>
                  </AuthGuard>
                }
                path='/my-advs'
              />
              <Route
                element={
                  <AuthGuard>
                    <Suspense fallback={<ModuleLoader />}>
                      <ChatsPage />
                    </Suspense>
                  </AuthGuard>
                }
                path='/chats'
              />
              <Route element={<SignInPage />} path='sign-in' />
            </Routes>
          </div>
        </AuthContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
