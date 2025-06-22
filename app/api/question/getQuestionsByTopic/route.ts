import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { userId, page = 1, topic } = await req.json();
    const take = 10;
    const skip = (page - 1) * take;

    const questions = await prisma.question.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        topics: {
          some: {
            topic: {
              name: {
                equals: topic,
                mode: "insensitive", // 🔍 case-insensitive match
              },
            },
          },
        },
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
            userId,
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

    return NextResponse.json({
      questions: formatted,
      hasMore: questions.length === take,
    });
  } catch (error) {
    console.error("Error fetching filtered questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
