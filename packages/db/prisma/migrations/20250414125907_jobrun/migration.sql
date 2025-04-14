/*
  Warnings:

  - Added the required column `trigger` to the `JobRun` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobTrigger" AS ENUM ('scheduler', 'manual');

-- AlterTable
ALTER TABLE "JobRun" ADD COLUMN     "trigger" "JobTrigger" NOT NULL;
