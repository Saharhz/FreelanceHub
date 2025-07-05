"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/lib.axios";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    axios
      .get(`/auth/verify?token=${token}`)
      .then((res) => {
        toast.success(res.data.message || "Email verified!");
        router.push("/auth/login");
      })
      .catch(() => {
        toast.error("Invalid or expired verification link");
        router.push("/auth/login");
      });
  }, [searchParams, router]);

  return (
    <div className="text-center py-10">
      <p className="text-lg">Verifying your email...</p>
    </div>
  );
}
