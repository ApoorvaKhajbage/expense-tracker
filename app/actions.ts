"use server";

import { PrismaClient } from "@prisma/client";
import { uploadFileToS3 } from "@/lib/utils";
import { transactionInputSchema } from "@/lib/types/transaction.schema";  // Assuming this schema validates the form data

const prisma = new PrismaClient();

// Action to add a transaction
export const addTransactionAction = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData);
    
    // Validate the data using the schema
    const vD = transactionInputSchema.safeParse(data);
    if (!vD.success) {
      console.error(vD.error);
      return { error: "Invalid data" };
    }

    const validatedData = vD.data;

    // Get the file from FormData (for receipt)
    const file = formData.get("receipt") as Blob;

    // Upload the file to S3 if provided
    let fileUrl = null;
    if (file) {
      const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedFileTypes.includes(file.type)) {
        return { error: "Invalid file type. Only JPEG, PNG, and PDF are allowed." };
      }

      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}.${file.type.split("/")[1]}`;

      fileUrl = await uploadFileToS3({
        file,
        fileName: uniqueFileName,
      });
    }

    // Create a new transaction in the database
    const newTransaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        receipt: fileUrl,
        timestamp: new Date(),
      },
    });

    return { success: true, transaction: newTransaction };
  } catch (error) {
    console.error(error);
    return { error: "Error adding transaction" };
  }
};

// Action to get all transactions
export const getAllTransactionsAction = async (dateRange: string) => {
  try {
    const today = new Date();
    let startDate;

    if (dateRange === "last_month") {
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    } else {
      // Handle additional ranges or a default case here
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Example for current month
    }

    const transactions = await prisma.transaction.findMany({
      where: { timestamp: { gte: startDate } },
      orderBy: { timestamp: "desc" },
    });

    return transactions.length ? transactions : { error: "No transactions found." };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { error: "Error fetching transactions." };
  }
};

// Action to delete a transaction
export const deleteTransactionAction = async (transactionId: number) => {
  try {
    // Delete the transaction
    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { error: "Error deleting transaction" };
  }
};
