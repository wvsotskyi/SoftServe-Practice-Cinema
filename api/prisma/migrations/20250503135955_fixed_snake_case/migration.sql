/*
  Warnings:

  - You are about to drop the column `production_countries` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "production_countries",
ADD COLUMN     "productionCountries" TEXT[];
