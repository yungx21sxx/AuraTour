-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListingStatistic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listingId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_DATE,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "bookings" INTEGER NOT NULL DEFAULT 0,
    "submits" INTEGER NOT NULL DEFAULT 0,
    "revenue" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ListingStatistic_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ListingStatistic" ("bookings", "createdAt", "date", "favorites", "id", "likes", "listingId", "revenue", "updatedAt", "views") SELECT "bookings", "createdAt", "date", "favorites", "id", "likes", "listingId", "revenue", "updatedAt", "views" FROM "ListingStatistic";
DROP TABLE "ListingStatistic";
ALTER TABLE "new_ListingStatistic" RENAME TO "ListingStatistic";
CREATE UNIQUE INDEX "ListingStatistic_listingId_date_key" ON "ListingStatistic"("listingId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
