import type {BookingCreateDTO} from "~/modules/Listing/types/dto.types";
import {parsePhone} from "~/modules/Common/Utils/phone.utils";
import useBooking from "~/modules/Booking/composables/useBooking";

export default () => {
	const bookingBotToken = '7033762910:AAFQ-WgMN4uRWXl_ZQwn6snraEZyI1dR9eg';
	const moderationBotToken = '7596912157:AAHuxdK-tA7E0YWUS99C7uKQqHZlYbsKCKA'
	const bookingBotChatID = -1002065449939;
	const moderationBotChatId = -1002458354946;

	const {
		beautifyDate,
	} = useBooking();

	async function formatBookingMessageForTelegramLink(bookingData: BookingCreateDTO, listingLink: string, roomName: string | null, managerName: string) {
		const parsedPhone = await parsePhone(bookingData.userPhone);
		const messageParts = [
			`Новое бронирование:`,
			`**Дата заезда:** ${beautifyDate( bookingData.checkIn)}`,
			`**Дата выезда:** ${beautifyDate( bookingData.checkOut)}`,
			`Взрослые: ${bookingData.adults}`,
			`Дети: ${bookingData.childrens}`,
			`Фамилия: ${bookingData.userSurname}`,
			`Имя: ${bookingData.userName}`,
			`Комментарий: ${bookingData.comment}`,
			`Телефон: ${parsedPhone}`,
			`Трансфер: ${bookingData.transfer ? 'Да' : 'Нет'}`,
			bookingData.transferComment ? `Комментарий к трансферу: ${bookingData.transferComment}` : '',
			`Ссылка на объект: ${listingLink}  `,
			`Менеджер: ${managerName}`
		];

		// Фильтрация пустых строк и соединение частей сообщения с кодированным переносом строки
		return messageParts.filter(part => part !== '').join('%0A');
	}

	const getUrl = (text: string, token: string, chatID: number): string => `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${text}`
	// @ts-ignore

	// @ts-ignore
	const sendBookingInfo = async (bookingData: BookingCreateDTO, listingLink: string, roomName: string | null, managerName: string) => {
		const text = await formatBookingMessageForTelegramLink(bookingData, listingLink, roomName, managerName);
		const url = getUrl(text, bookingBotToken, bookingBotChatID);
		return useFetch(url)
	}
	
	const sendListingValidationMassage = (type: 'create' | 'update', listingId: number) => {
		const text = `Отельер оставил заявку на ${type === 'create' ? 'размещение жилья' : 'обновление жилья'}. Ссылка: https://aura-tour-abkhazia.ru/listing/${listingId}`;
		const url = getUrl(text, moderationBotToken, moderationBotChatId);
		return useFetch(url)
	}


	const fetchForCallData = async (phone: string, name: string, question: string | null) => {
		let text = `Клиент оставил заявку на подбор объектов: %0A👶Имя: ${name} %0A📱Номер телефона: ${phone} ${question ? `%0A Вопрос: ${question}` : ''} %0A `
		const url = getUrl(text, bookingBotToken, bookingBotChatID);
		return useFetch(url)
	}

	return {
		sendBookingInfo,
		sendListingValidationMassage,
		fetchForCallData
	}

}