import NavbarWrapper from "@/components/NavbarWrapper";
import dynamic from "next/dynamic";
import React from "react";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper />
      <Toaster />
      <div className="pt-20 px-4 max-w-5xl mx-auto">{children}</div>
    </>
  );
}
