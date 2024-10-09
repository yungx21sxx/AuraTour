

export function formatDays(nights: number): string {
	const lastDigit = nights % 10;
	const lastTwoDigits = nights % 100;

	if (lastDigit === 1 && lastTwoDigits !== 11) {
		return `${nights} ночь`;
	} else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
		return `${nights} ночи`;
	} else {
		return `${nights} ночей`;
	}
}

export function getWordWithProperEnding(count: number, word: 'место' | 'отзыв' | 'гость'): string {
	let ending = '';

	if (word === 'место') {
		if (count % 10 === 1 && count % 100 !== 11) {
			ending = 'место';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			ending = 'места';
		} else {
			ending = 'мест';
		}
	} else if (word === 'отзыв') {
		if (count % 10 === 1 && count % 100 !== 11) {
			ending = 'отзыв';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			ending = 'отзыва';
		} else {
			ending = 'отзывов';
		}
	} else if (word === 'гость') {
		if (count % 10 === 1 && count % 100 !== 11) {
			ending = 'гость';
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			ending = 'гостя';
		} else {
			ending = 'гостей';
		}
	}

	return `${count} ${ending}`;
}


export function getRoomString(numberOfRooms: number): string {
	let word = 'комнат';

	if (numberOfRooms % 100 < 11 || numberOfRooms % 100 > 14) {
		switch (numberOfRooms % 10) {
			case 1:
				word = 'комната';
				break;
			case 2:
			case 3:
			case 4:
				word = 'комнаты';
				break;
		}
	}

	return `${numberOfRooms} ${word}`;
}

export function getBedString(numberOfBeds: number): string {
	let word = 'кроватей';

	if (numberOfBeds % 100 < 11 || numberOfBeds % 100 > 14) {
		switch (numberOfBeds % 10) {
			case 1:
				word = 'кровать';
				break;
			case 2:
			case 3:
			case 4:
				word = 'кровати';
				break;
		}
	}

	return `${numberOfBeds} ${word}`;
}

export function numberToVariantsString(count: number): string {
	const wordForms = ["вариант", "варианта", "вариантов"]; // Формы слова для склонения
	let n = Math.abs(count) % 100; // Обработка отрицательных чисел и приведение к диапазону 0-99
	const n1 = n % 10;

	if (n > 10 && n < 20) return `${count} ${wordForms[2]}`;
	if (n1 > 1 && n1 < 5) return `${count} ${wordForms[1]}`;
	if (n1 === 1) return `${count} ${wordForms[0]}`;

	return `${count} ${wordForms[2]}`;
}


