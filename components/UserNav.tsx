import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { CreditCard, DoorClosed, Home, Settings } from "lucide-react";

export const navLinks = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billings", href: "/dashboard/billings", icon: CreditCard },
];

const UserNav = ({
  name,
  email,
  img,
}: {
  name: string;
  email: string;
  img: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-10 w-10 rounded-full" variant={"ghost"}>
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={img} alt="@shadcn" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 " align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {navLinks.map((e, i) => (
            <DropdownMenuItem key={i} asChild>
              <Link
                href={e.href}
                className=" w-full flex justify-between items-center"
              >
                {e.name}
                <span>
                  <e.icon className="h-4 w-4 text-primary" />
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="w-full  text-red-600 flex justify-between">
            Logout{" "}
            <span>
              <DoorClosed className="h-4 w-4 " />
            </span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
