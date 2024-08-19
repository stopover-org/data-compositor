"use client";

import { useSession } from "next-auth/react";
import { memo, ReactNode, useEffect } from "react";

const LocalStorageSessionProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();

  useEffect(() => {
    // @ts-ignore
    if (session?.data?.id_token) {
      // @ts-ignore
      window.localStorage.setItem("access_token", session?.data?.id_token);
    }
  }, [session]);

  return session.status === "loading" ? null : children;
};

export default memo(LocalStorageSessionProvider);
