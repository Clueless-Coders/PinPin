/*
  Warnings:

  - Made the column `updatedAt` on table `Pin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pin" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "pinID" INTEGER NOT NULL,
    "test" VARCHAR(300) NOT NULL,
    "upvotes" INTEGER NOT NULL,
    "downvotes" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pinID_fkey" FOREIGN KEY ("pinID") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
