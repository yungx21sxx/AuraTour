export interface IQueryBooking {
	adults: number,
	checkIn: Date,
	checkOut: Date,
	children: number,
	city: string | null,
	cityId: number | null,
	region: string | null,
	regionId: number | null
}