/*
  Warnings:

  - Made the column `slug` on table `City` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "regionId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "City_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_City" ("id", "name", "regionId", "slug") SELECT "id", "name", "regionId", "slug" FROM "City";
DROP TABLE "City";
ALTER TABLE "new_City" RENAME TO "City";
CREATE UNIQUE INDEX "City_name_key" ON "City"("name");
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");
CREATE UNIQUE INDEX "City_id_slug_key" ON "City"("id", "slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
