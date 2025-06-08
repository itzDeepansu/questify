import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";


export async function POST(req: Request) {
  try {
    const { questionId, userId } = await req.json();

    if (!questionId || !userId) {
      return NextResponse.json({ error: 'Missing questionId or userId' }, { status: 400 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        user: true,
        topics: {
          include: {
            topic: true,
          },
        },
        upvotes: true,
        downvotes: true,
        // answers: {
        //   include: {
        //     user: true,
        //     upvotes: true,
        //     downvotes: true,
        //   },
        // },
        // discussions: {
        //   include: {
        //     user: true,
        //     upvotes: true,
        //     downvotes: true,
        //   },
        // },
      },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Add alreadyUpvoted / alreadyDownvoted flags
    // const formattedAnswers = question.answers.map(answer => ({
    //   ...answer,
    //   alreadyUpvoted: answer.upvotes.some(v => v.userId === userId),
    //   alreadyDownvoted: answer.downvotes.some(v => v.userId === userId),
    // }));

    // const formattedDiscussions = question.discussions.map(discussion => ({
    //   ...discussion,
    //   alreadyUpvoted: discussion.upvotes.some(v => v.userId === userId),
    //   alreadyDownvoted: discussion.downvotes.some(v => v.userId === userId),
    // }));

    return NextResponse.json({
      ...question,
      // answers: formattedAnswers,
      // discussions: formattedDiscussions,
      alreadyUpvoted: question.upvotes.some(v => v.userId === userId),
      alreadyDownvoted: question.downvotes.some(v => v.userId === userId),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


