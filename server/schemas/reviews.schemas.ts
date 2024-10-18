import {z} from "zod";

export const reviewSchema = z.object({
    text: z.string().min(1, 'Текст отзыва не может быть пустым'),
    rating: z.number().min(1).max(5),
    userName: z.string().optional(),
    listingCheckIn: z.coerce.date(),
    listingCheckOut: z.coerce.date(),
    createdAt: z.coerce.date().optional(),
    listingId: z.number({
        message: 'Listing Id required'
    }),
});