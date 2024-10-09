interface CurrentPhoto {
	index: number,
	modal: boolean,
	room: {
		id: number,
		photoIndex: number
	} | null
}
export default () => useState<CurrentPhoto>('current-photo', () => ({
	index: 0,
	modal: false,
	room: null
}))