-- CreateTable
CREATE TABLE "_viewable" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_viewable_AB_unique" ON "_viewable"("A", "B");

-- CreateIndex
CREATE INDEX "_viewable_B_index" ON "_viewable"("B");

-- AddForeignKey
ALTER TABLE "_viewable" ADD CONSTRAINT "_viewable_A_fkey" FOREIGN KEY ("A") REFERENCES "Pin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_viewable" ADD CONSTRAINT "_viewable_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
