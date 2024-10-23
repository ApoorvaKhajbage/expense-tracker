"use client";
import React, { useEffect, useState } from "react";
import InputForm from "@/components/InputForm";
import TransactionCard from "@/components/TransactionCard";
import { getAllTransactionsAction, deleteTransactionAction } from "@/app/actions";
import { Transaction } from "@/lib/types/transaction.schema";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [netBalance, setNetBalance] = useState(0);

  // Fetch transactions initially
  useEffect(() => {
    async function fetchTransactions() {
      const data = await getAllTransactionsAction("last_month"); // Example date range

      if (Array.isArray(data)) {
        setTransactions(data);
        calculateNetBalance(data); // Calculate the net balance
      } else if (data && "error" in data) {
        console.error(data.error);
      } else {
        console.error("Error fetching transactions");
      }
    }

    fetchTransactions();
  }, []);

  // Function to calculate net balance based on transactions
  const calculateNetBalance = (transactions: Transaction[]) => {
    const balance = transactions.reduce((acc, transaction) => {
      return transaction.tx_type === "in" ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
    setNetBalance(balance);
  };

  const handleDelete = async (transactionId: number) => {
    try {
      const result = await deleteTransactionAction(transactionId);
      if (result.success) {
        setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
        calculateNetBalance(transactions.filter((t) => t.id !== transactionId));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Determine the color based on the net balance
  const balanceClass = netBalance >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="flex w-full min-h-screen"> {/* Removed sidebar */}
      <div className="p-8 flex w-full min-h-screen dark:bg-gray-900"> {/* Adjusted layout */}
        {/* Form on the left side */}
        <div className="w-1/3 p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Add an expense</h2>
          <InputForm />
        </div>

        {/* Transactions on the right side */}
        <div className="w-2/3 ml-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Transactions</h2>
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow">
              <p className="text-sm">Net Balance</p>
              <p className={`text-2xl font-semibold ${balanceClass}`}>
                Rs.{netBalance}
              </p>
            </div>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id.toString()}
                transaction={transaction}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
