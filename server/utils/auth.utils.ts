import jwt from "jsonwebtoken";
import {prisma} from "~/server/service/prisma.service";

export const getUserFromToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                role: true,
                // Укажите необходимые поля
            },
        });
        return user;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw createError({ statusCode: 401, message: 'Token expired' });
        }
        throw createError({ statusCode: 401, message: 'Invalid token' });
    }
};