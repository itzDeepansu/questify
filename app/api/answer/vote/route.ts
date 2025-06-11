import prisma from "@/libs/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { answerId, userId, type } = await req.json();

    if (!answerId || !userId || !["upvote", "downvote"].includes(type)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (type === "upvote") {
      // Remove downvote if it exists
      await prisma.answerDownvote.deleteMany({
        where: { answerId, userId },
      });

      // Toggle upvote
      const existing = await prisma.answerUpvote.findUnique({
        where: {
          userId_answerId: { userId, answerId },
        },
      });

      if (existing) {
        await prisma.answerUpvote.delete({
          where: { userId_answerId: { userId, answerId } },
        });
        return NextResponse.json({ message: "Upvote removed" });
      }

      await prisma.answerUpvote.create({
        data: { answerId, userId },
      });

      return NextResponse.json({ message: "Upvoted successfully" });
    }

    if (type === "downvote") {
      // Remove upvote if it exists
      await prisma.answerUpvote.deleteMany({
        where: { answerId, userId },
      });

      // Toggle downvote
      const existing = await prisma.answerDownvote.findUnique({
        where: {
          userId_answerId: { userId, answerId },
        },
      });

      if (existing) {
        await prisma.answerDownvote.delete({
          where: { userId_answerId: { userId, answerId } },
        });
        return NextResponse.json({ message: "Downvote removed" });
      }

      await prisma.answerDownvote.create({
        data: { answerId, userId },
      });

      return NextResponse.json({ message: "Downvoted successfully" });
    }

    return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
  } catch (error) {
    console.error("Error voting on answer:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
