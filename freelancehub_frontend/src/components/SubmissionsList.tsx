"use client";

import React, { useEffect, useState } from "react";

interface Submission {
  _id: string;
  deliverables: string;
  status: string;
  createdAt: string;
  proposalId: {
    _id: string;
    job?: { title?: string };
    freelancer?: { name?: string };
  };
}

export default function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions`
        );
        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  if (loading) return <p>Loading submissions...</p>;

  if (submissions.length == 0) return <p>No submission found</p>;

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div key={submission._id} className="p-4 border rounded shadow">
          <h3 className="text-lg font-semibold">
            Job: {submission.proposalId?.job?.title || "Untitled Job"}
          </h3>
          <p className="text-sm text-gray-600">
            Deliverables:{" "}
            <a
              href={submission.deliverables}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download ZIP
            </a>
          </p>
          <p className="text-sm text-gray-600">Status: {submission.status}</p>
          <p className="text-sm text-gray-400">
            Submitted at: {new Date(submission.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
