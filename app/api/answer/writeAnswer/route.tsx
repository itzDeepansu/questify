import { NextResponse } from 'next/server';
import prisma from '@/libs/prismaClient';

export async function POST(req: Request) {
  try {
    const { questionId, userId, body } = await req.json();

    if (!questionId || !userId || !body?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the answer
    const answer = await prisma.answer.create({
      data: {
        questionId,
        userId,
        body,
      },
    });

    // Get the question and its author
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { user: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Only send notification if answering someone else's question
    if (question.userId !== userId) {
      const actor = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, image: true },
      });

      await prisma.notification.create({
        data: {
          userId: question.userId,               // recipient
          actorId: userId,                       // who triggered
          actor_username: actor?.username || '',
          actor_image: actor?.image || '',
          content: 'answered your question',
          type: 'answer',
          type_id: questionId,
        },
      });
    }

    return NextResponse.json({ success: true, answer }, { status: 200 });

  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
