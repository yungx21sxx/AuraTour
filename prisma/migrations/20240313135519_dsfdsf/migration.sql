-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "address" TEXT NOT NULL DEFAULT 'Не указан',
    "places" INTEGER DEFAULT 2,
    "badCount" INTEGER DEFAULT 1,
    "minDaysOrder" INTEGER NOT NULL DEFAULT 3,
    "seaDistance" INTEGER NOT NULL,
    "area" INTEGER,
    "floor" INTEGER,
    "maxFloor" INTEGER,
    "elevator" BOOLEAN,
    "phoneRaw" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "renterName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ListingType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("address", "area", "badCount", "cityId", "createdAt", "description", "elevator", "floor", "id", "maxFloor", "minDaysOrder", "minPrice", "phone", "phoneRaw", "places", "renterName", "seaDistance", "title", "typeId") SELECT "address", "area", "badCount", "cityId", "createdAt", "description", "elevator", "floor", "id", "maxFloor", "minDaysOrder", "minPrice", "phone", "phoneRaw", "places", "renterName", "seaDistance", "title", "typeId" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
