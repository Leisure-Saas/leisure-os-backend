/*
  Warnings:

  - The primary key for the `Property` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Property` table. All the data in the column will be lost.
  - Added the required column `basePricePerNight` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bathrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxGuests` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP CONSTRAINT "Property_pkey",
DROP COLUMN "imageUrl",
DROP COLUMN "price",
DROP COLUMN "title",
ADD COLUMN     "basePricePerNight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bathrooms" INTEGER NOT NULL,
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "maxGuests" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Property_id_seq";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "numberOfGuests" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
