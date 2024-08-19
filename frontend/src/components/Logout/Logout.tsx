"use client";

import { memo } from "react";
import { signOut } from "next-auth/react";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid";

const Logout = () => (
  <button type="button" onClick={() => signOut()}>
    <div className="flex text-center">
      Sign Out{" "}
      <ArrowLeftEndOnRectangleIcon
        width={20}
        height={20}
        style={{ marginLeft: "10px" }}
      />
    </div>
  </button>
);

export default memo(Logout);
