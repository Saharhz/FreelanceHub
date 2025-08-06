import { notFound } from "next/navigation";
import EditJobForm from "@/components/forms/EditJobForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/lib.auth";

interface Job {
  _id: string;
  title: string;
  description: string;
}

async function getJob(id: string, token: string): Promise<Job | null> {
  console.log("Server  Fetching job ID:", id);
  const res = await fetch(`http://localhost:5001/api/jobs/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  console.log("Server  Response status:", res.status);

  if (!res.ok) return null;
  return await res.json();
}

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken as string;

  if (!accessToken) {
    return notFound();
  }
  const job = await getJob(params.id, accessToken);

  if (!job) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      <EditJobForm job={job} accessToken={accessToken} />
    </div>
  );
}
