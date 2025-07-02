import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { searchedInput, lastId, limit = 10 } = await req.json();

    if (!searchedInput || searchedInput.trim() === "") {
      return NextResponse.json({ questions: [], topics: [], hasMore: false });
    }

    const questions = await prisma.$queryRawUnsafe(
      `
      SELECT "Question".*, "User"."username", "User"."image"
      FROM "Question"
      JOIN "User" ON "User"."id" = "Question"."userId"
      WHERE (similarity("Question"."title", $1) > 0.2
         OR similarity("Question"."body", $1) > 0.2)
        ${lastId ? `AND "Question"."id" < ${Number(lastId)}` : ""}
      ORDER BY GREATEST(
        similarity("Question"."title", $1),
        similarity("Question"."body", $1)
      ) DESC
      LIMIT ${Number(limit)};
    `,
      searchedInput
    );

    const topics = await prisma.$queryRawUnsafe(
      `
      SELECT "name"
      FROM "Topic"
      WHERE similarity("name", $1) > 0.2
      ORDER BY similarity("name", $1) DESC;
    `,
      searchedInput
    );

    return NextResponse.json({
      questions,
      topics: topics.map((t) => t.name),
      hasMore: questions.length === Number(limit),
      nextCursor:
        questions.length > 0 ? questions[questions.length - 1].id : null,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
