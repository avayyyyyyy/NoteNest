import { BorderBeam } from "@/components/magicui/border-beam";
import DotPattern from "@/components/magicui/dot-pattern";
import RadialGradient from "@/components/magicui/linear-gradient";
import LinearGradient from "@/components/magicui/linear-gradient";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ChevronRight, Github, Linkedin, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
      <section className="flex mb-7 lg:h-auto  lg:overflow-y-hidden lg:overflow-hidden space-y-6 flex-col justify-center lg:flex lg: lg:mt-28 h-[90vh]  items-center">
        <div className="px-4 text-xs lg:text-sm  flex z-20  gap-2 items-center  py-2 rounded-full bg-secondary text-primary">
          Sort Your Notes Easily <SquarePen size={16} />
        </div>
        <div className="lg:text-5xl z-20  font-bold text-center text-4xl">
          Create Notes <span className="text-primary">With Ease!</span>
        </div>
        <div className="lg:w-2/5 z-20  w-4/5 text-center text-muted-foreground lg:text-base text-xs font-normal">
          Streamline Your Workflow with Effortless Note Creation - Elevate
          Productivity, Stay Organized, and Focus on What Matters Most.
        </div>
        <RegisterLink>
          <Button className="min-w-60 z-20 ">
            Get Started{" "}
            <span>
              <ChevronRight />
            </span>
          </Button>
        </RegisterLink>
        <div className="flex z-20  space-x-3">
          <Link
            className="p-2 rounded-full bg-primary-foreground/10"
            target="_blank"
            href={"https://github.com/avayyyyyyy/"}
          >
            <Github className="text-primary" />
          </Link>
          <Link
            className="p-2 rounded-full bg-primary-foreground/10"
            target="_blank"
            href={"https://www.linkedin.com/in/shubhcodes/"}
          >
            <Linkedin className="text-primary" />
          </Link>
        </div>
        <div className="rounded-lg z-20 relative lg:flex justify-center hidden">
          <Image
            className="rounded-lg bg-primary-foreground"
            alt={
              "https://utfs.io/f/c8a555e4-dcdf-459f-9522-ff8d8be09823-q5tp3e.webp"
            }
            width={1000}
            height={1000}
            src={"/notenest.webp"}
          />
          <BorderBeam size={400} duration={12} delay={9} />
        </div>
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] opacity-50 "
          )}
        />
        <RadialGradient className="opacity-15 z-10 hidden lg:block" />
      </section>
    </>
  );
}
