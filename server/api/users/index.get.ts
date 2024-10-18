import { defineEventHandler, getQuery } from 'h3';
import { prisma } from '~/server/service/prisma.service';


export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    // Параметры пагинации
    const page = parseInt(query.page as string) || 1;
    const pageSize = parseInt(query.pageSize as string) || 10;

    const user = event.context.user; // Предполагая, что пользователь хранится в контексте
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

    if (!isAdminOrManager) {
        throw createError({ statusCode: 403, message: 'Forbidden: Access is denied' });
    }

    const isTemporary =
        query.isTemporary !== undefined
            ? query.isTemporary === 'true'
            : undefined;
    const role = query.role as string | undefined;

    // Параметры сортировки
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    // Параметры поиска
    const name = query.name as string | undefined;
    const email = query.email as string | undefined;
    const phone = query.phone as string | undefined;

    // Построение условия фильтрации
    const whereClause: any = {};

    if (isTemporary !== undefined) {
        whereClause.isTemporary = isTemporary;
    }

    if (role) {
        whereClause.role = role;
    }

    if (name) {
        whereClause.name = {
            contains: name,
            mode: 'insensitive',
        };
    }

    if (email) {
        whereClause.email = {
            contains: email,
            mode: 'insensitive',
        };
    }

    if (phone) {
        whereClause.phone = {
            contains: phone,
            mode: 'insensitive',
        };
    }

    // Получение общего количества пользователей для пагинации
    const totalUsers = await prisma.user.count({
        where: whereClause,
    });

    // Получение списка пользователей
    const users = await prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: whereClause,
        orderBy: {
            createdAt: sortOrder,
        },
    });

    // Возврат результата
    return {
        data: users,
        meta: {
            total: totalUsers,
            page,
            pageSize,
            totalPages: Math.ceil(totalUsers / pageSize),
        },
    };
});
