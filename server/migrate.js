import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Функция для преобразования HTML TipTap в чистый текст
function convertTipTapToPlainText(html) {
	if (!html) return ''
	
	// Заменяем HTML-сущности
	let text = html.replace(/&nbsp;/g, ' ')
	
	// Заменяем блочные элементы на переносы строки
	text = text.replace(/<\/p>/gi, '\n')
	text = text.replace(/<\/div>/gi, '\n')
	
	// Заменяем <br> на переносы
	text = text.replace(/<br\s*\/?>/gi, '\n')
	
	// Удаляем все HTML-теги
	text = text.replace(/<[^>]+>/g, '')
	
	// Обрабатываем множественные пробелы и переносы
	text = text
		.split('\n')
		.map(line =>
			line.trim()
				.replace(/\s\s+/g, ' ') // Схлопываем множественные пробелы
		)
		.filter(line => line.length > 0) // Удаляем пустые строки
		.join('\n')
	
	return text.trim()
}
async function processDescriptions() {
	const batchSize = 100
	let cursor = 0
	
	while (true) {
		const listings = await prisma.listing.findMany({
			take: batchSize,
			skip: cursor > 0 ? 1 : 0,
			cursor: cursor > 0 ? { id: cursor } : undefined,
			select: { id: true, description: true, note: true },
			orderBy: { id: 'asc' },
		})
		
		if (listings.length === 0) break
		
		cursor = listings[listings.length - 1].id
		
		await prisma.$transaction(
			listings.map(listing =>
				prisma.listing.update({
					where: { id: listing.id },
					data: {
						description: convertTipTapToPlainText(listing.description),
						// note: convertTipTapToPlainText(listing.note)
					},
				})
			)
		)
		
		console.log(`Processed ${listings.length} listings`)
	}
}

const seoPages = [
	{
		title: 'Гудаута: жилье у моря 2025 — бронирование с трансфером и экскурсиями',
		description: 'Проверенные гостевые дома и квартиры в 5 минутах от пляжа. Организуем трансфер, помощь в подборе жилья. Цены от 1000₽/сутки. Гарантия безопасного бронирования!',
		path: '/search/city/gudauta',
		photoUrl: '/seo/gudauta.webp',
		priority: 0.8,
		changefreq: 'weekly',
		isIndexable: true,
		smallTitle: 'Жилье в Гудауте посуточно',
		cityId: 14,
		listingTypeId: null,
		lastModified: new Date().toISOString()
	},
	{
		title: 'Отдых в Алахадзы 2025: гостевые дома, коттеджи, отели',
		description: 'Гостевые дома, отели, коттеджи в шаге от моря в Алахадзы. Организуем трансферы из Адлера/Сочи и персональные экскурсии. Лучшие цены от 1 000₽/сутки — гарантия качества и поддержка 24/7!',
		path: '/search/city/alahadzy',
		photoUrl: '/seo/alahadzy.webp',
		priority: 0.8,
		changefreq: 'weekly',
		isIndexable: true,
		smallTitle: 'Жилье в Алахадзы посуточно',
		cityId: 1,
		listingTypeId: null,
		lastModified: new Date().toISOString()
	},
	{
		title: 'Гагра: жилье посуточно у моря — бронирование с трансфером',
		description: 'Квартиры посуточно, отели, гостевые дома, коттеджи в шаге от моря в Гагре. Трансфер из Адлера/Сочи и персональные экскурсии. Лучшие цены от 1 000₽/сутки — гарантия качества и поддержка 24/7!',
		path: '/search/city/gagra',
		photoUrl: '/seo/gagra.webp',
		priority: 0.8,
		changefreq: 'weekly',
		isIndexable: true,
		smallTitle: 'Жилье в Гагре посуточно',
		cityId: 4,
		listingTypeId: null,
		lastModified: new Date().toISOString()
	},
	{
		title: 'Квартиры в Сухуми посуточно 2025',
		description: 'Большой выбор проверенных квартир в центре Сухуми. Организуем трансферы из Адлера/Сочи и персональные экскурсии. Лучшие цены от 1 000₽/сутки — гарантия качества и поддержка 24/7!',
		path: '/search/city/suhum',
		photoUrl: '/seo/suhum.webp',
		priority: 0.8,
		changefreq: 'weekly',
		isIndexable: true,
		smallTitle: 'Жилье в Сухуми посуточно',
		cityId: 35,
		listingTypeId: null,
		lastModified: new Date().toISOString()
	},
	{
		title: 'Жилье в Новом Афоне у моря — бронирование через личного помощника с трансфером и экскурсиями',
		description: 'Персональный подбор квартир, гостевых домов, отелей и коттеджей в шаге от моря в Новом Афоне. Организуем трансферы из Адлера/Сочи и персональные экскурсии. Лучшие цены от 1 000₽/сутки — гарантия качества и поддержка 24/7!',
		path: '/search/city/novyy-afon',
		photoUrl: '/seo/afon.webp',
		priority: 0.8,
		changefreq: 'weekly',
		isIndexable: true,
		smallTitle: 'Жилье в Новом Афоне посуточно',
		cityId: 21,
		listingTypeId: null,
		lastModified: new Date().toISOString()
	},
	{
		title: 'Жилье в Пицунде у моря 2025',
		description: 'Квартиры посучно, гостевые дома, отели и коттеджей в шаге от моря в Пицунде. Организуем трансферы из Адлера/Сочи и персональные экскурсии. Лучшие цены от 2 000₽/сутки — гарантия качества и поддержка 24/7!',
		path: '/search/city/picunda',
		photoUrl: '/seo/picunda.png',
		priority: 0.8,
		changefreq: 'weekly',
		isIndexable: true,
		smallTitle: 'Жилье в Пицунде посуточно',
		cityId: 8,
		listingTypeId: null,
		lastModified: new Date().toISOString()
	},
	{
		title: "Квартиры в Абхазии посуточно — бронирование с трансфером и экскурсиями",
		description: "Персональный подбор квартир у моря 2025. Организуем трансферы из Адлера/Сочи и экскурсии. Лучшие цены от 1 500₽/сутки — гарантия качества и поддержка 24/7!",
		path: "/search/type/flat",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Квартиры в Абхазии посуточно",
		cityId: null,
		listingTypeId: 1,
		lastModified: new Date().toISOString()
	},
	{
		title: "Гостевые дома в Абхазии у моря — лучшие цены 2025",
		description: "Подбор гостевых домов в 100 м от моря. Трансферы из Сочи, персональные. Цены от 1 000₽/сутки. Без посредников — прямой контакт с владельцами!",
		path: "/search/type/guest-house",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Гостевые дома в Абхазии",
		cityId: null,
		listingTypeId: 2,
		lastModified: new Date().toISOString()
	},
	{
		title: "Коттеджи в Абхазии посуточно — отдых для компаний с трансфером",
		description: "Аренда коттеджей у моря с бассейнами и мангальными зонами. Организуем трансфер для групп до 10 человек. Цены от 3 000₽/сутки. Гарантия лучшего предложения!",
		path: "/search/type/cottages",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Коттеджи в Абхазии",
		cityId: null,
		listingTypeId: 3,
		lastModified: new Date().toISOString()
	},
	{
		title: "Дома в Абхазии под ключ — аренда с экскурсиями и трансфером",
		description: "Полностью оборудованные дома для семейного отдыха. Подбор по локации у моря или в горах. Трансфер из Адлера, помощь с экскурсиями. От 2 500₽/сутки",
		path: "/search/type/house",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "monthly",
		isIndexable: true,
		smallTitle: "Дома в Абхазии",
		cityId: null,
		listingTypeId: 4,
		lastModified: new Date().toISOString()
	},
	{
		title: "Отели в Абхазии у моря — бронирование 2025 с трансфером",
		description: "Лучшие гостиницы и отели 3-4* с питанием и бассейнами. Организуем трансфер из Сочи/Адлера. Цены от 3 000₽/сутки. Прямые контракты с отельерами!",
		path: "/search/type/hotels",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Отели в Абхазии",
		cityId: null,
		listingTypeId: 8,
		lastModified: new Date().toISOString()
	},
	{
		title: "Квартиры в Гудауте у моря — посуточная аренда 2025",
		description: "Снимите уютную квартиру в Гудауте у моря. Персональный подбор, трансферы и экскурсии. Цены от 1 500₽/сутки!",
		path: "/search/city/gudauta/flat",
		photoUrl: "/seo/gudauta.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Квартиры в Гудауте",
		cityId: 14,
		listingTypeId: 1,
		lastModified: new Date().toISOString()
	},
	{
		title: "Гостевые дома в Гудауте — бронирование без посредников",
		description: "Тихий отдых у моря в Гудауте! Подберём гостевой дом, организуем трансфер и экскурсии. Цены от 1 000₽/сутки.",
		path: "/search/city/gudauta/guest-house",
		photoUrl: "/seo/gudauta.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Гостевые дома в Гудауте",
		cityId: 14,
		listingTypeId: 2,
		lastModified: new Date().toISOString()
	},
	{
		title: "Коттеджи в Гудауте с мангалами и бассейном — аренда 2025",
		description: "Снимите коттедж в Гудауте у моря. Просторные дома с террасами, трансферы и экскурсии. Цены от 3 000₽/сутки.",
		path: "/search/city/gudauta/cottages",
		photoUrl: "/seo/gudauta.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Коттеджи в Гудауте",
		cityId: 14,
		listingTypeId: 3,
		lastModified: new Date().toISOString()
	},
	{
		title: "Дома под ключ в Гудауте у моря — аренда с трансфером",
		description: "Полностью оборудованные дома для отдыха в Гудауте. Лучшие цены, трансфер и экскурсии. От 2 500₽/сутки.",
		path: "/search/city/gudauta/house",
		photoUrl: "/seo/gudauta.webp",
		priority: 0.8,
		changefreq: "monthly",
		isIndexable: true,
		smallTitle: "Дома в Гудауте",
		cityId: 14,
		listingTypeId: 4,
		lastModified: new Date().toISOString()
	},
	{
		title: "Отели в Гудауте у моря — бронирование 2025",
		description: "Гостиницы и отели 3-4* в Гудауте. Трансферы, питание, бассейны. Цены от 4 500₽/сутки. Гарантия лучшей цены!",
		path: "/search/city/gudauta/hotels",
		photoUrl: "/seo/gudauta.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Отели в Гудауте",
		cityId: 14,
		listingTypeId: 8,
		lastModified: new Date().toISOString()
	},
	{
		title: "Квартиры в Гагре у моря — посуточная аренда 2025",
		description: "Снимите квартиру в Гагре у моря. Персональный подбор, трансферы и экскурсии. Цены от 1 500₽/сутки!",
		path: "/search/city/gagra/flat",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Квартиры в Гагре",
		cityId: 4,
		listingTypeId: 1,
		lastModified: new Date().toISOString()
	},
	{
		title: "Гостевые дома в Гагре — отдых у моря без посредников",
		description: "Тихий отдых в Гагре! Подберём гостевой дом, организуем трансфер и экскурсии. Цены от 1 000₽/сутки.",
		path: "/search/city/gagra/guest-house",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Гостевые дома в Гагре",
		cityId: 4,
		listingTypeId: 2,
		lastModified: new Date().toISOString()
	},
	{
		title: "Коттеджи в Гагре с мангалами и бассейном — аренда 2025",
		description: "Снимите коттедж в Гагре у моря. Просторные дома с террасами, трансферы и экскурсии. Цены от 3 000₽/сутки.",
		path: "/search/city/gagra/cottages",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Коттеджи в Гагре",
		cityId: 4,
		listingTypeId: 3,
		lastModified: new Date().toISOString()
	},
	{
		title: "Дома под ключ в Гагре у моря — аренда с трансфером",
		description: "Полностью оборудованные дома для отдыха в Гагре. Лучшие цены, трансфер и экскурсии. От 2 500₽/сутки.",
		path: "/search/city/gagra/house",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "monthly",
		isIndexable: true,
		smallTitle: "Дома в Гагре",
		cityId: 4,
		listingTypeId: 4,
		lastModified: new Date().toISOString()
	},
	{
		title: "Отели в Гагре у моря — бронирование 2025",
		description: "Гостиницы и отели 3-4* в Гагре. Трансферы, питание, бассейны. Цены от 4 500₽/сутки. Гарантия лучшей цены!",
		path: "/search/city/gagra/hotels",
		photoUrl: "/seo/gagra.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Отели в Гагре",
		cityId: 4,
		listingTypeId: 8,
		lastModified: new Date().toISOString()
	},
	{
		title: "Квартиры в Сухуме у моря — посуточная аренда 2025",
		description: "Снимите уютную квартиру в Сухуме у моря. Персональный подбор жилья, трансферы и экскурсии. Цены от 1 500₽/сутки!",
		path: "/search/city/suhum/flat",
		photoUrl: "/seo/suhum.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Квартиры в Сухуме",
		cityId: 1,
		listingTypeId: 1,
		lastModified: new Date().toISOString()
	},
	{
		title: "Гостевые дома в Сухуме — бронирование без посредников",
		description: "Тихий отдых у моря в Сухуме! Подберём гостевой дом, организуем трансфер и экскурсии. Цены от 1 000₽/сутки.",
		path: "/search/city/suhum/guest-house",
		photoUrl: "/seo/suhum.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Гостевые дома в Сухуме",
		cityId: 1,
		listingTypeId: 2,
		lastModified: new Date().toISOString()
	},
	{
		title: "Коттеджи в Сухуме с мангалами и бассейном — аренда 2025",
		description: "Снимите коттедж в Сухуме у моря. Просторные дома с террасами, трансферы и экскурсии. Цены от 3 000₽/сутки.",
		path: "/search/city/suhum/cottages",
		photoUrl: "/seo/suhum.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Коттеджи в Сухуме",
		cityId: 1,
		listingTypeId: 3,
		lastModified: new Date().toISOString()
	},
	{
		title: "Дома в Сухуме у моря — аренда с трансфером",
		description: "Полностью оборудованные дома для отдыха в Сухуме. Лучшие цены, трансфер и экскурсии. От 2 500₽/сутки.",
		path: "/search/city/suhum/house",
		photoUrl: "/seo/suhum.webp",
		priority: 0.8,
		changefreq: "monthly",
		isIndexable: true,
		smallTitle: "Дома в Сухуме",
		cityId: 1,
		listingTypeId: 4,
		lastModified: new Date().toISOString()
	},
	{
		title: "Отели в Сухуме у моря — бронирование 2025",
		description: "Гостиницы и отели в Сухуме. Трансферы, питание, бассейны. Цены от 2 500₽/сутки. Гарантия лучшей цены!",
		path: "/search/city/suhum/hotels",
		photoUrl: "/seo/suhum.webp",
		priority: 0.8,
		changefreq: "weekly",
		isIndexable: true,
		smallTitle: "Отели в Сухуме",
		cityId: 1,
		listingTypeId: 8,
		lastModified: new Date().toISOString()
	}
]


async function saveSeoPages(seoPages) {
	for (const seoPage of seoPages) {
		await prisma.seoPage.create({
			data: seoPage
		});
	}
}

async function main() {
	await processDescriptions()
	// await prisma.seoPage.deleteMany();
	// await saveSeoPages(seoPages);
}

main()
	.catch(e => {
		console.error('Error:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})