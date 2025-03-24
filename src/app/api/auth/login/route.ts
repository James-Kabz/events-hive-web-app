import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 🔹 Parse request body
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 🔹 Find user with roles and permissions
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        UserRole: {
          include: {
            role: {
              include: {
                RolePermission: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 403 }
      );
    }

    // 🔹 Validate password securely
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 403 }
      );
    }

    // 🔹 Extract user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.UserRole.map((ur) => ur.role.name),
      permissions: user.UserRole.flatMap((ur) =>
        ur.role.RolePermission.map((rp) => rp.permission.name)
      ),
    };

    // 🔹 Generate JWT Token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, roles: userResponse.roles },
      process.env.JWT_SECRET as string, // Ensure you have this in .env
      { expiresIn: "1h" }
    );

    // 🔹 Return user data + token
    return NextResponse.json({ ...userResponse, accessToken });
  } catch (error: unknown) {
    console.error(
      "Login error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}