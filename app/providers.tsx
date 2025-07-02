"use client";

import { ReactNode } from "react";
import { SessionProvider } from "@/context/SessionContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/libs/AuthProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <SessionProvider>{children}</SessionProvider>
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}
