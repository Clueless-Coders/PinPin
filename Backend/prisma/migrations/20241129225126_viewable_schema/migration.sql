/*
  Warnings:

  - You are about to drop the `_viewable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_viewable" DROP CONSTRAINT "_viewable_A_fkey";

-- DropForeignKey
ALTER TABLE "_viewable" DROP CONSTRAINT "_viewable_B_fkey";

-- DropTable
DROP TABLE "_viewable";

-- CreateTable
CREATE TABLE "Viewable" (
    "userId" INTEGER NOT NULL,
    "pinId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Viewable_userId_key" ON "Viewable"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Viewable_pinId_key" ON "Viewable"("pinId");

-- AddForeignKey
ALTER TABLE "Viewable" ADD CONSTRAINT "Viewable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viewable" ADD CONSTRAINT "Viewable_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
