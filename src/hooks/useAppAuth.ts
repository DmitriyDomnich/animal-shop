import { getAuth } from 'firebase/auth';
import { AuthStateHook, useAuthState } from 'react-firebase-hooks/auth';
import { app } from 'services/fire';

export const useAppAuth = (): AuthStateHook => {
  const [user, loading, error] = useAuthState(getAuth(app));

  return [user, loading, error];
};
