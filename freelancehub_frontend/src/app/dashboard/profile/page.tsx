"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import instance from "@/lib/lib.axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/lib.auth";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [contact, setContact] = useState("");

  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    instance
      .get("/users/me")
      .then((res) => {
        setUser(res.data);
        setName(res.data.name || "");
        setTitle(res.data.title || "");
        setBio(res.data.bio || "");
        setSkills(res.data.skills || "");
        setContact(res.data.contact || "");
      })
      .catch(() => {
        toast.error("Please login first");
        router.push("/auth/login");
      });
  }, [hasMounted]);

  const handleSave = async () => {
    try {
      await instance.patch("/users/me", {
        name,
        title,
        bio,
        skills: skills.split(",").map((skill) => skill.trim()),
        contact,
      });
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!hasMounted) return null;
  if (!user) return <p className="text-center py-10">Loading profile...</p>;

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    user.name
  )}`;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <Image
          src={avatarUrl}
          alt="Avatar"
          width={80}
          height={80}
          unoptimized
          className="rounded-full border"
        />
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            disabled={!isEditing}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            disabled={!isEditing}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <Input
            disabled={!isEditing}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <Input
            disabled={!isEditing}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Comma Separated</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Info</label>
          <Input
            disabled={!isEditing}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Comma Separated</p>
        </div>

        {isEditing && (
          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        )}
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
        <Link
          href="/dashboard/jobs"
          className="block text-center text-blue-600 hover:underline mt-6"
        >
          Jobs You Might Like
        </Link>
      </form>
    </div>
  );
}
