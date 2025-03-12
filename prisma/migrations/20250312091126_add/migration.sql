/*
  Warnings:

  - You are about to drop the column `score` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'MEDECIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "score",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PATIENT';
