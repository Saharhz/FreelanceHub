"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import instance from "@/lib/lib.axios";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [visibility, setVisibility] = useState("public");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const jobData = {
        title,
        description,
        budget: Number(budget),
        deadline,
        visibility,
        skillsRequired: skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await instance.post("/api/jobs", jobData);
      toast.success("Job posted successfully!");
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Job creation failed.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Budget ($)</label>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Deadline</label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">
            Skills Required (comma separated)
          </label>
          <Input
            value={skillsRequired}
            onChange={(e) => setSkillsRequired(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Visibility</label>
          <select
            className="border rounded p-2 w-full"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <Button type="submit" className="w-full">
          Post Job
        </Button>
      </form>
    </div>
  );
}
