import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const user = await getUser();
  const auth = await isAuthenticated();
  if (user) {
    return redirect("/dashboard");
  }

  return (
    <>
      <section className="flex lg:h-auto lg:my-20  lg:overflow-y-hidden lg:overflow-hidden space-y-6 flex-col justify-center lg:flex lg:justify-start lg:mt-32 h-[90vh]  items-center">
        <div className="px-4 text-xs lg:text-base py-2 rounded-full bg-secondary text-primary">
          Sort Your Notes Easily
        </div>
        <div className="lg:text-5xl font-bold text-center text-4xl">
          Create Notes <span className="text-primary">With Ease</span>
        </div>
        <div className="lg:w-2/5 w-4/5 text-center lg:text-base text-xs font-light">
          Streamline Your Workflow with Effortless Note Creation - Elevate
          Productivity, Stay Organized, and Focus on What Matters Most.
        </div>
        <RegisterLink>
          <Button className="min-w-60">Get Started</Button>
        </RegisterLink>
      </section>
      <div className="hidden rounded-t-lg lg:flex relative justify-center">
        <Image
          className=" pt-5 pl-5 pr-5 bg-slate-400  rounded-t-lg absolute"
          alt={"Home Page Image"}
          width={1000}
          height={1000}
          src={"/hompage-cropped.webp"}
        />
      </div>
    </>
  );
}
