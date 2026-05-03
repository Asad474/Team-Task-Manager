import { z } from 'zod';
import { ProjectPriority, ProjectStatus } from '../../../../database/models/Project.model';
import { mongoIdSchema } from '../../../../utils/commonValidation';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Name is required' }).min(3, 'Name must be at least 3 characters long').max(100, 'Name must be at most 100 characters long'),
    description: z.string({ error: 'Description is required' }).max(500, 'Description must be at most 500 characters long'),
    status: z.enum(ProjectStatus).optional(),
    priority: z.enum(ProjectPriority).optional(),
    members: z.array(z.string()).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
});

export const projectIdParamSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
    status: z.enum(ProjectStatus).optional(),
    priority: z.enum(ProjectPriority).optional(),
    members: z.array(mongoIdSchema).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
});

export const addMemberSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
  body: z.object({
    email: z.string().email(),
  }),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>['body'];
export type AddMemberDto = z.infer<typeof addMemberSchema>['body'];
