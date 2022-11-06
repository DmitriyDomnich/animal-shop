import React, { useCallback, useContext } from 'react';
import { Button } from '@mui/material';
import { AuthContext } from 'App';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useAppSelector } from 'rdx/hooks';
import { selectAppLocale } from 'rdx/app/selectors';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const auth = useContext(AuthContext);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const { dictionary } = useAppSelector(selectAppLocale);
  const navigate = useNavigate();

  const onSignInWithGoogle = useCallback(() => {
    signInWithGoogle().then((_) => navigate('/'));
  }, [signInWithGoogle, navigate]);

  return (
    <div className='container mx-auto flex justify-center items-center p-3 h-[calc(100vh-5rem)]'>
      <Button variant='contained' onClick={onSignInWithGoogle}>
        {dictionary.signIn}
      </Button>
    </div>
  );
};

export default SignInPage;
