-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FlatProperties" (
    "floor" INTEGER NOT NULL,
    "maxFloor" INTEGER NOT NULL,
    "elevator" BOOLEAN NOT NULL,
    "flatId" INTEGER NOT NULL,
    CONSTRAINT "FlatProperties_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FlatProperties" ("elevator", "flatId", "floor", "maxFloor") SELECT "elevator", "flatId", "floor", "maxFloor" FROM "FlatProperties";
DROP TABLE "FlatProperties";
ALTER TABLE "new_FlatProperties" RENAME TO "FlatProperties";
CREATE UNIQUE INDEX "FlatProperties_flatId_key" ON "FlatProperties"("flatId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
