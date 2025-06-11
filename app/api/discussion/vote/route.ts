import prisma from "@/libs/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { discussionId, userId, type } = await req.json();

    if (!discussionId || !userId || !["upvote", "downvote"].includes(type)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (type === "upvote") {
      // Remove existing downvote
      await prisma.discussionDownvote.deleteMany({
        where: { discussionId, userId },
      });

      // Toggle upvote
      const existing = await prisma.discussionUpvote.findUnique({
        where: {
          userId_discussionId: { userId, discussionId },
        },
      });

      if (existing) {
        await prisma.discussionUpvote.delete({
          where: { userId_discussionId: { userId, discussionId } },
        });
        return NextResponse.json({ message: "Upvote removed" });
      }

      await prisma.discussionUpvote.create({
        data: { discussionId, userId },
      });

      return NextResponse.json({ message: "Upvoted successfully" });
    }

    if (type === "downvote") {
      // Remove existing upvote
      await prisma.discussionUpvote.deleteMany({
        where: { discussionId, userId },
      });

      // Toggle downvote
      const existing = await prisma.discussionDownvote.findUnique({
        where: {
          userId_discussionId: { userId, discussionId },
        },
      });

      if (existing) {
        await prisma.discussionDownvote.delete({
          where: { userId_discussionId: { userId, discussionId } },
        });
        return NextResponse.json({ message: "Downvote removed" });
      }

      await prisma.discussionDownvote.create({
        data: { discussionId, userId },
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
