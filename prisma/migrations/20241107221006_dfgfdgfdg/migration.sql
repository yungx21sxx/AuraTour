/*
  Warnings:

  - You are about to drop the column `userId` on the `Photo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "urlMin" TEXT NOT NULL,
    "urlFull" TEXT NOT NULL,
    "listingId" INTEGER,
    "roomId" INTEGER,
    "position" INTEGER DEFAULT 2,
    CONSTRAINT "Photo_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Photo_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("id", "listingId", "position", "roomId", "urlFull", "urlMin") SELECT "id", "listingId", "position", "roomId", "urlFull", "urlMin" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL DEFAULT 'TOURIST',
    "isTemporary" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "vk_id" TEXT,
    "vk_token" TEXT,
    "bonusPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "telegram" TEXT,
    "avatarId" INTEGER,
    CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Photo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("bonusPoints", "createdAt", "createdByAdmin", "email", "emailVerified", "id", "isTemporary", "name", "phone", "role", "surname", "updatedAt", "vk_id", "vk_token") SELECT "bonusPoints", "createdAt", "createdByAdmin", "email", "emailVerified", "id", "isTemporary", "name", "phone", "role", "surname", "updatedAt", "vk_id", "vk_token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_vk_id_key" ON "User"("vk_id");
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
