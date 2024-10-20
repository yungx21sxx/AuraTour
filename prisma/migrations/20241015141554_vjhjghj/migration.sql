/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `BonusTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BonusTransaction_bookingId_key" ON "BonusTransaction"("bookingId");
