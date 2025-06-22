import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { page = 1 } = await req.json();
    const take = 30;
    const skip = (page - 1) * take;

    const topics = await prisma.topic.findMany({
      skip,
      take,
      orderBy: {
        name: "asc",
      },
    });

    const totalCount = await prisma.topic.count();

    return NextResponse.json({
      topics,
      hasMore: skip + topics.length < totalCount,
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
