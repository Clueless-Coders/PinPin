/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `downvotes` on the `Pin` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Pin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- AlterTable
ALTER TABLE "Pin" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- CreateTable
CREATE TABLE "PinVote" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "pinId" INTEGER NOT NULL,

    CONSTRAINT "PinVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentVote" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "CommentVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PinVote" ADD CONSTRAINT "PinVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinVote" ADD CONSTRAINT "PinVote_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
