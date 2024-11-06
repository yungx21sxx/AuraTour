interface CurrentPhoto {
	index: number,
	modal: boolean,
	room: {
		roomId: number,
		photoIndex: number
	} | null
}


export default () => {
	const currentPhoto = useState<CurrentPhoto>('current-photo', () => ({
		index: 0,
		modal: false,
		room: null
	}));
	const galleyThumbsModalIsOpen = useState<boolean>(() => false)

	return {
		currentPhoto,
		galleyThumbsModalIsOpen
	}
}