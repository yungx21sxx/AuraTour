/*
  Warnings:

  - Added the required column `uuid` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userSurname" TEXT NOT NULL,
    "userPhone" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "adults" INTEGER NOT NULL,
    "childrens" INTEGER NOT NULL,
    "comment" TEXT,
    "transfer" BOOLEAN NOT NULL,
    "transferComment" TEXT,
    "totalPrice" INTEGER NOT NULL,
    "prepay" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdminCreated" BOOLEAN NOT NULL DEFAULT false,
    "roomId" INTEGER,
    "listingId" INTEGER NOT NULL,
    "userId" INTEGER,
    "managerId" INTEGER,
    CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("adults", "checkIn", "checkOut", "childrens", "comment", "createdAt", "id", "isAdminCreated", "listingId", "managerId", "prepay", "roomId", "status", "totalPrice", "transfer", "transferComment", "userId", "userName", "userPhone", "userSurname") SELECT "adults", "checkIn", "checkOut", "childrens", "comment", "createdAt", "id", "isAdminCreated", "listingId", "managerId", "prepay", "roomId", "status", "totalPrice", "transfer", "transferComment", "userId", "userName", "userPhone", "userSurname" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
