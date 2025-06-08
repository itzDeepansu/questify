import { NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function POST(req: Request) {
  try {
    const { questionId, userId } = await req.json();

    if (!questionId || !userId) {
      return NextResponse.json(
        { error: "Missing questionId or userId" },
        { status: 400 }
      );
    }

    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: {
        user: true,
        upvotes: true,
        downvotes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = answers.map((answer) => ({
      ...answer,
      alreadyUpvoted: answer.upvotes.some((v) => v.userId === userId),
      alreadyDownvoted: answer.downvotes.some((v) => v.userId === userId),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
