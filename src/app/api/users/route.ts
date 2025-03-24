import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
export async function GET() {
    try {
      const session = await auth();
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const users = await prisma.user.findMany({
        include: {
          UserRole: {
            include: {
              role: true,
            },
          },
        },
      });
  
      return NextResponse.json(
        users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.UserRole.map((ur) => ur.role.name),
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }