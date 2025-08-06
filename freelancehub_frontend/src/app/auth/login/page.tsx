"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoginError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    console.log("Login response:", res);

    // if (res?.error) {
    //   console.error("Login error:", res.error);
    // }

    if (res?.ok) {
      router.push("/dashboard/profile");
    } else {
      toast.error(res?.error || "Email or password is incorrect");
    }
  };

  const { data: session, status } = useSession();

  return (
    <div className="h-[50rem] rounded-md w-full bg-neutral-950 mx-auto py-10">
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6 text-neutral-500">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-neutral-500 font-medium p-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="text-neutral-100"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-neutral-500 font-medium p-2"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="text-neutral-100"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <Link
            href="/auth/register"
            className="block text-center text-blue-600 hover:underline"
          >
            Don't have an account? Sign Up now
          </Link>
        </form>
      </div>
    </div>
  );
}
