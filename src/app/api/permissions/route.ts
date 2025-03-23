import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


interface PermissionSchema  {
    name: string,
    description: string,
}


export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const permissions = await prisma.permission.findMany();
        return NextResponse.json(permissions);
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, description }: PermissionSchema = await req.json();

        if (!name ) {
            return NextResponse.json({ message: "Permission name is required" }, { status: 400 });
        }

        const permission = await prisma.permission.create({
            data: {
                name,
                description,
            },
        });

        return NextResponse.json(permission, {status: 201});
    } catch (error) {
        console.error("Error creating permission:", error);
        return NextResponse.json({ error: "Failed to create permission" }, { status: 500 });
    }
}