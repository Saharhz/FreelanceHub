"use client";

import { useEffect, useState } from "react";
import instance from "@/lib/lib.axios";
import { useSession } from "next-auth/react";

interface Proposal {
  _id: string;
  job: {
    title: string;
  };
  status: string;
  description: string;
  estimatedBudget: number;
  freelancer?: {
    name?: string;
  };
}

export default function FreelancerProposalsPage() {
  const { data: session } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  console.log("Access Token:", session?.accessToken);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!session?.accessToken) return;
      try {
        const res = await fetch("http://localhost:5001/proposals/me", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        const data = await res.json();
        console.log("Proposals:", data);
        setProposals(data);
      } catch (err) {
        console.error("Failed to fetch proposals", err);
      }
    };

    if (session?.accessToken) {
      fetchProposals();
    }
  }, [session?.accessToken]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Proposals</h1>
      {proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((proposal) => (
            <li key={proposal._id} className="border p-4 rounded">
              <p>
                <strong>Job:</strong> {proposal.job?.title}
              </p>
              <p>
                <strong>Status:</strong> {proposal.status}
              </p>
              <p>
                <strong>Description:</strong> {proposal.description}
              </p>
              <p>
                <strong>Estimated Budget:</strong> ${proposal.estimatedBudget}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
