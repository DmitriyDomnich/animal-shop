import React from 'react';
import { useAppAuth } from 'hooks/useAppAuth';
import HomePage from 'pages/HomePage';
import SignInPage from 'pages/SignInPage';
import { getAuth } from 'firebase/auth';
import { app } from 'services/fire';
import { createTheme, LinearProgress } from '@mui/material';
import Topbar from 'components/Topbar';
import { Theme } from 'rdx/app/reducer';
import { ThemeProvider } from '@mui/system';

const auth = getAuth(app);
export const AuthContext = React.createContext(auth);
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const defaultStyles = 'h-full min-h-screen bg-indigo-100 dark:bg-gray-500';

function App() {
  const [user, loading] = useAppAuth();

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
            {user ? <HomePage /> : <SignInPage />}
          </div>
        </AuthContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
