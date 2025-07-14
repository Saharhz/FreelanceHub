import SubmissionsList from "@/components/SubmissionsList";

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Submissions</h1>
      <SubmissionsList />
    </div>
  );
}
