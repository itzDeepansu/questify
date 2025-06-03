import { NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterBody = await request.json();

    // Validate required fields
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await prisma.user.findMany({
      where: {
        email: body.email,
      },
    });

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(body.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        username: body.username,
        phoneNumber: body.email,
        image: body.image,
        passwordHash: passwordHash,
        onlineStatus: false,
        socketID: null,
      },
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

  } catch (error: any) {
    console.error("User registration error:", error);

    if (error.code === "P2002") {
      // Prisma unique constraint error
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
