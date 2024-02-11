"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { navLinks } from "./UserNav";

const DasboardNav = () => {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {navLinks.map((e, i) => {
        return (
          <Link key={i} href={e.href}>
            <span
              className={`flex items-center mb-3 group px-3 py-2 font-medium hover:bg-accent rounded-md hover:text-accent-foreground ${
                pathname === e.href ? "bg-accent" : "bg-transparent"
              }`}
            >
              <e.icon className="mr-2 h-4 w-4 text-primary" />
              <span>{e.name}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default DasboardNav;
