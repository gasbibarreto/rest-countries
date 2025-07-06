<template>
	<div class="country-detail" @click.self="closeModal">
		<button @click="closeModal" class="country-detail__back-button">
			← Back
		</button>
		<div v-if="country" class="country-detail__body">
			<img
				:src="country.flags.svg"
				:alt="`Bandeira de ${country.name.common}`"
				class="country-detail__flag" />
			<div class="country-detail__content">
				<h2 class="country-detail__name">{{ country.name.common }}</h2>
				<div class="country-detail__info">
					<p><strong>Native Name:</strong> {{ country.name.official }}</p>
					<p>
						<strong>Population:</strong>
						{{ country.population.toLocaleString() }}
					</p>
					<p><strong>Region:</strong> {{ country.region }}</p>
					<p><strong>Sub Region:</strong> {{ country.subregion }}</p>
					<p>
						<strong>Capital:</strong>
						{{
							country.capital && country.capital.length > 0
								? country.capital.join(', ')
								: 'N/A'
						}}
					</p>
					<p>
						<strong>Top Level Domain:</strong>
						{{ country.tld && country.tld.join(', ') }}
					</p>
					<p>
						<strong>Currencies:</strong>
						{{
							Object.values(country.currencies || {})
								.map((c) => c.name)
								.join(', ')
						}}
					</p>
					<p>
						<strong>Languages:</strong>
						{{ Object.values(country.languages || {}).join(', ') }}
					</p>
				</div>
				<div class="country-detail__borders">
					<h3 class="country-detail__borders-title">Border Countries:</h3>
					<div class="country-detail__borders-list">
						<template v-if="country.borders && country.borders.length > 0">
							<span v-for="border in country.borders" :key="border" class="country-detail__border">
								{{ border }}
							</span>
						</template>
						<span v-else>Nenhuma fronteira terrestre</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';

defineProps({
	country: {
		type: Object,
		default: null,
	},
});

const emit = defineEmits(['close']);

const closeModal = () => {
	emit('close');
};
</script>

<style scoped>
/* 🌗 Variáveis por tema */
:root {
	--bg-color: #fafafa;
	--text-color: #111;
	--card-color: #fff;
	--button-bg: #fff;
	--button-shadow: rgba(0, 0, 0, 0.1);
	--border-color: #ccc;
}

[data-theme='dark'] {
	--bg-color: #202c37;
	--text-color: #fff;
	--card-color: #2b3945;
	--button-bg: #2b3945;
	--button-shadow: rgba(0, 0, 0, 0.3);
	--border-color: #444;
}

/* 📦 Estilo da página de detalhe */
.country-detail {
	background-color: var(--bg-color);
	color: var(--text-color);
	padding: 24px;
	font-family: 'Segoe UI', sans-serif;
	min-height: 100vh;
}

.country-detail__back-button {
	background-color: var(--button-bg);
	color: var(--text-color);
	border: none;
	padding: 8px 24px;
	margin-bottom: 24px;
	border-radius: 6px;
	box-shadow: 0 2px 6px var(--button-shadow);
	cursor: pointer;
	font-size: 16px;
}

.country-detail__flag {
	width: 100%;
	max-width: 100%;
	border-radius: 6px;
	margin-bottom: 24px;
}

.country-detail__name {
	font-size: 24px;
	font-weight: 800;
	margin-bottom: 16px;
}

.country-detail__info p {
	font-size: 14px;
	margin: 6px 0;
}

.country-detail__borders {
	margin-top: 24px;
}

.country-detail__borders-title {
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 12px;
}

.country-detail__borders-list {
	display: flex;
	flex-wrap: wrap;
}

.country-detail__borders-list span {
	padding: 8px 16px;
	border-radius: 6px;
	box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
	background-color: var(--card-color);
	font-size: 14px;
	gap: 12px;
}


.country-detail__border {
	background-color: var(--button-bg);
	color: var(--text-color);
	padding: 6px 16px;
	border-radius: 6px;
	box-shadow: 0 1px 4px var(--button-shadow);
	font-size: 14px;
}

.country-detail.dark-theme {
	background-color: var(--bg-color);
	color: var(--text-color);
}

@media (min-width: 600px) {
	.country-detail {
		padding: 48px;
	}

	.country-detail__back-button {
		font-size: 18px;
	}

	.country-detail__name {
		font-size: 32px;
	}

	.country-detail__info p {
		font-size: 16px;
	}

	.country-detail__borders-title {
		font-size: 18px;
	}

	.country-detail__body {
		display: flex;
		align-items: center;
		gap: 60px;
	}

	.country-detail__flag {
		flex: 1;
		max-width: 700px; /* Limita a largura da bandeira */
		margin-bottom: 0;
	}

	.country-detail__content {
		flex: 1;
	}

	.country-detail__info {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px 20px; /* Espaçamento entre linhas e colunas */
	}
}
</style>
