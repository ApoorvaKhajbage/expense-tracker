import { z } from "zod";

export const txTypeEnum = ["in", "out"] as const;
export const categoryEnum = [
  "rent",
  "food",
  "entertainment",
  "transportation",
  "utilities",
  "other",
] as const;

export const transactionSchema = z.object({
  id: z.number().int(),
  tx_type: z.enum(txTypeEnum),
  timestamp: z.string().datetime(),
  amount: z.coerce.number(),
  receipt: z.string().url().optional(),
  description: z.string(),
  category: z.enum(categoryEnum),
});

export type Transaction = z.infer<typeof transactionSchema>;

export const transactionInputSchema = z.object({
  tx_type: z.enum(txTypeEnum),
  amount: z.coerce.number(),
  receipt: z.any().optional(),
  description: z.string(),
  category: z.enum(categoryEnum),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
