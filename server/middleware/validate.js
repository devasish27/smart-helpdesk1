import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(['draft','published']).optional().default('draft'),
});

export function validateBody(schema){
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (e) {
      return res.status(400).json({ error: 'Validation failed', details: e.errors });
    }
  }
}