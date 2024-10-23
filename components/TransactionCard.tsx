import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";

interface Transaction {
  id: number;
  receipt?: string;
  description: string;
  category: string;
  tx_type: "in" | "out";
  amount: number;
  timestamp: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (id: number) => void;
}

// Helper function to format date consistently
const formatDate = (timestamp: string) => {
  try {
    const date = new Date(timestamp + "Z");
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return "Invalid Date";
  }
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onDelete,
}) => {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait for client-side mount before showing any date
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show formatted date after component is mounted
  const displayDate = mounted ? formatDate(transaction.timestamp) : '';

  return (
    <>
      {/* Card Details Dialog */}
      <AlertDialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
        <AlertDialogTrigger asChild>
          <Card
            key={transaction.id}
            className="relative border border-gray-200 rounded-lg shadow-md cursor-pointer w-full max-w-sm mx-auto"
            onClick={() => setOpenImageDialog(true)}
          >
            <CardHeader className="flex relative">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-red-500 p-1 rounded-full shadow hover:text-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDeleteDialog(true);
                  }}
                >
                  <AiOutlineDelete className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-10 flex flex-col items-center">
                <Image
                  src={transaction.receipt || "/placeholder.png"}
                  alt="Receipt"
                  width={480}
                  height={288}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <CardTitle className="text-lg font-semibold mt-2">
                  {transaction.description}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Category: {transaction.category}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-2">
                <div
                  className={`text-md ${
                    transaction.tx_type === "in"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.tx_type === "in" ? "Credit" : "Debit"}
                </div>
                <div
                  className={`text-lg font-bold ${
                    transaction.tx_type === "in"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Rs.{transaction.amount}
                </div>
              </div>
            </CardContent>
          </Card>
        </AlertDialogTrigger>

        {/* Image Dialog Content */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-center space-x-2">
              <span className="text-md text-gray-400">
                {mounted ? displayDate : 'Loading...'}
              </span>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">
            <div className="flex flex-col items-center">
              <Image
                src={transaction.receipt || "/placeholder.png"}
                alt="Receipt"
                width={800}
                height={600}
                className="max-w-full max-h-[40vh] object-contain my-4"
                layout="responsive"
              />
              <div className="w-full flex justify-between items-center mb-2">
                <div className="text-lg font-semibold">
                  {transaction.description}
                </div>
                <div
                  className={`text-lg font-bold ${
                    transaction.tx_type === "in"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Rs.{transaction.amount}
                </div>
              </div>
              <div className="w-full flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">
                  Category: {transaction.category}
                </div>
                <div
                  className={`text-sm font-medium ${
                    transaction.tx_type === "in"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.tx_type === "in" ? "Credit" : "Debit"}
                </div>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenImageDialog(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Do you really want to delete this
              transaction?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="text-red-500 bg-transparent border border-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => {
                onDelete(transaction.id);
                setOpenDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionCard;