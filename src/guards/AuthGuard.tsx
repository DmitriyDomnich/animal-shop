import { useAppAuth } from 'hooks/useAppAuth';
import { Navigate, useLocation } from 'react-router-dom';

export const AuthGuard = ({ children }: { children: JSX.Element }) => {
  let [user] = useAppAuth();
  let location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to='/sign-in' state={{ from: location }} replace />;
  }

  return children;
};
