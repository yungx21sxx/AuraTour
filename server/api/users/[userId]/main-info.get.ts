import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
    const userId = parseInt(event.context.params.userId);

    const user  =  await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            avatar: true,
            BonusTransaction: {
                orderBy: {
                    createdAt: 'desc',
                }
            },
            userBookings: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    listing: {
                        include: {
                            city: true,
                            photos: {
                                select: {
                                    urlMin: true
                                }
                            }
                        },
                    },
                    managedBy: {
                        select: {
                            name: true,
                            surname: true,
                            id: true,
                            phone: true,
                            avatar: true,
                            telegram: true
                        }
                    },
                },
            }
        }
    })

    const {userBookings, ...userInfo} = user;

    const parsedBookings = userBookings.map(booking => {
        const {listing, ...bookingData} = booking
        return {
            ...bookingData,
            listing: {
                id: listing.id,
                photo: listing.photos[0].urlMin,
                city: listing.city.name,
                address: listing.address,
                title: listing.title,
            }
        }
    })

    return {
        ...userInfo,
        userBookings: parsedBookings
    }
})