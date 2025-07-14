"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";

const schema = z.object({
  proposalId: z.string().min(1, "Proposal ID is required"),
  file: z
    .any()
    .refine((files) => files?.[0], "A ZIP file is required")
    .refine(
      (files) => files?.[0]?.type === "application/zip",
      "Must be a ZIP file"
    ),
});

type SubmissionFormvalues = z.infer<typeof schema>;

export default function SubmitDeliverableForm() {
  const { id: proposalId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmissionFormvalues>({
    resolver: zodResolver(schema),
    defaultValues: {
      proposalId: proposalId as string,
    },
  });

  const onSubmit = async (data: SubmissionFormvalues) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("proposalId", data.proposalId);
    formData.append("status", "active");

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Deliverable submitted successfully!");
      router.push("/dashboard/submissions");
      reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Submission failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-4 border rounded-xl space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Proposal ID</label>
          <Input
            type="hidden"
            {...register("proposalId")}
            className="w-full border p-2 rounded"
          />
          {errors.proposalId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.proposalId.message}
            </p>
          )}
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">ZIP File</Label>
          <Input
            type="file"
            accept=".zip"
            {...register("file")}
            className="w-full"
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.file.message)}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Submit Deliverable"}
        </Button>
      </form>
    </div>
  );
}
