-- DropIndex
DROP INDEX "Viewable_pinId_key";

-- DropIndex
DROP INDEX "Viewable_userId_key";

-- AlterTable
ALTER TABLE "Viewable" ADD CONSTRAINT "Viewable_pkey" PRIMARY KEY ("userId", "pinId");
