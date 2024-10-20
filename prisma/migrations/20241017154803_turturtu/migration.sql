-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
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
INSERT INTO "new_Booking" ("adults", "checkIn", "checkOut", "childrens", "comment", "createdAt", "id", "listingId", "managerId", "prepay", "roomId", "status", "totalPrice", "transfer", "transferComment", "userId") SELECT "adults", "checkIn", "checkOut", "childrens", "comment", "createdAt", "id", "listingId", "managerId", "prepay", "roomId", "status", "totalPrice", "transfer", "transferComment", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL DEFAULT 'TOURIST',
    "isTemporary" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "vk_id" TEXT,
    "vk_token" TEXT,
    "bonusPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdByAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("bonusPoints", "createdAt", "email", "id", "isTemporary", "name", "phone", "role", "surname", "updatedAt", "vk_id", "vk_token") SELECT "bonusPoints", "createdAt", "email", "id", "isTemporary", "name", "phone", "role", "surname", "updatedAt", "vk_id", "vk_token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_vk_id_key" ON "User"("vk_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
