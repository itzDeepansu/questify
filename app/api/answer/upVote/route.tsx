import prisma from "@/libs/prismaClient";
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { answerId ,userId } = await req.json()

    // Create upvote (ignore if already upvoted)
    await prisma.answerUpvote.create({
      data: {
        answerId,
        userId,
      },
    })

    return NextResponse.json({ message: 'Upvoted successfully' })
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Duplicate upvote
      return NextResponse.json({ message: 'Already upvoted' }, { status: 200 })
    }

    console.error('Error upvoting question:', error)
    return NextResponse.json({ error: 'Failed to upvote' }, { status: 500 })
  }
}
