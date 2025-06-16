import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { userId, username, email, image, password } = await req.json();

    // Fetch the existing user
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare the update payload
    const updateData: any = {};

    if (username && username !== existingUser.username) {
      updateData.username = username;
    }

    if (email && email !== existingUser.email) {
      updateData.email = email;
    }

    if (image && image !== existingUser.image) {
      updateData.image = image;
    }

    if (password && password.trim() !== "") {
      const isMatched = await bcrypt.compare(
        password,
        existingUser.passwordHash
      );

      if (!isMatched) {
        updateData.passwordHash = await bcrypt.hash(password, 10);
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No changes detected" },
        { status: 200 }
      );
    }
    console.log("udateData", updateData);
    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(
      { message: "User details updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
