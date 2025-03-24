"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface Permission {
  id: number;
  name: string;
  description: string;
}

const PermissionList = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get("/api/permissions");
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to fetch permissions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Permissions List</CardTitle>
        <CardDescription>View all available permissions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading permissions...</p>
        ) : permissions.length > 0 ? (
          <ul className="space-y-2">
            {permissions.map((permission) => (
              <li key={permission.id} className="border-b pb-2">
                <strong>{permission.name}</strong>
                <p className="text-sm text-gray-600">{permission.description || "No description"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No permissions found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PermissionList;
