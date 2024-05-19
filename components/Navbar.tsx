import React from "react";
import { Button } from "./ui/button";
import { Themetoggle } from "./themetoggle";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserNav from "./UserNav";
import Link from "next/link";

const Navbar = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    <header className="border-b-2 py-3 px-2">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="block  font-bold text-2xl md:text-3xl">
          <span className="sr-only">Home</span>
          Note<span className="text-primary">Nest</span>
        </Link>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block"></nav>

          <div className="flex items-center gap-4">
            <div className="flex sm:gap-4 space-x-3">
              <Themetoggle />
              {(await isAuthenticated()) ? (
                <UserNav
                  name={user?.given_name as string}
                  img={user?.picture as string}
                  email={user?.email as string}
                />
              ) : (
                <>
                  <LoginLink>
                    <Button>Sign In</Button>
                  </LoginLink>
                  <RegisterLink>
                    <Button variant={"secondary"}>Sign Up</Button>
                  </RegisterLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
