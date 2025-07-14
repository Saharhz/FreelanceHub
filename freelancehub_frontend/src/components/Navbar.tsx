"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Proposal {
  _id: string;
  description: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  useEffect(() => {
    const fetchProposals = async () => {
      if (!session?.accessToken || !session.user?.role) return;

      const endpoint =
        session.user.role === "freelancer"
          ? "/proposals/me"
          : "/proposals/client/me";

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        const data = await res.json();
        console.log("Fetched proposals:", data);

        if (Array.isArray(data)) {
          setProposals(data);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (err) {
        console.error("Proposal fetch error:", err);
      }
    };

    fetchProposals();
  }, [session?.accessToken, session?.user?.role]);

  console.log("Session:", session);

  const userRole = session?.user?.role;

  if (status === "loading") return <p>Loading...</p>;

  console.log("Session:", session);
  console.log("Access Token:", session?.accessToken);

  const hideProfileLink = pathname === "/dashboard/profile";

  return (
    <nav className="bg-gray-100 border-b py-3 px-6 flex justify-between items-center">
      <div className="text-lg font-semibold">FreelancerHub</div>

      <div className="flex gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              Me
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="profile">
                {pathname !== "/dashboard/profile" && (
                  <Link
                    href="/dashboard/profile"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Profile
                  </Link>
                )}
              </DropdownMenuRadioItem>
              {userRole === "freelancer" && (
                <DropdownMenuRadioItem value="proposal">
                  <Link
                    href="/dashboard/proposals"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    My Proposals
                  </Link>
                </DropdownMenuRadioItem>
              )}
              {userRole === "freelancer" && proposals.length > 0 && (
                <DropdownMenuRadioItem value="submi">
                  <Link
                    href={`/dashboard/proposals/${proposals[0]._id}/submit`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Submit Work
                  </Link>
                </DropdownMenuRadioItem>
              )}
              {userRole === "freelancer" && (
                <DropdownMenuRadioItem value="submission">
                  <Link
                    href="/dashboard/submissions"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    My Submissions
                  </Link>
                </DropdownMenuRadioItem>
              )}
              {userRole === "client" && (
                <DropdownMenuRadioItem value="postedJob">
                  <Link
                    href="/dashboard/jobs"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    My Jobs
                  </Link>
                </DropdownMenuRadioItem>
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {status === "authenticated" && (
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>

      {/* <div className="flex gap-4 items-center">
        {pathname !== "/dashboard/profile" && (
          <Link
            href="/dashboard/profile"
            className="text-sm text-blue-600 hover:underline"
          >
            Profile
          </Link>
        )}
        {userRole === "freelancer" && (
          <Link
            href="/dashboard/proposals"
            className="text-sm text-blue-600 hover:underline"
          >
            My Proposals
          </Link>
        )}
        {userRole === "freelancer" && proposals.length > 0 && (
          <Link
            href={`/dashboard/proposals/${proposals[0]._id}/submit`}
            className="text-sm text-blue-600 hover:underline"
          >
            Submit Work
          </Link>
        )}
        {userRole === "freelancer" && (
          <Link
            href="/dashboard/submissions"
            className="text-sm text-blue-600 hover:underline"
          >
            My Submissions
          </Link>
        )}
        {userRole === "client" && (
          <Link
            href="/dashboard/jobs"
            className="text-sm text-blue-600 hover:underline"
          >
            My Jobs
          </Link>
        )}

        {status === "authenticated" && (
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div> */}
    </nav>
  );
}
