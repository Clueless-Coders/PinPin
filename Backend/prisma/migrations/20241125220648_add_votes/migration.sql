/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- CreateTable
CREATE TABLE "pinVotes" (
    "userID" INTEGER NOT NULL,
    "pinID" INTEGER NOT NULL,
    "vote" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "commentVotes" (
    "userID" INTEGER NOT NULL,
    "pinID" INTEGER NOT NULL,
    "commentID" INTEGER NOT NULL,
    "vote" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "pinVotes_userID_pinID_key" ON "pinVotes"("userID", "pinID");

-- CreateIndex
CREATE UNIQUE INDEX "commentVotes_userID_pinID_commentID_key" ON "commentVotes"("userID", "pinID", "commentID");

-- AddForeignKey
ALTER TABLE "pinVotes" ADD CONSTRAINT "pinVotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinVotes" ADD CONSTRAINT "pinVotes_pinID_fkey" FOREIGN KEY ("pinID") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentVotes" ADD CONSTRAINT "commentVotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentVotes" ADD CONSTRAINT "commentVotes_pinID_fkey" FOREIGN KEY ("pinID") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentVotes" ADD CONSTRAINT "commentVotes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
