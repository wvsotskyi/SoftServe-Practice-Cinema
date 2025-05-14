/*
  Warnings:

  - You are about to drop the column `time` on the `Showtime` table. All the data in the column will be lost.
  - Added the required column `date` to the `Showtime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeOfDaySeconds` to the `Showtime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Showtime" DROP COLUMN "time",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeOfDaySeconds" INTEGER NOT NULL;
