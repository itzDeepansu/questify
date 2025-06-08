-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "QuestionDownvote" (
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "QuestionDownvote_pkey" PRIMARY KEY ("userId","questionId")
);

-- CreateTable
CREATE TABLE "AnswerDownvote" (
    "userId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,

    CONSTRAINT "AnswerDownvote_pkey" PRIMARY KEY ("userId","answerId")
);

-- CreateTable
CREATE TABLE "DiscussionDownvote" (
    "userId" INTEGER NOT NULL,
    "discussionId" INTEGER NOT NULL,

    CONSTRAINT "DiscussionDownvote_pkey" PRIMARY KEY ("userId","discussionId")
);

-- AddForeignKey
ALTER TABLE "QuestionDownvote" ADD CONSTRAINT "QuestionDownvote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionDownvote" ADD CONSTRAINT "QuestionDownvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerDownvote" ADD CONSTRAINT "AnswerDownvote_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerDownvote" ADD CONSTRAINT "AnswerDownvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionDownvote" ADD CONSTRAINT "DiscussionDownvote_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionDownvote" ADD CONSTRAINT "DiscussionDownvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
