import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  Card,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";

const page = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  async function postNote(formData: FormData) {
    "use server";
    const title = formData.get("title");
    const description = formData.get("description");

    if (!user) {
      throw new Error("Not Authorized");
    }

    const created = await prisma?.note.create({
      data: {
        userId: user?.id,
        title: title as string,
        description: description as string,
      },
    });

    if (created) {
      return redirect("/dashboard");
    }
  }
  return (
    <Card>
      <form action={postNote}>
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>
            Right here now you can create new note
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="your title here"
              required
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="your description here"
              required
            />
          </div>
          <CardFooter className="flex justify-between">
            <Button asChild variant={"destructive"}>
              <Link href={"/dashboard"}>Cancel</Link>
            </Button>
            <SubmitButton />
          </CardFooter>
        </CardContent>
      </form>
    </Card>
  );
};

export default page;
