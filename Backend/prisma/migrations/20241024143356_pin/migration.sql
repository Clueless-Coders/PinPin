-- CreateTable
CREATE TABLE "Pin" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(300) NOT NULL,
    "upvotes" INTEGER NOT NULL,
    "downvotes" INTEGER NOT NULL,
    "imageURL" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("id")
);
