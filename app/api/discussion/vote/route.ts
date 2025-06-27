import prisma from "@/libs/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { discussionId, userId, type, actor_image, actor_username, actorId } =
      await req.json();

    if (!discussionId || !userId || !["upvote", "downvote"].includes(type)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (type === "upvote") {
      // Remove existing downvote
      await prisma.discussionDownvote.deleteMany({
        where: { discussionId, userId },
      });
      await prisma.discussionUpvote.create({
        data: { discussionId, userId },
      });
      const { questionId } = await prisma.discussion.findUnique({
        where: {
          id: discussionId,
        },
        select: {
          questionId: true,
        },
      });
      await prisma.notification.create({
        data: {
          userId: userId,
          actorId: actorId,
          content: "Upvoted your discussion",
          actor_username,
          actor_image,
          type: "discussion",
          type_id: questionId,
        },
      });

      return NextResponse.json({ message: "Upvoted successfully" });
    }

    if (type === "downvote") {
      // Remove existing upvote
      await prisma.discussionUpvote.deleteMany({
        where: { discussionId, userId },
      });
      await prisma.discussionDownvote.create({
        data: { discussionId, userId },
      });
      const { questionId } = await prisma.discussion.findUnique({
        where: {
          id: discussionId,
        },
        select: {
          questionId: true,
        },
      });
      await prisma.notification.create({
        data: {
          userId: userId,
          actorId: actorId,
          content: "Downvoted your discussion",
          actor_username,
          actor_image,
          type: "discussion",
          type_id: questionId,
        },
      });
      return NextResponse.json({ message: "Downvoted successfully" });
    }

    return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
  } catch (error) {
    console.error("Error voting on discussion:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
