import prisma from "@/libs/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { questionId, userId, type, actor_image, actor_username, actorId } =
      await req.json();

    if (!questionId || !userId || !["upvote", "downvote"].includes(type)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (type === "upvote") {
      // Remove existing downvote if any
      await prisma.questionDownvote.deleteMany({
        where: { questionId, userId },
      });

      // // Toggle upvote
      // const existing = await prisma.questionUpvote.findUnique({
      //   where: {
      //     userId_questionId: { userId, questionId },
      //   },
      // });

      // if (existing) {
      //   await prisma.questionUpvote.delete({
      //     where: { userId_questionId: { userId, questionId } },
      //   });
      //   return NextResponse.json({ message: "Upvote removed" });
      // }

      await prisma.questionUpvote.create({
        data: { questionId, userId },
      });
      await prisma.notification.create({
        data: {
          userId: actorId,
          actorId: userId,
          content: "Upvoted your question",
          actor_username,
          actor_image,
          type:'question',
          type_id:questionId
        },
      });
      return NextResponse.json({ message: "Upvoted successfully" });
    }

    if (type === "downvote") {
      // Remove existing upvote if any
      await prisma.questionUpvote.deleteMany({
        where: { questionId, userId },
      });

      // Toggle downvote
      // const existing = await prisma.questionDownvote.findUnique({
      //   where: {
      //     userId_questionId: { userId, questionId },
      //   },
      // });

      // if (existing) {
      //   await prisma.questionDownvote.delete({
      //     where: { userId_questionId: { userId, questionId } },
      //   });
      //   return NextResponse.json({ message: "Downvote removed" });
      // }

      await prisma.questionDownvote.create({
        data: { questionId, userId },
      });
      await prisma.notification.create({
        data: {
          userId: actorId,
          actorId: userId,
          content: "Downvoted your question",
          actor_username,
          actor_image,
          type:'question',
          type_id:questionId
        },
      });

      return NextResponse.json({ message: "Downvoted successfully" });
    }

    return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
