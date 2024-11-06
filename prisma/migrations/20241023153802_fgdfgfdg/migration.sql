-- DropIndex
DROP INDEX "User_phone_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailVerificationCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailVerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmailVerificationCode" ("attempts", "code", "createdAt", "expiresAt", "id", "lastAttempt", "used", "userId") SELECT "attempts", "code", "createdAt", "expiresAt", "id", "lastAttempt", "used", "userId" FROM "EmailVerificationCode";
DROP TABLE "EmailVerificationCode";
ALTER TABLE "new_EmailVerificationCode" RENAME TO "EmailVerificationCode";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
