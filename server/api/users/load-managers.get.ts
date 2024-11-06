import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
    const managers = await prisma.user.findMany({
        where: {
            role: {
                in: ['ADMIN', 'MANAGER']
            }
        },
        select: {
            name: true,
            surname: true,
            id: true
        }
    })
    return managers.map(manager => ({
        fullName: `${manager.name} ${manager.surname || ''}`,
        id: manager.id
    }))
})