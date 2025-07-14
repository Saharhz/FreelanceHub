import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">FreelancerHub</h1>
        <div className="space-x-2">
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-4xl font-bold mb-4">
            Find the right talent — or your next job
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Join FreelancerHub and connect with top clients and freelancers
            around the world.
          </p>
          <Link href="/auth/register">
            <Button size="lg">Join Now</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
