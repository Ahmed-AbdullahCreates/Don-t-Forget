import { z } from 'zod';

export const noteSchema = z.object({
  text: z
    .string()
    .min(1, 'Note text is required')
    .max(1000, 'Note is too long')
    .transform(text => text.trim()),
  label: z
    .string()
    .max(50, 'Label is too long')
    .transform(label => label.trim())
    .optional()
    .nullable(),
});

export type NoteInput = z.input<typeof noteSchema>;
export type NoteOutput = z.output<typeof noteSchema>;