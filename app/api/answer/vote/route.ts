import prisma from "@/libs/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";

export async function POST(req: NextRequest) {
  try {
    const { answerId, userId, type, actor_image, actor_username, actorId } = await req.json();

    if (!answerId || !userId || !["upvote", "downvote"].includes(type)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (type === "upvote") {
      // Remove downvote if it exists
      await prisma.answerDownvote.deleteMany({
        where: { answerId, userId },
      });
      await prisma.answerUpvote.create({
        data: { answerId, userId },
      });
      const {questionId} = await prisma.answer.findUnique({
        where: {
          id: answerId,
        },
        select: {
          questionId: true,
        },
      })
      await prisma.notification.create({
        data: {
          userId: userId,
          actorId: actorId,
          content: "Upvoted your answer",
          actor_username,
          actor_image,
          type: "answer",
          type_id: questionId,
        },
      });

      return NextResponse.json({ message: "Upvoted successfully" });
    }

    if (type === "downvote") {
      // Remove upvote if it exists
      await prisma.answerUpvote.deleteMany({
        where: { answerId, userId },
      });

      await prisma.answerDownvote.create({
        data: { answerId, userId },
      });

      const {questionId} = await prisma.answer.findUnique({
        where: {
          id: answerId,
        },
        select: {
          questionId: true,
        },
      })
      await prisma.notification.create({
        data: {
          userId: userId,
          actorId: actorId,
          content: "Downvoted your answer",
          actor_username,
          actor_image,
          type: "answer",
          type_id: questionId,
        },
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
