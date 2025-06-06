'use client';

import { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const { data: session, status } = useSession();

  const contextValue = {
    user: session?.user,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
