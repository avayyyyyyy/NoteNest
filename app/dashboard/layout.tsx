import DasboardNav from "@/components/DasboardNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
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
  try {
    const existingUser = await prisma?.user.findUnique({
      where: {
        email: email,
      },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    });

    if (!existingUser) {
      // User not found, create a new user
      const createdUser = await prisma.user.create({
        data: {
          id: id,
          name: name,
          email: email,
        },
      });

      // Create a customer in Stripe and update the user with the Stripe Customer ID
      const stripeCustomer = await stripe.customers.create({
        email: email,
      });

      await prisma.user.update({
        where: {
          id: createdUser.id,
        },
        data: {
          stripeCustomerId: stripeCustomer.id,
        },
      });
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error; // Rethrow the error to handle it later or log it appropriately
  }
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (user) {
      const id = user.id;
      const name = user.given_name + " " + user.family_name;
      const email = user.email;

      // Call findUser with correct parameter syntax
      await findUser({ id, name, email });
    } else {
      // Redirect if user is not found
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
  } catch (error) {
    // Handle errors thrown during the process
    console.error("Error in DashboardLayout:", error);
    // You might want to redirect or render an error page here
  }
}
