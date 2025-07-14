"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditJobForm({
  job,
  accessToken,
}: {
  job: any;
  accessToken: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: job.title,
    description: job.description,
    budget: job.budget,
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:5001/api/jobs/${job._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ...form, budget: Number(form.budget) }),
    });

    if (res.ok) {
      toast.success("Job updated!");
      router.push("/dashboard/jobs");
    } else {
      toast.error("Failed to update job.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <Label>Title</Label>
        <Input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div>
        <Label>Budget</Label>
        <Input
          type="number"
          value={form.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Save Changes
      </Button>
    </form>
  );
}
