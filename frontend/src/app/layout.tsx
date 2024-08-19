import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { memo, ReactNode, useMemo } from "react";
import SceneWrapper from "@/components/SceneWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NoAccess from "@/components/NoAccess";
import { cookies } from "next/headers";
import Cookies from "universal-cookie";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Compositor | Stopoverx",
  description: "",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const session: Record<string, any> | null = await getServerSession(
    authOptions as any,
  );
  const accessToken = cookies().get("access_token");

  return (
    <html lang="en">
      <body className={inter.className}>
        {session?.user ? (
          <SceneWrapper accessToken={accessToken}>{children}</SceneWrapper>
        ) : (
          <NoAccess />
        )}
      </body>
    </html>
  );
};

export default memo(RootLayout);
