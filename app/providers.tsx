'use client';

import { ReactNode } from 'react';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { SessionProvider } from '@/context/SessionContext';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/libs/AuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <NextAuthProvider>
        <SessionProvider>{children}</SessionProvider>
      </NextAuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}
