import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(255, "Subject is too long"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"], { message: "Select a priority" }),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;