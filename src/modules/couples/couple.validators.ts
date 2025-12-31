import { z } from 'zod';

export const requestLinkSchema = z.object({ partnerEmail: z.string().email() });
export const acceptLinkSchema = z.object({ relationshipId: z.string().min(10) });
export const relinkSchema = z.object({ partnerEmail: z.string().email() });
