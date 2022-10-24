import React from 'react';
import { useAppAuth } from 'hooks/useAppAuth';

const HomePage = () => {
  const [user] = useAppAuth();

  return (
    <div>
      Hello, <span className='text-amber-400'>{user?.displayName}</span>
    </div>
  );
};

export default HomePage;
