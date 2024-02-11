import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession } from "@/app/lib/stripe";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const getData = async (userId: string) => {
  const data = await prisma?.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  return data;
};

const page = async () => {
  const features = [
    { name: "Unlimited Note Creation" },
    { name: "Cross-Device Syncing" },
    { name: "Advanced Collaboration Tools" },
    { name: "Powerful Search and Organization" },
  ];

  const { getUser } = getKindeServerSession();

  const user = await getUser();

  const data = await getData(user?.id as string);

  const getSubscriptionSession = async () => {
    "use server";

    const dbUser = await prisma?.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("Unable to create payment");
    }

    const subscriptionUrl = await getStripeSession({
      customerID: dbUser.stripeCustomerId,
      priceID: process.env.PRICE_ID as string,
      domainURL: "http://localhost:3000",
    });

    revalidatePath(subscriptionUrl);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary">
              Monthly
            </h3>
          </div>
          <div className="mt-4 flex items-baseline font-extrabold text-6xl">
            $30 <span className="ml-1 text-2xl text-muted-foreground">/mo</span>
          </div>
          <p className="mt-5 text-muted-foreground text-lg ">
            Write as many notes as you want for $30 a month
          </p>
        </CardContent>
        <div className="flex-1 flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
          <ul className="space-y-4">
            {features.map((e, i) => {
              return (
                <li className="flex items-center" key={i}>
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-3" />
                  </div>
                  {e.name}
                </li>
              );
            })}
          </ul>
          <form action={getSubscriptionSession}>
            <Button type="submit" className="w-full">
              Buy Now
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default page;
