"use client";

import instance from "@/lib/lib.axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  visibility: string;
  skillsRequired: string[];
}

export default function jobDetailPage() {
  const { id } = useParams();
  const [job, setJobs] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    instance
      .get(`/api/jobs/${id}`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching job", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading job...</p>;
  if (!job) return <p className="text-center py-10">Job not found.</p>;

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{job.title}</h1>

        <p className="mb-2 text-gray-700">Budget: ${job.budget}</p>
        <p className="mb-2 text-gray-700">
          Deadline: {new Date(job.deadline).toLocaleDateString()}
        </p>

        <div className="mb-4">
          <h2 className="font-semibold">Skills Required:</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {job.skillsRequired?.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold mb-1">Description:</h2>
          <p className="text-gray-800 whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>
    </div>
  );
}
