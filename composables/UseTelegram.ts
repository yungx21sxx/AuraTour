import type {BookingCreateDTO} from "~/types/dto.types";

export default () => {
	const token = '7033762910:AAFQ-WgMN4uRWXl_ZQwn6snraEZyI1dR9eg'
	const chatID = -1002065449939

	function formatBookingMessageForTelegramLink(bookingData: BookingCreateDTO, listingLink: string, roomName: string | null) {
		const messageParts = [
			`Новое бронирование:`,
			`**Дата заезда:** ${bookingData.startDate.toISOString().split('T')[0]}`,
			`**Дата выезда:** ${bookingData.endDate.toISOString().split('T')[0]}`,
			`Взрослые: ${bookingData.adults}`,
			`Дети: ${bookingData.childrens}`,
			`Фамилия: ${bookingData.surname}`,
			`Имя: ${bookingData.name}`,
			`Комментарий: ${bookingData.comment}`,
			`Телефон: +7 ${bookingData.phone}`,
			`Трансфер: ${bookingData.transfer ? 'Да' : 'Нет'}`,
			bookingData.transferComment ? `Комментарий к трансферу: ${bookingData.transferComment}` : '',
			`ID объявления: ${bookingData.listingId}`,
			`Ссылка на объект: ${listingLink}  `,
			bookingData.roomId ? `ID Номера: ${bookingData.roomId}` : '',
			bookingData.roomId ? `Номер ${roomName}` : '',
			bookingData.userId ? `ID пользователя: ${bookingData.userId}` : ''
		];

		// Фильтрация пустых строк и соединение частей сообщения с кодированным переносом строки
		return messageParts.filter(part => part !== '').join('%0A');
	}

	const getUrl = (text: string): string => `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${text}`
	// @ts-ignore

	// @ts-ignore
	const sendBookingInfo = async (bookingData: BookingCreateDTO, listingLink: string, roomName: string | null) => {
		const text = formatBookingMessageForTelegramLink(bookingData, listingLink, roomName)
		const url = getUrl(text)
		return useFetch(url)
	}


	const fetchForCallData = async (phone: string, name: string, ) => {
		let text = `Клиент оставил заявку на подбор объектов: %0A👶Имя: ${name} %0A📱Номер телефона: +7 ${phone} `
		const url = getUrl(text);
		return useFetch(url)
	}

	return {
		sendBookingInfo,
		fetchForCallData
	}

}