import { NextResponse } from 'next/server';
import prisma from '@/libs/prismaClient';

export async function POST(req: Request) {
  try {
    const { questionId, userId, content } = await req.json();

    if (!questionId || !userId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const discussion = await prisma.discussion.create({
      data: {
        questionId,
        userId,
        content,
      },
    });

    return NextResponse.json({ success: true, discussion }, { status: 200 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
