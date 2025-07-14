import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/lib.auth";
import ClientForm from "./ClientForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/auth/login");
  }

  const res = await fetch("http://localhost:5001/users/me", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/auth/login");
  }

  const user = await res.json();
  console.log("Loaded user data:", user);

  return <ClientForm user={user} accessToken={session.accessToken} />;
}
