import React, { useEffect } from 'react';
import { useAppAuth } from 'hooks/useAppAuth';
import HomePage from 'pages/HomePage';
import SignInPage from 'pages/SignInPage';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'services/fire';
import { LinearProgress } from '@mui/material';
import Topbar from 'components/Topbar';
import { Theme } from 'rdx/app/reducer';

const auth = getAuth(app);
export const AuthContext = React.createContext(auth);

const defaultStyles = 'h-full min-h-screen overflow-x-hidden bg-indigo-100';

function App() {
  useEffect(() => {
    const isDarkTheme = (localStorage.getItem('theme')! as Theme) === 'dark';
    if (isDarkTheme) {
      document.body.classList.add('dark');
    }
  }, []);

  const [user, loading] = useAppAuth();

  if (loading) {
    return (
      <div className={defaultStyles + 'flex justify-center items-center'}>
        <LinearProgress className='w-64' />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <div className={defaultStyles}>
        <Topbar />
        {user ? <HomePage /> : <SignInPage />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
