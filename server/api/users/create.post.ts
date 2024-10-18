import { prisma } from '~/server/service/prisma.service';
import {userCreateSchema} from "~/server/schemas/user.schemas";
import {z} from "zod";


export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const userCreateData = userCreateSchema.parse(body);
        const user = event.context.user; // Предполагая, что пользователь хранится в контексте
        const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

        if (!isAdminOrManager) {
            throw createError({ statusCode: 403, message: 'Forbidden: Access is denied' });
        }

        if (user.role === 'MANAGER'
            && (userCreateData.role === 'ADMIN' || userCreateData.role === 'MANAGER')
        ) {
            throw createError({ statusCode: 403, message: 'Вы не можете назначать менеджеров или администраторов.' });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: userCreateData.email },
                    { phone: userCreateData.phone },
                ],
            },
        });

        if (existingUser) {
            throw createError({
                statusCode: 400,
                message: 'Пользователь с таким email или номером телефона уже существует',
            });
        }

        const createdUser = await prisma.user.create({
            data: {...userCreateData, createdByAdmin: true},
        })

        return {
            status: "success",
            data: createdUser
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.errors.map((e) => e.message),
            };
        } else {
            return {
                success: false,
                message: error.message || 'Произошла ошибка',
            };
        }
    }
})