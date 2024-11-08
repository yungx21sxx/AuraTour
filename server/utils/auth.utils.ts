import jwt from "jsonwebtoken";
import {prisma} from "~/server/service/prisma.service";

export const getUserFromToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, 'gjc8aKwxK3dWgg00XiGqgaWXCuixVb7v') as { userId: number };
        console.log(decoded)
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                surname: true,
                phone: true,
                role: true,
                bonusPoints: true,
                avatar: {
                    select: {
                        urlMin: true
                    }
                }
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

export const generateToken = (userId: number) => jwt.sign({ userId }, 'gjc8aKwxK3dWgg00XiGqgaWXCuixVb7v', { expiresIn: '21d' });
