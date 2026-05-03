import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .optional(),
    email: z.email('Invalid email format').optional(),
  }),
});

export const getAllUsersSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>['body'];
