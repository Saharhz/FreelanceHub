"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import instance from "@/lib/lib.axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Proposal {
  _id: string;
  freelancer: {
    _id: string;
    name: string;
    email?: string;
  };
  estimatedBudget: number;
  description: string;
  status: "pending" | "accepted" | "rejected";
}

export default function JobProposalsPage() {
  const { id: jobId } = useParams();
  console.log("Job ID from URL:", jobId);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const fetchProposals = async () => {
    try {
      const res = await instance.get(`/proposals/job/${jobId}`);
      console.log("Proposals for job:", res.data);
      setProposals(res.data);
    } catch (error) {
      toast.error("Failed to fetch proposals for this job.");
    }
  };

  const handleDecision = async (
    proposalId: string,
    action: "accepted" | "rejected"
  ) => {
    try {
      await instance.patch(`/proposals/${proposalId}/status`, {
        status: action,
      });
      toast.success(`Proposal ${action}ed successfully`);
      fetchProposals();
    } catch (err) {
      toast.error("Failed to update proposal status");
    }
  };

  useEffect(() => {
    if (jobId) fetchProposals();
  }, [jobId]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Proposals for this Job</h1>
      {proposals.length === 0 ? (
        <p>No proposals yet.</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((proposal) => (
            <li key={proposal._id} className="border p-4 rounded">
              <p>
                <strong>Freelancer:</strong> {proposal.freelancer?.name}
              </p>
              <p>
                <strong>Email:</strong> {proposal.freelancer?.email}
              </p>
              <p>
                <strong>Estimated Budget:</strong> ${proposal.estimatedBudget}
              </p>
              <p>
                <strong>Description:</strong> {proposal.description}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    proposal.status === "accepted"
                      ? "text-green-600"
                      : proposal.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }`}
                >
                  {proposal.status}
                </span>
              </p>
              {proposal.status === "pending" && (
                <div className="space-x-2 mt-2">
                  <Button
                    onClick={() => handleDecision(proposal._id, "accepted")}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecision(proposal._id, "rejected")}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
