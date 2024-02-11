"use client";

import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-fit" type="submit">
          <Loader2 className="mr-2 h-4 w-4" />
          Please wait
        </Button>
      ) : (
        <Button type="submit">Save Now</Button>
      )}
    </>
  );
};

export default SubmitButton;
