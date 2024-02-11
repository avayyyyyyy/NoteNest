import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const user = await getUser();
  const auth = await isAuthenticated();
  if (user) {
    return redirect("/dashboard");
  }

  return (
    <section className="flex space-y-6 flex-col h-[90vh] justify-center items-center">
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
  );
}
