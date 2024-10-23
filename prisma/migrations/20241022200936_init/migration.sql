-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('in', 'out');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('rent', 'food', 'entertainment', 'transportation', 'utilities', 'other');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "tx_type" "TxType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "receipt" TEXT,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
