/*
  Warnings:

  - You are about to drop the column `listingId` on the `FlatProperties` table. All the data in the column will be lost.
  - Added the required column `flatId` to the `FlatProperties` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FlatProperties" (
    "floor" INTEGER NOT NULL,
    "maxFloor" INTEGER NOT NULL,
    "elevator" BOOLEAN NOT NULL,
    "flatId" INTEGER NOT NULL,
    CONSTRAINT "FlatProperties_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FlatProperties" ("elevator", "floor", "maxFloor") SELECT "elevator", "floor", "maxFloor" FROM "FlatProperties";
DROP TABLE "FlatProperties";
ALTER TABLE "new_FlatProperties" RENAME TO "FlatProperties";
CREATE UNIQUE INDEX "FlatProperties_flatId_key" ON "FlatProperties"("flatId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
