/*
  Warnings:

  - You are about to drop the column `isRead` on the `Message` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "isRead",
ADD COLUMN     "status" "public"."MessageStatus" NOT NULL DEFAULT 'SENT';
