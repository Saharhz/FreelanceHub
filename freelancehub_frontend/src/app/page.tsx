import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[50rem] rounded-md w-full bg-neutral-950">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-neutral-500 text-xl font-bold">FreelancerHub</h1>
        <div className="space-x-2">
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      <div className="h-[40rem] relative flex flex-col items-center justify-center antialiased">
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <h2 className="relative z-10 text-sm md:text-4xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
              Find the right talent — or your next job
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
              Join FreelancerHub and connect with top clients and freelancers
              around the world.
            </p>
            <Link href="/auth/register">
              <Button size="lg">Join Now</Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
