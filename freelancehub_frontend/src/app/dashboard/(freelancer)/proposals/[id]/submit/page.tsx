"use client";
import SubmitDeliverableForm from "@/components/forms/SubmitDeliverableForm";
import { useParams } from "next/navigation";

export default function SubmitPage() {
  const params = useParams();
  const proposalId = params?.id as string;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Submit Deliverable</h1>
      <SubmitDeliverableForm proposalId={proposalId} />
    </div>
  );
}
