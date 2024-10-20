-- CreateTable
CREATE TABLE "ListingStatistic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listingId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_DATE,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "bookings" INTEGER NOT NULL DEFAULT 0,
    "revenue" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ListingStatistic_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FlatProperties" (
    "floor" INTEGER NOT NULL,
    "maxFloor" INTEGER NOT NULL,
    "elevator" BOOLEAN NOT NULL,
    "listingId" INTEGER NOT NULL,
    CONSTRAINT "FlatProperties_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "floor" INTEGER,
    "maxFloor" INTEGER,
    "elevator" BOOLEAN,
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
INSERT INTO "new_Listing" ("address", "area", "badCount", "cityId", "createdAt", "description", "elevator", "floor", "id", "maxFloor", "minDaysOrder", "minPrice", "note", "phone", "phoneRaw", "places", "renterName", "seaDistance", "title", "typeId") SELECT "address", "area", coalesce("badCount", 1) AS "badCount", "cityId", "createdAt", "description", "elevator", "floor", "id", "maxFloor", "minDaysOrder", "minPrice", "note", "phone", "phoneRaw", coalesce("places", 2) AS "places", "renterName", "seaDistance", "title", "typeId" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ListingStatistic_listingId_date_key" ON "ListingStatistic"("listingId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "FlatProperties_listingId_key" ON "FlatProperties"("listingId");
