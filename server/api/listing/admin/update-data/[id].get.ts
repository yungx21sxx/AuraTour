import {prisma} from "~/server/service/prisma.service";
import type {Photo, Room} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const listing = await prisma.listing.findUnique({
        where: {
            id: parseInt(<string>id)
        },
        include: {
            flatProperties: {
                select: {
                    floor: true,
                    maxFloor: true,
                    elevator: true,
                }
            },
            owner: {
                select: {
                    name: true,
                    surname: true,
                    email: true,
                }
            },
            photos: {
                select: {
                    id: true,
                    urlMin: true,
                    position: true
                }
            },
            coords: {
                select: {
                    longitude: true,
                    width: true
                }
            },
            pricePeriods: true,
            rooms: {
                include: {
                    pricePeriods: true,
                    amenities: {
                        select: {
                            name: true
                        }
                    },
                    photos: {
                        select: {
                            id: true,
                            position: true,
                            urlMin: true
                        }
                    }
                },
            },
            amenities: {
                include: {
                    amenity: {
                        select: {
                            id: true
                        }
                    }
                }
            },
            food: {
                include: {
                    food: {
                        select: {
                            id: true
                        }
                    }
                }
            },
            infrastructure: {
                include: {
                    infrastructure: {
                        select: {
                            id: true
                        }
                    }
                }
            },
            videos: true
        }
    })
    //@ts-ignore
    const {amenities, food, rooms, photos, infrastructure, ...listingData} = listing
    return {
        ...listingData,
        photos: photos.map((i: Photo) => ({photoId: i.id, urlMin: i.urlMin, position: i.position})),
        //@ts-ignore
        amenities: amenities.map(i => i.amenity.id),
        //@ts-ignore
        foodOptions: food.map(i => i.food.id),
        //@ts-ignore
        infrastructure: infrastructure.map(i => i.infrastructure.id),
        videos: listingData.videos.map(video => ({
            title: video.title,
            videoId: video.id,
            formatedDuration: video.formatedDuration,
            url: video.url
        })),
        rooms: rooms.map((room: Room) => {
            //@ts-ignore
            const {amenities, photos, ...roomData} = room
            return {
                //@ts-ignore
                amenities: amenities.map(i => i.name),
                photos: photos.map((i: Photo) => ({photoId: i.id, urlMin: i.urlMin, position: i.position})),
                ...roomData
            }
        })
    }


})