import { NextResponse } from 'next/server';
import prisma from '@/libs/prismaClient';

export async function POST(req: Request) {
  try {
    const { questionId, userId, content } = await req.json();

    if (!questionId || !userId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the discussion
    const discussion = await prisma.discussion.create({
      data: {
        questionId,
        userId,
        content,
      },
    });

    // Get question details and its owner
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { user: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Send notification only if user is not commenting on their own question
    if (question.userId !== userId) {
      const actor = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, image: true },
      });

      await prisma.notification.create({
        data: {
          userId: question.userId,             // recipient
          actorId: userId,                     // actor
          actor_username: actor?.username || '',
          actor_image: actor?.image || '',
          content: 'commented on your question',
          type: 'discussion',
          type_id: questionId,
        },
      });
    }

    return NextResponse.json({ success: true, discussion }, { status: 200 });

  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
