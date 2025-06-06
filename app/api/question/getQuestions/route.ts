import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    console.log(userId);
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
            image: true,
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
        upvotes: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    const formatted = questions.map((q) => ({
      ...q,
      alreadyUpvoted: q.upvotes.length > 0,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
