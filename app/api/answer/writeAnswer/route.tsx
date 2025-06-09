import { NextResponse } from 'next/server';
import prisma from '@/libs/prismaClient';

export async function POST(req: Request) {
  try {
    const { questionId, userId, body } = await req.json();

    if (!questionId || !userId || !body?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        questionId,
        userId,
        body,
      },
    });

    return NextResponse.json({ success: true, answer }, { status: 200 });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
