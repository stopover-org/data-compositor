"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { memo, ReactNode, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import getEnvironment from "@/utils/network";
import { RelayEnvironmentProvider } from "react-relay";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Cookies, { CookieChangeListener } from "universal-cookie";

const AccessTokenWrapper = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  // @ts-ignore
  const sessionToken = session?.data?.id_token;
  const sessionStatus = session?.status;
  const cookies = useMemo(() => new Cookies(), []);
  const [token, setToken] = useState(sessionToken);

  useEffect(() => {
    const cookieChangeListener: CookieChangeListener = (options) => {
      if (options.name === "access_token" && options.value) {
        setToken(options.value);
      }
    };

    cookies.addChangeListener(cookieChangeListener);

    return () => {
      cookies.removeChangeListener(cookieChangeListener);
    };
  }, [token, setToken, cookies]);

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    if (sessionToken) {
      cookies.set("access_token", sessionToken);
    } else {
      cookies.remove("access_token");
    }
  }, [sessionToken, sessionStatus, cookies]);

  return sessionStatus !== "loading" && token ? (
    <RelayEnvironmentProvider environment={getEnvironment(token)}>
      {children}
    </RelayEnvironmentProvider>
  ) : (
    "Loading..."
  );
};

const SceneWrapper = ({
  children,
  accessToken,
}: {
  children: ReactNode;
  accessToken?: ResponseCookie;
}) => (
  <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
    <AccessTokenWrapper>
      <Header />
      {children}
    </AccessTokenWrapper>
  </SessionProvider>
);

export default memo(SceneWrapper);
