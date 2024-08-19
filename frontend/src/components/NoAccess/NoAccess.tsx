"use client";

import { memo } from "react";
import Login from "@/components/Login";

const NoAccess = ({ signIn = true }: { signIn?: boolean }) => (
  <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div className="text-center">
      <p className="text-3xl font-semibold text-amber-700">403</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Access Denied
      </h1>
      <p className="mt-6 text-base leading-7 text-gray-600">
        Sorry, you don&apos;t have access to this page.
      </p>
      {signIn && (
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Login />
        </div>
      )}
    </div>
  </main>
);
export default memo(NoAccess);
