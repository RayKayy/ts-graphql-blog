/*
  Warnings:

  - Made the column `name` on table `User` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
