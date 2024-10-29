<script setup lang="ts">


</script>

<template>
	<v-card
		class="listing"
		:elevation="0"
		width="100%"
	>
		<v-skeleton-loader
			class="listing__carousel"
			type="image"
		/>
		<div class="listing__info info">
			<v-skeleton-loader
				type="article"
			/>
		</div>
		<div class="listing__order order">
			<v-skeleton-loader
				type="list-item"
			/>
			<v-skeleton-loader
				class="order__btn"
				type="button"
			/>
		</div>
		
	</v-card>

</template>

<style scoped lang="scss">

.listing {
	display: grid;
	grid-template-columns: 2fr 3fr 1.5fr;
	margin-bottom: 16px;
}

.info {
	margin-left: 20px;
}

.order {
	display: flex;
	flex-direction: column;
	padding-left: 16px;
	
	&__btn {
		margin-top: auto;
		margin-bottom: 16px;
		width: 100%;
	}
	&__description {
		color: #717171;
	}
	&__price {
		margin-bottom: 4px;
		.price {
			font-size: 18px;
			font-weight: 600;
			margin-right: 6px;
		}
		
		&_info {
			font-size: 14px;
		}
		
	}
}

@media screen and (max-width: 630px) {
	.listing {
		display: block !important;
	}
	
	.info {
		margin-top: 16px;
	}
	.order {
		display: none;
	}

	
	
}


</style>