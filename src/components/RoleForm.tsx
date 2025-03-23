"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MultiSelect from "@/components/ui/multi-select";  // Update import path
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Permission {
  id: string;
  name: string;
}

const RoleForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch("/api/permissions");
        const data = await response.json();
        setAllPermissions(data);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
        toast.error("Error fetching permissions");
      }
    };

    fetchPermissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, permissions }),
      });

      if (!response.ok) {
        toast.error("Failed to create role. Please try again.");
        return;
      }

      toast.success("Role created successfully!");
      router.push("/dashboard/roles");
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full min-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create New Role</CardTitle>
        <CardDescription>Define a new role with permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter role description"
            />
          </div>
          <div>
            <Label>Permissions</Label>
            <MultiSelect
              options={allPermissions.map((perm) => ({
                value: perm.id,
                label: perm.name,
              }))}
              value={permissions}
              onChange={(values) => setPermissions(values)}
              placeholder="Select permissions"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Role..." : "Create Role"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
