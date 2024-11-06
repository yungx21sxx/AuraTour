import { defineEventHandler, getQuery } from 'h3';
import {prisma} from "~/server/service/prisma.service";
import Fuse from 'fuse.js';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { search, phone, email, isTemporary } = query;

    console.log({ search, phone, email, isTemporary })

    // Получаем всех пользователей из базы данных
    const users = await prisma.user.findMany();

    // Подготовка данных для Fuse.js
    const usersForSearch = users.map((user) => ({
        ...user,
        nameSurname: `${user.name} ${user.surname ?? ''}`.trim(),
    }));

    // Настройки для Fuse.js
    const fuseOptions: Fuse.IFuseOptions<typeof usersForSearch[0]> = {
        keys: [
            {
                name: 'nameSurname',
                weight: 0.5,
            },
            {
                name: 'email',
                weight: 0.3,
            },
            {
                name: 'phone',
                weight: 0.2,
            },
        ],
        threshold: 0.3, // Допускаем небольшие опечатки
        includeScore: true,
        shouldSort: true,
        ignoreLocation: true, // Игнорируем позицию совпадения
        isCaseSensitive: false, // Поиск без учета регистра
    };

    const fuse = new Fuse(usersForSearch, fuseOptions);

    let result = usersForSearch;

    // Собираем поисковые запросы
    const searchQueries = [];

    if (search && typeof search === 'string' && search.trim() !== '') {
        searchQueries.push(search.trim());
    }

    if (email && typeof email === 'string' && email.trim() !== '') {
        searchQueries.push(email.trim());
    }

    if (phone && typeof phone === 'string' && phone.trim() !== '') {
        searchQueries.push(phone.trim());
    }

    if (searchQueries.length > 0) {
        // Выполняем поиск по каждому запросу отдельно и объединяем результаты
        const searchResults = searchQueries.map((query) =>
            fuse.search(query).map((res) => res.item)
        );

        // Пересекаем результаты всех поисков
        result = searchResults.reduce((acc, curr) =>
            acc.filter((user) => curr.includes(user))
        );
    }

    // Фильтрация по isTemporary
    if (isTemporary !== undefined) {
        const isTemp =
            isTemporary === 'true' || isTemporary === '1' || isTemporary === 1;
        result = result.filter((user) => user.isTemporary === isTemp);
    }

    // Возвращаем отфильтрованные результаты с нужными полями
    return result.map((user) => ({
        id: user.id,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        email: user.email,
        bonusPoints: user.bonusPoints,
    }));
});