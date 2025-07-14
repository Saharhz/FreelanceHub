"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ClientForm({
  user,
  accessToken,
}: {
  user: any;
  accessToken: string;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: user.name || "",
    title: user.title || "",
    bio: user.bio || "",
    skills: user.skills?.join(", ") || "",
    contact: {
      phone: user.contactInfo?.phone || "",
      website: user.contactInfo?.website || "",
      linkedin: user.contactInfo?.linkedin || "",
    },
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim(),
      skills: form.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      contactInfo: {
        phone: form.contact.phone.trim(),
        website: form.contact.website.trim(),
        linkedin: form.contact.linkedin.trim(),
      },
    };

    const body = JSON.stringify(payload);
    console.log(body);

    try {
      const res = await fetch("http://localhost:5001/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Update failed");
      }

      const data = await res.json();
      console.log("Update response:", data);

      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error("Could not update profile: " + err.message);
    }
  };

  const avatarUrl = useMemo(
    () =>
      `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
        form.name || "User"
      )}`,
    [form.name]
  );

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={avatarUrl}
          alt="Avatar"
          width={80}
          height={80}
          className="rounded-full border"
        />
      </div>

      <form className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            disabled={!isEditing}
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <Label>Title</Label>
          <Input
            disabled={!isEditing}
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div>
          <Label>Bio</Label>
          <Input
            disabled={!isEditing}
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
        </div>

        <div>
          <Label>Skills (comma-separated)</Label>
          <Input
            disabled={!isEditing}
            value={form.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            disabled={!isEditing}
            value={form.contact.phone}
            onChange={(e) => handleContactChange("phone", e.target.value)}
          />
        </div>

        <div>
          <Label>Website</Label>
          <Input
            disabled={!isEditing}
            value={form.contact.website}
            onChange={(e) => handleContactChange("website", e.target.value)}
          />
        </div>

        <div>
          <Label>LinkedIn</Label>
          <Input
            disabled={!isEditing}
            value={form.contact.linkedin}
            onChange={(e) => handleContactChange("linkedin", e.target.value)}
          />
        </div>

        {isEditing ? (
          <Button type="button" className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
            {user.role === "freelancer" ? (
              <Link
                href="/dashboard/jobs"
                className="block text-center text-blue-600 hover:underline mt-6"
              >
                Jobs You Might Like
              </Link>
            ) : (
              <Link
                href="/dashboard/jobs/proposals"
                className="block text-center text-blue-600 hover:underline mt-6"
              >
                View Proposals
              </Link>
            )}
          </>
        )}
      </form>
    </div>
  );
}
