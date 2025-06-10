
import prisma from "@/libs/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { questionId, userId, type } = await req.json();
    if (type == "upvote") {
      const alreadyUpvoted = await prisma.questionUpvote.findFirst({
        where: {
          questionId,
          userId,
        },
      });

      if (alreadyUpvoted) {
        await prisma.questionUpvote.delete({
          where: {
            id: alreadyUpvoted.id,
          },
        })
      }
      await prisma.questionUpvote.create({
        data: {
          questionId,
          userId,
        },
      });
      return NextResponse.json({ message: "Upvoted successfully" });
    } else if (type == "downvote") {
      const alreadyUpvoted = await prisma.questionUpvote.findFirst({
        where: {
          questionId,
          userId,
        },
      });

      if (alreadyUpvoted) {
        await prisma.questionUpvote.delete({
          where: {
            id: alreadyUpvoted.id,
          },
        })
      }
      await prisma.questionDownvote.create({
        data: {
          questionId,
          userId,
        },
      });
      return NextResponse.json({ message: "Downvoted successfully" });
    }

    return NextResponse.json({ message: "Wrong type of request" });
  } catch (error: any) {
    console.error("Error upvoting question:", error);
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
