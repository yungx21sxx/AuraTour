/*
  Warnings:

  - The primary key for the `ListingInfrastructure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `infostractureId` on the `ListingInfrastructure` table. All the data in the column will be lost.
  - Added the required column `infrastructureId` to the `ListingInfrastructure` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ListingInfrastructure" (
    "listingId" INTEGER NOT NULL,
    "infrastructureId" INTEGER NOT NULL,

    PRIMARY KEY ("listingId", "infrastructureId"),
    CONSTRAINT "ListingInfrastructure_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "Infrastructure" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListingInfrastructure_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ListingInfrastructure" ("listingId") SELECT "listingId" FROM "ListingInfrastructure";
DROP TABLE "ListingInfrastructure";
ALTER TABLE "new_ListingInfrastructure" RENAME TO "ListingInfrastructure";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
