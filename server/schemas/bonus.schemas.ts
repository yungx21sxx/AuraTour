import { z } from 'zod'

export const bonusUpdateSchema = z.object({
    amount: z.number().int().positive(), // Положительное целое число
    description: z.string().min(1).max(255).optional(),
});