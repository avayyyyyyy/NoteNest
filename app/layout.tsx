import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import prisma from "./lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note Nest",
  description: "Created by Shubhankit Jain",
};

const findUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        colorScheme: true,
      },
    });

    return user;
  } catch (err) {
    return null;
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const id = user?.id;
  const data = await findUser(id as string);

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${data?.colorScheme ?? "theme-orange"}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
