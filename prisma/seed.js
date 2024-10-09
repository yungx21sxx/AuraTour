import { PrismaClient } from '@prisma/client'
import {faker} from "@faker-js/faker";
const prisma = new PrismaClient()

function generatePricePeriodsForYear(year) {
    const pricePeriods = [];
    let minPrice = Infinity;

    for (let month = 0; month < 12; month++) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0); // Получаем последний день месяца

        // Логика для определения цены
        const price = calculatePriceForMonth(month);


        if (price < minPrice) {
            minPrice = price;
        }

        pricePeriods.push({
            startDate,
            endDate,
            price,
        });
    }

    return pricePeriods;
}

function calculatePriceForMonth(month) {
    // Здесь должна быть ваша логика для определения цены в зависимости от месяца
    if (month >= 5 && month <= 8) { // Летние месяцы
        return parseInt(faker.commerce.price({ min: 15000, max: 40000, dec: 0 })); // Высокая цена
    } else {
        return parseInt(faker.commerce.price({ min: 1500, max: 10000, dec: 0 })); // Низкая цена
    }
}


const housingTypes = [
    {
        label: 'Квартиры',
        value: 'flat',
        count: 0,
    },
    {
        label: 'Гостевые дома',
        value: 'guest-house',
        count: 0,
    },
    {
        label: 'Коттеджи',
        value: 'cottages',
        count: 0,
    },
    {
        label: 'Дома под ключ',
        value: 'house',
        count: 0,
    },
];


const amenityTypes = [
    {
        label: 'Бесплатный Wi-Fi',
        value: 'wi-fi',
        count: 0,
    },
    {
        label: 'Спутниковое ТВ',
        value: 'tv',
        count: 0,
    },
    {
        label: 'Гладильная, утюг',
        value: 'iron',
        count: 0,
    },
    {
        label: 'Чайник',
        value: 'tea',
        count: 0,
    },
];

const foodTypes = [
    {
        label: 'Кухня',
        value: 'kitchen',
        count: 0,
    },
    {
        label: 'Кафе/Ресторан',
        value: 'restaurant',
        count: 0,
    },
    {
        label: 'Завтрак влкючен',
        value: 'breakfast',
        count: 0,
    },
    {
        label: '3-x раз. питание',
        value: 'all-inclusive',
        count: 0,
    },
];

const abkhaziaRegions = [
    {
        region: "Гагринский район",
        cities: ["Алахадзы", "Багрипш", "Бзыпта", "Гагра", "Гечрипш", "Гребешок", "Лдзаа (Лидзава)", "Пицунда", "Псахара", "Цандрипш"]
    },
    {
        region: "Гудаутский район",
        cities: ["Аацы", "Амжикухуа", "Арсаул (Приморское)", "Гудаута", "Дурипш", "Куланырхуа", "Лыхны", "Мгудзырхуа", "Мцара", "Мысра", "Новый Афон", "Псырдзха", "Хыпста"]
    },
    {
        region: "Гулрыпшский район",
        cities: ["Агудзера", "Багмаран", "Гулрыпш", "Дранда", "Мачара"]
    },
    {
        region: "Очамчирский район",
        cities: ["Очамчыра", "Гал", "Ткуарчал", "Ампара", "Адзюбжа", "Члу"]
    },
    {
        region: "Сухумский район",
        cities: ["Сухум", "Эшера"]
    },
];
function getRandomInt(min, max) {
    // Округление до ближайшего меньшего целого числа для минимума
    min = Math.ceil(min);
    // Округление до ближайшего большего целого числа для максимума
    max = Math.floor(max);
    // Генерация случайного числа в заданном диапазоне (включая min, но не включая max)
    return Math.floor(Math.random() * (max - min) + min);
}


const changeData = (type) => type.map(i => ({name: i.label, value: i.value}))


async function seed() {
    console.log(`Start seeding ...`)

    await prisma.admin.create({
        data: {
            login: 'Admin6754342',
            passwordHash: '$2b$10$K1PFoVQliCorWYIkAn9IVe3oz50rI4b3oFs8QEA4H6O7CEKQbCWCq'
        }
    })

    const regionsCreated = [];
    let citiesCreated = [];
    let minAndMaxCityId = [];


    const listingTypes = [];

    for (const amenity of changeData(amenityTypes)) {
        const amenityType = await prisma.amenity.create({
            data: amenity
        })

    }

    for (const food of changeData(foodTypes)) {
        const foodType = await prisma.food.create({data: food})

    }
    for (const type of changeData(housingTypes)) {
        const listingType = await prisma.listingType.create({data: type})
        listingTypes.push(listingType)
    }

    for (const region of abkhaziaRegions) {
        const {region: name, cities } = region
        const regionCreated = await prisma.region.create({
            data: {
                name,
                cities: {
                    create: cities.map(i => ({name: i}))
                }
            }
        })
        citiesCreated = await prisma.city.findMany()
        regionsCreated.push(regionCreated);
        minAndMaxCityId = [citiesCreated[0].id, citiesCreated[citiesCreated.length - 1].id]
    }

    for (let i = 0; i < 1000; i++) {

        let photos = [];
        for (let j = 0; j < 10; j++) {
            const img = faker.image.url()
            photos.push({
                urlMin: img,
                urlFull: img,
            })
        }

        const pricePeriods = generatePricePeriodsForYear(2024);
        const minPrice = Math.min.apply(null, pricePeriods.map(i => i.price));
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        const typeId = getRandomInt(1, 5);

        const roomsPricePeriods = generatePricePeriodsForYear(2024);
        const minRoomPrice = Math.min.apply(null, roomsPricePeriods.map(i => i.price));

        const rooms = [
            {
                name: 'Cтандартный',
                minPrice: minRoomPrice,
                badCount: 1,
                pricePeriods: {
                    create: roomsPricePeriods.map(i => ({
                        price: i.price,
                        startDate: i.startDate,
                        endDate: i.endDate
                    }))
                },
                photos: {
                    create: photos
                },
                area: 20,
                amenities: ['wi-fi', 'Терраса', 'Микроволновка', 'Чайник', 'Уборка', 'Смена белья'],
                places: 2,
            },
            {
                name: 'Люкс',
                minPrice: minRoomPrice + 5000,
                badCount: 2,
                pricePeriods: {
                    create: roomsPricePeriods.map(i => ({
                        price: i.price + 5000,
                        startDate: i.startDate,
                        endDate: i.endDate
                    }))
                },
                photos: {
                    create: photos
                },
                area: 50,
                amenities: ['wi-fi', 'Терраса', 'Микроволновка', 'Чайник', 'Уборка', 'Смена белья'],
                places: 3,
            },
            {
                name: 'Президенский Люкс',
                minPrice: minRoomPrice + 10000,
                badCount: 3,
                pricePeriods: {
                    create: roomsPricePeriods.map(i => ({
                        price: i.price + 10000,
                        startDate: i.startDate,
                        endDate: i.endDate
                    }))
                },
                photos: {
                    create: photos
                },
                area: 100,
                amenities: ['wi-fi', 'Терраса', 'Микроволновка', 'Чайник', 'Уборка', 'Смена белья'],
                places: 6,
            },

        ]

        let data = {
            title: faker.commerce.productName(),
            description: faker.lorem.lines(4),

            city:{
                connect: {
                    id: getRandomInt(minAndMaxCityId[0], minAndMaxCityId[1] + 1),
                }
            } ,
            type: {
                connect: {
                    id : typeId
                }
            },
            photos: {
                create: photos
            },
            coords: {
                create: {
                    width: 43.279124,
                    longitude: 40.26771
                }
            },
            places: getRandomInt(2, 7),
            address: faker.location.streetAddress(false),
            seaDistance: getRandomInt(50, 1500),
            phoneRaw: '79288514084',
            phone: '+7 (928) 851-40-84',
            renterName: 'Сергей'
        }

        if (typeId !== 2) {
            data.area = getRandomInt(30, 100);
            data.pricePeriods = {
                create: pricePeriods
            }
            data.badCount = getRandomInt(1,5)
            data.minPrice = minPrice
        } else {
            data.minPrice = minRoomPrice
            data.rooms = {
                create: rooms.map(room => {
                    const {amenities, ...roomData} = room
                    return {
                        ...roomData,
                        amenities: {
                            create: amenities.map(i => ({name: i}))
                        }
                    }
                })
            }
        }



        const listing = await prisma.listing.create({
            data
        })


        const allAmenities = await prisma.amenity.findMany();
        // Генерируем случайное количество удобств для добавления
        const amenitiesCount = Math.floor(Math.random() * allAmenities.length) + 1; // Гарантируем, что выберется хотя бы одно удобство
        // Выбираем случайные удобства из доступных
        const randomAmenities = allAmenities.sort(() => 0.5 - Math.random()).slice(0, amenitiesCount);
        // Для каждого выбранного удобства создаем запись в промежуточной таблице

        for (const amenity of randomAmenities) {
            await prisma.listingAmenity.create({
                data: {
                    listingId: listing.id,
                    amenityId: amenity.id,
                },
            });
        }

        const allFoods = await prisma.food.findMany();

        // Генерируем случайное количество продуктов питания для добавления
        const foodsCount = Math.floor(Math.random() * allFoods.length) + 1; // Гарантируем, что выберется хотя бы один продукт

        // Выбираем случайные продукты питания из доступных
        const randomFoods = allFoods.sort(() => 0.5 - Math.random()).slice(0, foodsCount);

        // Для каждого выбранного продукта создаем запись в промежуточной таблице
        for (const food of randomFoods) {
            await prisma.listingFood.create({
                data: {
                    listingId: listing.id,
                    foodId: food.id,
                },
            });
        }




    }







}

seed()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })