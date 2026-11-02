import { z } from "zod";

// Same limits as the Laravel StoreTicketRequest
export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_SIZE = 3 * 1024 * 1024;
export const ALLOWED_ATTACHMENT_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const ATTACHMENT_ACCEPT = ".jpg,.jpeg,.png,.pdf";

export const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(255, "Subject is too long"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"], { message: "Select a priority" }),
  attachments: z
    .array(z.instanceof(File))
    .max(MAX_ATTACHMENTS, "You can attach up to 3 files.")
    .refine(
      (files) => files.every((file) => ALLOWED_ATTACHMENT_TYPES.includes(file.type)),
      "Each attachment must be a JPG, PNG or PDF file."
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_ATTACHMENT_SIZE),
      "Each attachment must be 3 MB or smaller."
    ),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;