"use client";

import { useEffect, useState } from "react";
import instance from "@/lib/lib.axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  visibility: string;
}

export default function JobsListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token:", token);
      console.log("🆔 Deleting job:", jobId);
      await instance.delete(`/api/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job deleted");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete job");
    }
  };

  useEffect(() => {
    instance
      .get("http://localhost:5001/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching jobs", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    instance
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("User fetch failed", err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Available Jobs</h1>
        <Link
          href="/dashboard/jobs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </Link>
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
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  href={`/dashboard/jobs/${job._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
                <Link
                  href={`/dashboard/jobs/${job._id}/edit`}
                  className="text-sm text-yellow-600 hover:underline"
                >
                  ✏️
                </Link>
                {user?.role === "client" && (
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="ml-4 text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
