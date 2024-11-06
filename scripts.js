import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
	await prisma.booking.deleteMany()
	await prisma.$disconnect();
})()
