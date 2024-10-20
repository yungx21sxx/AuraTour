-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "createdByAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("bonusPoints", "createdAt", "createdByAdmin", "email", "id", "isTemporary", "name", "phone", "role", "surname", "updatedAt", "vk_id", "vk_token") SELECT "bonusPoints", "createdAt", "createdByAdmin", "email", "id", "isTemporary", "name", "phone", "role", "surname", "updatedAt", "vk_id", "vk_token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_vk_id_key" ON "User"("vk_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
