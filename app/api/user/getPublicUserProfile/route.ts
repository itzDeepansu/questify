import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing user ID" }, { status: 400 });
    }

    const userId = Number(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        questions: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            _count: {
              select: {
                upvotes: true,
                answers: true,
              },
            },
          },
        },
        answers: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            questionId:true,
            question: {
              select: {
                title: true,
              },
            },
            _count: {
              select: {
                upvotes: true,
              },
            },
          },
        },
        discussions: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            questionId:true,
            _count: {
              select: {
                upvotes: true,
              },
            },
          },
        },
        interests: {
          select: {
            topic: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
