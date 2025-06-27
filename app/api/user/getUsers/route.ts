import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { page = 1 } = await req.json();
    const take = 20;
    const skip = (page - 1) * take;

    const users = await prisma.user.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            answers: true,
            discussions: true,
          },
        },
      },
    });

    return NextResponse.json({
      users,
      hasMore: users.length === take,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
