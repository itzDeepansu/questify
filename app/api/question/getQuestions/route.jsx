import { NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true, // included author's image
          },
        },
        topics: {
          include: {
            topic: true,
          },
        },
        _count: {
          select: {
            answers: true,
            upvotes: true,
          },
        },
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
