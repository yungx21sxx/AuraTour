-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SeoPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT '/seo/listing-type.jpg',
    "smallTitle" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lastModified" DATETIME NOT NULL,
    "priority" REAL NOT NULL DEFAULT 0.8,
    "changefreq" TEXT NOT NULL DEFAULT 'monthly',
    "isIndexable" BOOLEAN NOT NULL DEFAULT true,
    "cityId" INTEGER,
    "listingTypeId" INTEGER,
    CONSTRAINT "SeoPage_listingTypeId_fkey" FOREIGN KEY ("listingTypeId") REFERENCES "ListingType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SeoPage_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SeoPage" ("changefreq", "cityId", "description", "id", "isIndexable", "lastModified", "listingTypeId", "path", "priority", "smallTitle", "title") SELECT "changefreq", "cityId", "description", "id", "isIndexable", "lastModified", "listingTypeId", "path", "priority", "smallTitle", "title" FROM "SeoPage";
DROP TABLE "SeoPage";
ALTER TABLE "new_SeoPage" RENAME TO "SeoPage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
