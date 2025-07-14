"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import instance from "@/lib/lib.axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  visibility: string;
  skillsRequired: string[];
}

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");

  console.log("🔐 Session:", session);

  // Fetch job
  useEffect(() => {
    if (!id) return;
    instance
      .get(`/api/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error("Error fetching job", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!description || !estimatedBudget) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await instance.post("/proposals", {
        jobId: id,
        description,
        estimatedBudget: Number(estimatedBudget),
      });
      toast.success("Proposal submitted!");
      router.push("/dashboard/profile");
    } catch (err: any) {
      console.error("Proposal submission error:", err);
      toast.error(err?.response?.data?.message || "Failed to apply.");
    }
  };

  if (loading) return <p className="text-center py-10">Loading job...</p>;
  if (!job) return <p className="text-center py-10">Job not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <p className="text-gray-700 mb-1">Budget: ${job.budget}</p>
        <p className="text-gray-700 mb-4">
          Deadline: {format(new Date(job.deadline), "yyyy-MM-dd")}
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

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Apply to this Job</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Your proposal description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md p-2 min-h-[100px]"
          />
          <Input
            type="number"
            placeholder="Estimated budget"
            value={estimatedBudget}
            onChange={(e) => setEstimatedBudget(e.target.value)}
          />
          <Button onClick={handleApply}>Submit Proposal</Button>
        </div>
      </div>
    </div>
  );
}
