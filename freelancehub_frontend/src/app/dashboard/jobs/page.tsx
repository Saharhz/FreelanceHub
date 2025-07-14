"use client";

import { useEffect, useState } from "react";
import instance from "@/lib/lib.axios";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  visibility: string;
}

export default function JobsListPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  useEffect(() => {
    instance
      .get("/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching jobs", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    instance
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("User fetch failed", err));
  }, [accessToken]);

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await instance.delete(`/api/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job deleted");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Available Jobs</h1>
        {user?.role === "client" && (
          <Link
            href="/dashboard/jobs/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Job
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-center">Loading jobs...</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="border p-4 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                Budget: ${job.budget}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Deadline: {format(new Date(job.deadline), "yyyy-MM-dd")}
              </p>
              <div className="flex justify-between items-center">
                {user?.role === "freelancer" ? (
                  <Link
                    href={`/dashboard/jobs/${job._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Job
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/jobs/${job._id}/proposals`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Proposals
                  </Link>
                )}
                <div className="flex justify-end gap-4 mt-2">
                  {user?.role === "client" && (
                    <Link href={`/dashboard/jobs/${job._id}/edit`}>
                      <span className="text-xl hover:text-blue-600 cursor-pointer">
                        ✏️
                      </span>
                    </Link>
                  )}
                  {user?.role === "client" && (
                    <span
                      className="text-xl text-red-600 hover:text-red-800 cursor-pointer ml-4"
                      onClick={async () => {
                        const confirmed = confirm(
                          "Are you sure you want to delete this job?"
                        );
                        if (!confirmed) return;

                        const res = await fetch(
                          `http://localhost:5001/api/jobs/${job._id}`,
                          {
                            method: "DELETE",
                            headers: {
                              Authorization: `Bearer ${accessToken}`,
                            },
                          }
                        );

                        if (res.ok) {
                          toast.success("Job deleted");
                          router.push("/dashboard/jobs");
                          router.refresh();
                        } else {
                          toast.error("Failed to delete job");
                        }
                      }}
                    >
                      🗑️
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
