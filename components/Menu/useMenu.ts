export default () => {
	const route = useRoute();
	const links = [
		{
			href: 'index',
			text: 'О нас',
		},
		{
			href: 'flats',
			text: 'Экскурсии',
		},
		{
			href: 'gallery',
			text: 'Акции',
		},
		{
			href: 'documents',
			text: 'Контакты',
		},
	];


	const computedLinks = computed(() => {
		return links.map(link => ({
			...link,
			isActive: route.fullPath.indexOf(link.href) > 0 || route.name === link.href
		}))
	});


	return {
		computedLinks
	}
}