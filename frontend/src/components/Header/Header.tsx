"use client";

import Logout from "@/components/Logout";
import Login from "@/components/Login";
import { memo, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { useSession } from "next-auth/react";

const Header = () => {
  const session = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-10xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt="logo"
              src="https://s3.eu-north-1.amazonaws.com/stopoverx.production/stopover-logo-2colorized.png"
              className="h-8 w-auto"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {session.status === "authenticated" && (
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            <a
              href="/scheduler"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Scheduler
            </a>
            <a
              href="/tasks"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Tasks
            </a>
          </PopoverGroup>
        )}
        {session.status === "authenticated" ? (
          <div className="hidden lg:flex-col lg:flex lg:flex-1 lg:items-end">
            <div>{session.data?.user?.name}</div>
            <div>
              <Logout />
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex-col lg:flex lg:flex-1 lg:items-end">
            <Login />
          </div>
        )}
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt="logo"
                src="https://s3.eu-north-1.amazonaws.com/stopoverx.production/stopover-logo-2colorized.png"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {session.status === "authenticated" && (
                <div className="space-y-2 py-6">
                  <a
                    href="/scheduler"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Scheduler
                  </a>
                  <a
                    href="/tasks"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Tasks
                  </a>
                </div>
              )}
              {session.status === "authenticated" ? (
                <div className="py-6">
                  <div>{session.data?.user?.name}</div>
                  <div>
                    <Logout />
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <Login />
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default memo(Header);
