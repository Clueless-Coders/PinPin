/*
  Warnings:

  - The primary key for the `CommentVote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CommentVote` table. All the data in the column will be lost.
  - The primary key for the `PinVote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PinVote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CommentVote" DROP CONSTRAINT "CommentVote_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CommentVote_pkey" PRIMARY KEY ("userId", "commentId");

-- AlterTable
ALTER TABLE "PinVote" DROP CONSTRAINT "PinVote_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PinVote_pkey" PRIMARY KEY ("userId", "pinId");
