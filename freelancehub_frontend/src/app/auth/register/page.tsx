"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "@/lib/lib.axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["client", "freelancer"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    console.log("Sending data to backend:", data);
    try {
      const res = await axios.post("/auth/register", data, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="h-[50rem] rounded-md w-full bg-neutral-950 mx-auto py-10">
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-neutral-500">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-neutral-500 font-medium">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              defaultValue=""
              {...register("name")}
              className="text-neutral-100"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email" className="text-neutral-500 font-medium">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              {...register("email")}
              className="text-neutral-100"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="text-neutral-500 font-medium">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              {...register("password")}
              className="text-neutral-100"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="role" className="text-neutral-500 font-medium">
              Role
            </Label>
            <select
              id="role"
              {...register("role")}
              className="w-full border px-3 py-2 rounded-md text-neutral-500 font-medium"
            >
              <option value="" className="text-neutral-500 font-medium">
                Select Role
              </option>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
          <Link
            href="/auth/login"
            className="block text-center text-blue-600 hover:underline"
          >
            Do you have an account?
          </Link>
        </form>
      </div>
    </div>
  );
}
