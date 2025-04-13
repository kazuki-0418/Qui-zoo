-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GENERAL', 'SCIENCE', 'HISTORY', 'GEOGRAPHY', 'ENTERTAINMENT', 'SPORTS');

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'GENERAL',
    "creatorId" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);
