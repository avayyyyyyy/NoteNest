import DasboardNav from "@/components/DasboardNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode, use } from "react";
import prisma from "../lib/db";
import { stripe } from "../lib/stripe";

const findUser = async ({
  id,
  email,
  name,
}: {
  id: string;
  name: string;
  email: string;
}) => {
  const isUser = await prisma?.user.findUnique({
    where: {
      email: email,
    },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });

  if (!isUser) {
    const created = await prisma.user.create({
      data: {
        id: id,
        name: name,
        email: email,
      },
    });
  }

  if (!isUser) {
    const data = await stripe.customers.create({
      email: email,
    });

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (user) {
    const id = user.id;
    const name = user.given_name + " " + user.family_name;
    const email = user.email;
    await findUser({ id, name, email });
  } else {
    return redirect("/");
  }

  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DasboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
