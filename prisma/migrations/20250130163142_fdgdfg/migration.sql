/*
  Warnings:

  - You are about to drop the `Infostracture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListingInfostracture` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Infostracture";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ListingInfostracture";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Infrastructure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ListingInfrastructure" (
    "listingId" INTEGER NOT NULL,
    "infostractureId" INTEGER NOT NULL,

    PRIMARY KEY ("listingId", "infostractureId"),
    CONSTRAINT "ListingInfrastructure_infostractureId_fkey" FOREIGN KEY ("infostractureId") REFERENCES "Infrastructure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListingInfrastructure_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
