import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SubmitButton from "@/components/SubmitButton";
import { revalidatePath } from "next/cache";

const page = async () => {
  const findUser = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        email: true,
        colorScheme: true,
      },
    });

    return user;
  };

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const email = user?.email;
  const data = await findUser(email as string);

  const updateInfo = async (formData: FormData) => {
    "use server";

    const name = formData.get("name") as string;
    const colorScheme = formData.get("color") as string;

    const updated = await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name ?? undefined,
        colorScheme: colorScheme ?? undefined,
      },
    });

    revalidatePath("/", "layout");
    return updated;
  };

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-semibold md:text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Your Profile Settings</p>
        </div>
      </div>
      <Card>
        <form action={updateInfo}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Pleasee provide the following information about yourself & don't
              forget to save it!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Your Name</Label>
                <Input
                  defaultValue={data?.name ?? ""}
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-1">
                <Label>Your Email</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={data?.email ?? ""}
                  id="email"
                  placeholder="Your Email"
                  disabled
                />
              </div>
              <div className="space-y-1">
                <Label>Color Scheme</Label>
                <Select name="color" defaultValue={data?.colorScheme ?? ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Please select a color" />
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Colors</SelectLabel>
                        <SelectItem value="theme-green">Green</SelectItem>
                        <SelectItem value="theme-orange">Orange</SelectItem>
                        <SelectItem value="theme-red">Red</SelectItem>
                        <SelectItem value="theme-blue">Blue</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default page;
