"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TransactionInput,
  transactionInputSchema,
} from "@/lib/types/transaction.schema";
import { addTransactionAction } from "@/app/actions"; // Ensure this is implemented for Prisma

export default function InputForm() {
  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionInputSchema),
    defaultValues: {
      amount: 0,
      description: "",
      tx_type: "in", // Default to 'in'
      category: undefined, // Default to undefined
    },
  });

  async function onSubmit(values: TransactionInput) {
    try {
      const formData = new FormData();
      formData.append("amount", values.amount.toString());
      formData.append("description", values.description);
      formData.append("tx_type", values.tx_type);
      formData.append("category", values.category);
      formData.append("receipt", values.receipt as Blob);

      // Call the action to handle the transaction submission
      const response = await addTransactionAction(formData);

      if (response && response.error) {
        console.error(response.error);
        return;
      }

      console.log("Transaction added successfully");
      // Reset the form fields
      form.reset();
    } catch (error: unknown) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col w-full">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-4"
        >
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transaction Type */}
          <FormField
            control={form.control}
            name="tx_type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Transaction Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <RadioGroupItem value="in" />
                      </FormControl>
                      <FormLabel className="font-normal">Credit</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <RadioGroupItem value="out" />
                      </FormControl>
                      <FormLabel className="font-normal">Debit</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Receipt */}
          <FormField
            control={form.control}
            name="receipt"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Receipt</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
