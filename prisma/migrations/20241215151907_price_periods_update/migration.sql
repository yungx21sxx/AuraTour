/*
  Warnings:

  - You are about to drop the column `endDate` on the `PricePeriod` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `PricePeriod` table. All the data in the column will be lost.
  - Added the required column `endDay` to the `PricePeriod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endMonth` to the `PricePeriod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDay` to the `PricePeriod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMonth` to the `PricePeriod` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PricePeriod" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" INTEGER NOT NULL,
    "startDay" INTEGER NOT NULL,
    "startMonth" INTEGER NOT NULL,
    "endDay" INTEGER NOT NULL,
    "endMonth" INTEGER NOT NULL,
    "listingId" INTEGER,
    "roomId" INTEGER,
    CONSTRAINT "PricePeriod_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PricePeriod_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PricePeriod" ("id", "listingId", "price", "roomId") SELECT "id", "listingId", "price", "roomId" FROM "PricePeriod";
DROP TABLE "PricePeriod";
ALTER TABLE "new_PricePeriod" RENAME TO "PricePeriod";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
