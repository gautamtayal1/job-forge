/*
  Warnings:

  - You are about to drop the column `description` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_userId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "description",
DROP COLUMN "isActive",
DROP COLUMN "userId",
ADD COLUMN     "userMail" TEXT NOT NULL DEFAULT 'test@gmail.com';

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userMail_fkey" FOREIGN KEY ("userMail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
