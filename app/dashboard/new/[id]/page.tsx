import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";

const findNote = async (id: string, userId: string) => {
  const note = await prisma?.note.findUnique({
    where: {
      id: id,
      userId: userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });

  return note;
};

const page = async ({ params }: any) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const note = await findNote(params.id, user?.id as string);

  const updateNote = async (formData: FormData) => {
    "use server";

    const title = formData.get("title");
    const description = formData.get("description");

    const updatedNote = await prisma?.note.update({
      where: {
        id: params?.id,
        userId: user?.id,
      },
      data: {
        title: title as string,
        description: description as string,
      },
    });

    if (updatedNote) {
      return redirect("/dashboard");
    }
  };

  return (
    <Card>
      <form action={updateNote}>
        <CardHeader>
          <CardTitle>Update Note</CardTitle>
          <CardDescription>
            Right here now you can update this note
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              type="text"
              defaultValue={note?.title ?? ""}
              name="title"
              placeholder="your title here"
              required
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label>Description</Label>
            <Textarea
              name="description"
              defaultValue={note?.description ?? ""}
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
