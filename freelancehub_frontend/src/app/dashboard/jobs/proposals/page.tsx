"use client";

import instance from "@/lib/lib.axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Proposal {
  _id: string;
  description: string;
  estimatedBudget: number;
  status: string;
  job: {
    title: string;
  };
  freelancer: {
    name: string;
    email: string;
  };
}

export default function ProposalsForJobPage() {
  const { jobId } = useParams();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch("http://localhost:5001/proposals/client/me", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        const data = await res.json();
        console.log("Proposals for client jobs:", proposals);

        if (!res.ok) throw new Error("Failed to fetch proposals");

        setProposals(data);
      } catch (err) {
        console.error("Client proposals fetch error:", err);
      }
    };

    if (session?.accessToken) {
      fetchProposals();
    }
  }, [session?.accessToken]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">All Proposals for Your Jobs</h1>
      {proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((proposal) => (
            <li key={proposal._id} className="border rounded p-4 shadow-sm">
              <p>
                <strong>Job:</strong> {proposal.job?.title}
              </p>
              <p>
                <strong>Freelancer:</strong> {proposal.freelancer?.name}
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
              <p>
                <strong>Freelancer:</strong> {proposal.freelancer.name} (
                {proposal.freelancer.email})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
