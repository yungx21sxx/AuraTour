-- AlterTable
ALTER TABLE "City" ADD COLUMN "slug" TEXT;

-- CreateTable
CREATE TABLE "SeoPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lastModified" DATETIME NOT NULL,
    "priority" REAL NOT NULL DEFAULT 0.8,
    "changefreq" TEXT NOT NULL DEFAULT 'monthly',
    "isIndexable" BOOLEAN NOT NULL DEFAULT true,
    "cityId" INTEGER,
    "listingTypeId" INTEGER,
    CONSTRAINT "SeoPage_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SeoPage_listingTypeId_fkey" FOREIGN KEY ("listingTypeId") REFERENCES "ListingType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
