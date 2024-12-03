-- CreateTable
CREATE TABLE "pinVotes" (
    "userID" INTEGER NOT NULL,
    "pinID" INTEGER NOT NULL,
    "vote" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "commentVotes" (
    "userID" INTEGER NOT NULL,
    "commentID" INTEGER NOT NULL,
    "vote" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "pinVotes_userID_pinID_key" ON "pinVotes"("userID", "pinID");

-- CreateIndex
CREATE UNIQUE INDEX "commentVotes_userID_commentID_key" ON "commentVotes"("userID", "commentID");

-- AddForeignKey
ALTER TABLE "pinVotes" ADD CONSTRAINT "pinVotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pinVotes" ADD CONSTRAINT "pinVotes_pinID_fkey" FOREIGN KEY ("pinID") REFERENCES "Pin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentVotes" ADD CONSTRAINT "commentVotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentVotes" ADD CONSTRAINT "commentVotes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
