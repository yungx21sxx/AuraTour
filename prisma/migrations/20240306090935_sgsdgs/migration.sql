/*
  Warnings:

  - You are about to drop the column `guestsCount` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `adults` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `childrens` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "adults" INTEGER NOT NULL,
    "childrens" INTEGER NOT NULL,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "transfer" BOOLEAN NOT NULL,
    "transferComment" TEXT,
    "listingId" INTEGER NOT NULL,
    "roomId" INTEGER,
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("comment", "createdAt", "endDate", "id", "listingId", "name", "phone", "roomId", "startDate", "surname", "transfer", "transferComment", "userId") SELECT "comment", "createdAt", "endDate", "id", "listingId", "name", "phone", "roomId", "startDate", "surname", "transfer", "transferComment", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
