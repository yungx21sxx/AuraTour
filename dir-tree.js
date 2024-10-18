import { readdir, stat } from 'fs/promises';
import path from 'path';

/**
 * Асинхронная функция для создания дерева файловой структуры
 * @param {string} dirPath - Путь к директории
 * @param {string} indent - Отступ для текущего уровня (для форматирования)
 * @param {string[]} excludeDirs - Массив с именами директорий, которые нужно исключить
 */
async function createDirectoryTree(dirPath, indent = '', excludeDirs = []) {
	try {
		// Читаем содержимое директории
		const items = await readdir(dirPath);
		
		// Фильтруем папки, которые не нужно обходить
		const filteredItems = items.filter(item => {
			// Исключаем скрытые папки и те, что указаны в excludeDirs
			return !excludeDirs.includes(item) && !item.startsWith('.');
		});
		
		// Обходим каждый элемент в директории
		for (let i = 0; i < filteredItems.length; i++) {
			const item = filteredItems[i];
			const itemPath = path.join(dirPath, item);
			const isLastItem = i === filteredItems.length - 1;
			const prefix = isLastItem ? '└──' : '├──';
			
			// Логируем текущий элемент с отступом
			console.log(`${indent}${prefix} ${item}`);
			
			// Проверяем, является ли элемент директорией
			const itemStat = await stat(itemPath);
			if (itemStat.isDirectory()) {
				const newIndent = indent + (isLastItem ? '    ' : '│   ');
				await createDirectoryTree(itemPath, newIndent, excludeDirs);
			}
		}
	} catch (error) {
		console.error(`Ошибка при чтении директории ${dirPath}:`, error);
	}
}

// Путь к корневой директории (например, текущая папка проекта)
const rootDir = path.resolve('');



// Укажите папки, которые необходимо исключить из обхода
const excludeDirs = ['node_modules', '.git', 'dist', '.nuxt', 'uploads', 'migrations', '.idea'];

// Выводим структуру файловой системы
console.log(rootDir);
await createDirectoryTree(rootDir, '', excludeDirs);
