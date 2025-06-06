import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prismaClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, body: questionBody, topicNames } = body;
    console.log(body);
    if (!userId || !title || !Array.isArray(topicNames)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert each topic by name
    const topics = await Promise.all(
      topicNames.map((name: string) =>
        prisma.topic.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    // Create the question and connect the topics
    const question = await prisma.question.create({
      data: {
        title,
        body: questionBody,
        user: { connect: { id: userId } },
        topics: {
          create: topics.map((topic) => ({
            topic: { connect: { id: topic.id } },
          })),
        },
      },
      include: {
        user: { select: { id: true, username: true, image: true } },
        topics: { include: { topic: true } },
        _count: {
          select: {
            answers: true,
            upvotes: true,
          },
        },
      },
    });

    return NextResponse.json(question, { status: 200 });
  } catch (err) {
    console.error('Error creating question:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
