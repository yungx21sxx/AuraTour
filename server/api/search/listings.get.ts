import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
	const listings = await prisma.listing.findMany({
		select: {
			title: true,
			id: true,
			type: {
				select: {
					name: true
				}
			},
			address: true,
			phone: true,
			renterName: true,
			city: {
				select: {
					name: true
				}
			},
			photos: {
				select: {
					urlMin: true
				}
			},

		}
	})
	return listings.map(listing => ({
		title: listing.title,
		type: listing.type.name,
		photo: listing.photos[0]?.urlMin ?? '',
		city: listing.city.name,
		address: listing.address,
		id: listing.id,
		phone: listing.phone,
		renterName: listing.renterName,
	}))
})