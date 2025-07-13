/*
  Warnings:

  - The primary key for the `Property` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bedrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `calendarUrl` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `guests` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Property` table. All the data in the column will be lost.
  - The `id` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Inquiry` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_propertyId_fkey";

-- AlterTable
ALTER TABLE "Property" DROP CONSTRAINT "Property_pkey",
DROP COLUMN "bedrooms",
DROP COLUMN "calendarUrl",
DROP COLUMN "guests",
DROP COLUMN "location",
DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Inquiry";
