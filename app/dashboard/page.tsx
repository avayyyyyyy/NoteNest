import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, File, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import prisma from "../lib/db";

const getData = async (userID: string) => {
  const data = await prisma?.note.findMany({
    where: {
      userId: userID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  let allNotes = await getData(user?.id as string);

  if (allNotes === undefined) {
    allNotes = [];
  }

  async function deleteNote(formData: FormData) {
    "use server";
    const id = formData.get("noteId");
    const deleted = await prisma?.note.delete({
      where: {
        id: id as string,
        userId: user?.id,
      },
    });

    if (deleted) {
      revalidatePath("/dashboard");
    }
  }

  return (
    <div className="grid items-start gap-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Your Notes</h1>
          <p className="text-lg text-muted-foreground">
            Here You can see and create notes
          </p>
        </div>
        <Button asChild>
          <Link href={"/dashboard/new"}>Create a new note!</Link>
        </Button>
      </div>

      {allNotes?.length < 1 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="items-center justify-center flex h-20 w-20 rounded-full bg-primary/10">
            <File className="w-10 h-10 text-primary " />
          </div>
          <h2 className="mt-6 text-xl font-semibold">
            You don't have any notes yet! 🫠
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            You currently don't have any notes. Please create some so that you
            can see them right here.
          </p>
          <Button asChild>
            <Link href={"/dashboard/new"}>Create a new note!</Link>
          </Button>
        </div>
      ) : (
        <div className="flex  flex-col gap-y-4">
          {allNotes?.map((e, i) => (
            <Card key={i} className="justify-between p-4 flex items-center">
              <div>
                <h2 className="font-semibold text-xl text-primary">
                  {e.title}
                </h2>
                <p>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                  }).format(new Date(e.createdAt))}
                </p>
              </div>
              <div className="flex gap-x-4">
                <Link href={`/dashboard/new/${e.id}`}>
                  <Button variant={"outline"} size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <form action={deleteNote}>
                  <Input type="hidden" name="noteId" value={e.id} />
                  <Button type="submit" variant={"destructive"} size={"icon"}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
