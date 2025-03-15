<template>
	<nav id="nav" class="navigation">
		<ul :class="{ 'navigation-list': true, mobile: isMobile }">
			<li
				v-for="(link, index) in computedLinks"
				:key="index"
				:class="{ active: activeSectionId === link.id }"
				@click.prevent="scrollToSection(link.id)"
			>
				{{ link.name }}
			</li>
		</ul>
	</nav>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import useListing from "~/modules/Listing/composables/useListing";
import useFavorites from "~/components/pages/Favorites/useFavorites";


const {listing} = useListing();



interface Link {
	name: string
	id: string
	enable: boolean,
}

const links: Link[] = [
	{
		name: 'Фото',
		id: 'gallery',
		enable: true,
	},
	{
		name: 'Номера',
		id: 'rooms',
		enable: listing.value.isHotelType,
	},
	{
		name: 'Описание',
		id: 'about',
		enable: true,
	},
	{
		name: 'Правила',
		id: 'rules',
		enable: true,
	},
	{
		name: 'На карте',
		id: 'map',
		enable: true,
	},
	{
		name: 'Отзывы',
		id: 'reviews',
		enable: true,
	},
]

const computedLinks = computed(() => links.filter(link => link.enable))

const activeSectionId = ref('gallery')
const isMobile = ref(false)

const checkIsMobile = () => {
	isMobile.value = window.innerWidth <= 768
}

const scrollToSection = (id: string) => {
	const element: HTMLElement | null = document.getElementById(id)

	if (element) {
		const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
		window.scrollTo({
			top: elementPosition,
			behavior: 'smooth',
		})
	}
}
const onScroll = () => {
	const scrollPosition = window.pageYOffset + window.innerHeight / 2
	
	for (const link of links) {
		const section = document.getElementById(link.id)
		if (section) {
			const sectionTop = section.offsetTop
			const sectionHeight = section.offsetHeight
			
			if (
				scrollPosition >= sectionTop &&
				scrollPosition < sectionTop + sectionHeight
			) {
				if (activeSectionId.value !== link.id) {
					activeSectionId.value = link.id
					scrollNavToActiveLink()
				}
				break
			}
		}
	}
}

const scrollNavToActiveLink = () => {
	const navRef = document.getElementById('nav')
	if (navRef) {
		const activeLink = navRef.querySelector('li.active') as HTMLElement
		if (activeLink) {
			const navRect = navRef.getBoundingClientRect()
			const linkRect = activeLink.getBoundingClientRect()
			
			const offset = linkRect.left - navRect.left
			const scrollPosition = navRef.scrollLeft + offset - navRect.width / 2 + linkRect.width / 2
			
			navRef.scrollTo({
				left: scrollPosition,
				behavior: 'smooth',
			})
		}
	}
}

onMounted(() => {
	checkIsMobile()
	window.addEventListener('resize', checkIsMobile)
	window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', checkIsMobile)
	window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.navigation {
	position: relative;
	width: 100%;
	overflow-x: auto;
	white-space: nowrap;
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.navigation::-webkit-scrollbar {
	display: none;
}

.navigation-list {
	display: flex;
	list-style: none;
	padding: 0;
	margin: 0;
	-ms-overflow-style: none;
	scrollbar-width: none;
	flex-wrap: nowrap;
	overflow-x: auto;
}

.navigation-list::-webkit-scrollbar {
	display: none;
}

.navigation-list li {
	color: #6a6d81;
	cursor: pointer;
	display: inline-block;
	-webkit-flex-shrink: 0;
	-moz-flex-shrink: 0;
	flex-shrink: 0;
	font-size: 16px;
	height: 100%;
	line-height: 24px;
	padding: 16px 0;
	margin-right: 24px;
	position: relative;
	vertical-align: top;
	width: auto;
}


.navigation-list li.active:after {
	background: #316bff;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
	bottom: 0;
	content: "";
	display: block;
	height: 4px;
	position: absolute;
	width: calc(100% + 4px);
}

.navigation-list.mobile {
	flex-wrap: nowrap;
	overflow-x: auto;
}


@media (min-width: 769px) {
	.navigation-list {
		flex-wrap: wrap;
	}
}
</style>