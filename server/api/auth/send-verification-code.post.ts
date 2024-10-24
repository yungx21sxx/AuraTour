import {H3Event} from "h3";
import {loginSchema} from "~/server/schemas/auth.schemas";
import {prisma} from "~/server/service/prisma.service";
import {generateVerificationCode, sendEmailVerificationCode} from "~/server/utils/mail.utils";


export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody(event);
    const { email} = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw createError({ statusCode: 404, message: 'Пользователь не найден' });
    }

    const code = await generateVerificationCode(user.id);

    try {
        await sendEmailVerificationCode(email, code);
    } catch (mailError) {
        await prisma.emailVerificationCode.deleteMany({ where: { userId: user.id } });
        throw createError({ statusCode: 500, message: 'Не удалось отправить код подтверждения. Попробуйте позже.' });
    }

    return { email: user.email };
})