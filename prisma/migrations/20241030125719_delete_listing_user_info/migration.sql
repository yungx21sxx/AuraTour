/*
  Warnings:

  - You are about to drop the column `phone` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `phoneRaw` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `renterName` on the `Listing` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "validated" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "address" TEXT NOT NULL DEFAULT 'Не указан',
    "places" INTEGER NOT NULL DEFAULT 2,
    "badCount" INTEGER NOT NULL DEFAULT 1,
    "minDaysOrder" INTEGER NOT NULL DEFAULT 3,
    "seaDistance" INTEGER NOT NULL,
    "area" INTEGER,
    "ownerId" INTEGER,
    "managerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "typeId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ListingType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("address", "area", "badCount", "cityId", "createdAt", "description", "id", "managerId", "minDaysOrder", "minPrice", "note", "ownerId", "places", "seaDistance", "title", "typeId", "validated") SELECT "address", "area", "badCount", "cityId", "createdAt", "description", "id", "managerId", "minDaysOrder", "minPrice", "note", "ownerId", "places", "seaDistance", "title", "typeId", "validated" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
