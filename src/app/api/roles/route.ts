import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RoleSchema {
    name: string;
    description: string;
    permissions: string[];
}

// fetch all roles
export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const roles = await prisma.role.findMany({
            include: {
                RolePermission: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        // map the RolePermission join table data to a clean RoleSchema

        const formattedRoles = roles.map(role => ({
            ...role,
            permissions: role.RolePermission.map(rp => rp.permission.name),
        }))
        return NextResponse.json(formattedRoles);
    } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
    }
}

// create a role

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, description, permissions }: RoleSchema = await req.json();

        if (!name || name.trim() === "") {
            return NextResponse.json({ message: "Role name is required" }, { status: 400 });
        }

        const role = await prisma.role.create({
            data: {
                name,
                description,
                RolePermission: {
                    create: permissions?.map(permissionId => ({
                        permission: { connect: { id: parseInt(permissionId, 10) } },
                    })) || [],
                },
            },
            include: {
                RolePermission: {
                    include: { permission: true }
                },
            },
        });

        return NextResponse.json({
            ...role,
            permissions: role.RolePermission.map(rp => rp.permission),
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating role:", error);
        return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
    }
}