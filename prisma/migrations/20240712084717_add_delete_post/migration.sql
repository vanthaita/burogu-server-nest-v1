-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
