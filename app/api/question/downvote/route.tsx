import prisma from "@/libs/prismaClient";
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { questionId ,userId } = await req.json()

    // Create downvote (ignore if already downvoted)
    await prisma.answerDownvote.create({
      data: {
        questionId,
        userId,
      },
    })

    return NextResponse.json({ message: 'downvoted successfully' })
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Duplicate downvote
      return NextResponse.json({ message: 'Already downvoted' }, { status: 200 })
    }

    console.error('Error upvoting question:', error)
    return NextResponse.json({ error: 'Failed to downvote' }, { status: 500 })
  }
}
