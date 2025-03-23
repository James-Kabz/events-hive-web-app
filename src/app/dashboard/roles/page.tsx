"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/api/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles. Please try again.");
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Roles Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Roles List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description || "No description"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.length > 0 ? (
                          role.permissions.map((perm, index) => (
                            <Badge key={index} className="mr-1">
                              {perm}
                            </Badge>
                          ))
                        ) : (
                          <span>No permissions</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No roles available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
