import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // 🔹 Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // 🔹 Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already in use." }, { status: 409 });
    }

    // 🔹 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Find the "guest" role or create it if it doesn't exist
    let guestRole = await prisma.role.findUnique({ where: { name: "guest" } });
    if (!guestRole) {
      guestRole = await prisma.role.create({ data: { name: "guest" } });
    }

    // 🔹 Create the user and assign the "guest" role in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, password: hashedPassword },
      });

      await tx.userRole.create({
        data: { userId: newUser.id, roleId: guestRole.id },
      });

      return newUser;
    });

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: { id: user.id, name: user.name, email: user.email, role: guestRole.name },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}
