import React, { useCallback, useContext } from 'react';
import { Button } from '@mui/material';
import { AuthContext } from 'App';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useAppSelector } from 'rdx/hooks';
import { selectAppLocale } from 'rdx/app/selectors';

const SignInPage = () => {
  const auth = useContext(AuthContext);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const { dictionary } = useAppSelector(selectAppLocale);

  const onSignInWithGoogle = useCallback(() => {
    signInWithGoogle();
  }, [signInWithGoogle]);

  return (
    <div>
      <Button variant='contained' onClick={onSignInWithGoogle}>
        {dictionary.signIn}
      </Button>
    </div>
  );
};

export default SignInPage;
