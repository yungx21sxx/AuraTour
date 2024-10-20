-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "adults" INTEGER NOT NULL,
    "childrens" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "comment" TEXT,
    "transfer" BOOLEAN NOT NULL,
    "transferComment" TEXT,
    "totalPrice" INTEGER NOT NULL,
    "prepay" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "roomId" INTEGER,
    "listingId" INTEGER NOT NULL,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("adults", "childrens", "comment", "createdAt", "email", "endDate", "id", "listingId", "name", "phone", "prepay", "roomId", "startDate", "surname", "totalPrice", "transfer", "transferComment", "userId") SELECT "adults", "childrens", "comment", "createdAt", "email", "endDate", "id", "listingId", "name", "phone", "prepay", "roomId", "startDate", "surname", "totalPrice", "transfer", "transferComment", "userId" FROM "Booking";
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "phone", "role", "surname", "updatedAt", "vk_id", "vk_token") SELECT "createdAt", "email", "id", "name", "phone", "role", "surname", "updatedAt", "vk_id", "vk_token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_vk_id_key" ON "User"("vk_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
