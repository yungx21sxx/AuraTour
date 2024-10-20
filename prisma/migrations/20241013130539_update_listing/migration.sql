/*
  Warnings:

  - You are about to drop the column `elevator` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `maxFloor` on the `Listing` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "address" TEXT NOT NULL DEFAULT 'Не указан',
    "places" INTEGER NOT NULL DEFAULT 2,
    "badCount" INTEGER NOT NULL DEFAULT 1,
    "minDaysOrder" INTEGER NOT NULL DEFAULT 3,
    "seaDistance" INTEGER NOT NULL,
    "area" INTEGER,
    "phoneRaw" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "renterName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "typeId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    CONSTRAINT "Listing_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ListingType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("address", "area", "badCount", "cityId", "createdAt", "description", "id", "minDaysOrder", "minPrice", "note", "phone", "phoneRaw", "places", "renterName", "seaDistance", "title", "typeId") SELECT "address", "area", "badCount", "cityId", "createdAt", "description", "id", "minDaysOrder", "minPrice", "note", "phone", "phoneRaw", "places", "renterName", "seaDistance", "title", "typeId" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
