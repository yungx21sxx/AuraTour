-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "urlMin" TEXT NOT NULL,
    "urlFull" TEXT NOT NULL,
    "listingId" INTEGER,
    "roomId" INTEGER,
    CONSTRAINT "Photo_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Photo_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("id", "listingId", "roomId", "urlFull", "urlMin") SELECT "id", "listingId", "roomId", "urlFull", "urlMin" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
CREATE TABLE "new_Coords" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "longitude" REAL NOT NULL,
    "width" REAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    CONSTRAINT "Coords_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Coords" ("id", "listingId", "longitude", "width") SELECT "id", "listingId", "longitude", "width" FROM "Coords";
DROP TABLE "Coords";
ALTER TABLE "new_Coords" RENAME TO "Coords";
CREATE UNIQUE INDEX "Coords_listingId_key" ON "Coords"("listingId");
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comment" TEXT,
    "rating" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "userId" INTEGER,
    "userName" TEXT,
    "userFrom" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("comment", "createdAt", "id", "listingId", "rating", "userFrom", "userId", "userName") SELECT "comment", "createdAt", "id", "listingId", "rating", "userFrom", "userId", "userName" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE TABLE "new_RoomAmenity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "RoomAmenity_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RoomAmenity" ("id", "name", "roomId") SELECT "id", "name", "roomId" FROM "RoomAmenity";
DROP TABLE "RoomAmenity";
ALTER TABLE "new_RoomAmenity" RENAME TO "RoomAmenity";
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
    "totalPrice" INTEGER,
    "prepay" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("adults", "childrens", "comment", "createdAt", "endDate", "id", "listingId", "name", "phone", "prepay", "roomId", "startDate", "surname", "totalPrice", "transfer", "transferComment", "userId") SELECT "adults", "childrens", "comment", "createdAt", "endDate", "id", "listingId", "name", "phone", "prepay", "roomId", "startDate", "surname", "totalPrice", "transfer", "transferComment", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_ListingAmenity" (
    "listingId" INTEGER NOT NULL,
    "amenityId" INTEGER NOT NULL,

    PRIMARY KEY ("listingId", "amenityId"),
    CONSTRAINT "ListingAmenity_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListingAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ListingAmenity" ("amenityId", "listingId") SELECT "amenityId", "listingId" FROM "ListingAmenity";
DROP TABLE "ListingAmenity";
ALTER TABLE "new_ListingAmenity" RENAME TO "ListingAmenity";
CREATE TABLE "new_ListingFood" (
    "listingId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,

    PRIMARY KEY ("listingId", "foodId"),
    CONSTRAINT "ListingFood_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListingFood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ListingFood" ("foodId", "listingId") SELECT "foodId", "listingId" FROM "ListingFood";
DROP TABLE "ListingFood";
ALTER TABLE "new_ListingFood" RENAME TO "ListingFood";
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "places" INTEGER NOT NULL,
    "area" INTEGER NOT NULL,
    "badCount" INTEGER NOT NULL DEFAULT 1,
    "minPrice" INTEGER NOT NULL,
    CONSTRAINT "Room_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("area", "badCount", "id", "listingId", "minPrice", "name", "places") SELECT "area", "badCount", "id", "listingId", "minPrice", "name", "places" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE TABLE "new_PricePeriod" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "listingId" INTEGER,
    "roomId" INTEGER,
    CONSTRAINT "PricePeriod_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PricePeriod_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PricePeriod" ("endDate", "id", "listingId", "price", "roomId", "startDate") SELECT "endDate", "id", "listingId", "price", "roomId", "startDate" FROM "PricePeriod";
DROP TABLE "PricePeriod";
ALTER TABLE "new_PricePeriod" RENAME TO "PricePeriod";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
