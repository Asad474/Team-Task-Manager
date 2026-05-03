import { z } from 'zod';
import { taskPriorities, taskStatuses } from '../../../../database/models/Task.model';
import { mongoIdSchema } from '../../../../utils/commonValidation';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({ error: 'Title is required' }).min(3).max(200),
    description: z.string({ error: 'Description is required' }).max(1000),
    status: z.enum(taskStatuses as [string, ...string[]]).optional(),
    priority: z.enum(taskPriorities as [string, ...string[]]).optional(),
    dueDate: z.string({ error: 'Due date is required' }).refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    projectId: mongoIdSchema,
    assignedTo: mongoIdSchema.optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(taskStatuses as [string, ...string[]]).optional(),
    priority: z.enum(taskPriorities as [string, ...string[]]).optional(),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }).optional(),
    assignedTo: mongoIdSchema.optional(),
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
});
