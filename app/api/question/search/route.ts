// app/api/question/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { searchedInput, lastId, limit = 10 } = await req.json();

    if (!searchedInput || searchedInput.trim() === "") {
      return NextResponse.json({ questions: [], hasMore: false });
    }

    const results = await prisma.$queryRawUnsafe(
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

    return NextResponse.json({
      questions: results,
      hasMore: results.length === Number(limit),
      nextCursor: results.length > 0 ? results[results.length - 1].id : null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
