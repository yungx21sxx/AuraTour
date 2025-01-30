-- AlterTable
ALTER TABLE "Listing" ADD COLUMN "foodDescription" TEXT;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN "includedDescription" TEXT;

-- CreateTable
CREATE TABLE "Infostracture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ListingInfostracture" (
    "listingId" INTEGER NOT NULL,
    "infostractureId" INTEGER NOT NULL,

    PRIMARY KEY ("listingId", "infostractureId"),
    CONSTRAINT "ListingInfostracture_infostractureId_fkey" FOREIGN KEY ("infostractureId") REFERENCES "Infostracture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListingInfostracture_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
