import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
