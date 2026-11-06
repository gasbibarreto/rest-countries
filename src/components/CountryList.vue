<template>
	<div class="country-list">
		<CountryDetailModal
			v-if="selectedCountryToOpenModal"
			:country="selectedCountryToOpenModal"
			@close="closeDetailModal" />
		<div v-else>
			<div class="country-list__header">
				<!-- Campo de pesquisa -->
				<div class="search-container">
					<font-awesome-icon icon="search" class="search-icon" />
					<input
						type="search"
						v-model="searchTerm"
						placeholder="Search for a country..."
						aria-label="Search for a country"
						/>
				</div>
				<!-- Filtro de região -->
				<div class="country-list__filter-container">
					<select
						class="country-list__select"
						aria-label="Filter countries by region"
						@change="applyRegionFilter($event.target.value)">
						<option value="">Filter by Region</option>
						<option v-for="region in availableRegions" :key="region">
							{{ region }}
						</option>
					</select>
				</div>
			</div>
			<!-- Lista de países -->
			<div class="country-list__content-area">
				<p class="country-list__message" v-if="loading">Carregando países...</p>
				<p class="country-list__message" v-else-if="error">{{ error }}</p>
				<ul class="country-list__items" v-else-if="filteredCountries.length">
					<li
						class="country-list__item"
						v-for="country in filteredCountries"
						:key="country.codes?.alpha_3 || country.uuid"
						tabindex="0"
						role="button"
						:aria-label="`View details for ${country.names?.common}`"
						@keydown.enter="openDetailsCountry(country)"
						@keydown.space.prevent="openDetailsCountry(country)">
						<router-link :to="'/country/' + country.codes?.alpha_3" style="text-decoration: none; color: inherit;">
							<img
							class="country-list__flag"
							:alt="country.flag?.description || `Bandeira de ${country.names?.common}`"
							:src="country.flag?.url_png" />

						<div class="country-list__text-content">
							<p class="country-list__name">{{ country.names?.common }}</p>

							<p class="country-list__info">
								<span>Population:</span> {{ country.population?.toLocaleString() }}
							</p>
							<p class="country-list__info">
								<span>Region:</span> {{ country.region }}
							</p>
							<p class="country-list__info">
								<span>Capital:</span>
								{{
									country.capitals && country.capitals.length > 0
										? country.capitals[0].name
										: 'Capital não identificada'
								}}
							</p>
						</div>
						</router-link>
					</li>
				</ul>
				<p
					class="country-list__message"
					v-else-if="searchTerm && !filteredCountries.length">
					Nenhum país encontrado para "{{ searchTerm }}".
				</p>
				<p class="country-list__message" v-else>Nenhum país encontrado.</p>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Fuse from 'fuse.js'; // Para uma pesquisa mais flexível (fuzzy search)
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

const API_URL = 'https://api.restcountries.com';
const API_KEY = process.env.VUE_APP_API_KEY;

const countries = ref([]); // Lista de países
const loading = ref(true); // Estado de carregamento
const error = ref(null); // Mensagem de erro
const fuse = ref(null); // Instância do Fuse.js
const selectedRegion = ref(null); // Região selecionada
const selectedCountryToOpenModal = ref(null); // País selecionado para o modal
const searchTerm = ref(''); // Termo de pesquisa

const applyRegionFilter = (region) => {
	selectedRegion.value = region;
};

const searchCountries = async () => {
	loading.value = true;
	error.value = null;
	try {
		const headers = {'Authorization': 'Bearer ' + API_KEY};
		// A API v5 limita a 100 países por requisição no plano gratuito (total de 254 países)
		const [res1, res2, res3] = await Promise.all([
			axios.get(`${API_URL}/countries/v5?offset=0&limit=100`, {headers}),
			axios.get(`${API_URL}/countries/v5?offset=100&limit=100`, {headers}),
			axios.get(`${API_URL}/countries/v5?offset=200&limit=100`, {headers}),
		]);

		const rawCountries = [
			...(res1.data.data?.objects || []),
			...(res2.data.data?.objects || []),
			...(res3.data.data?.objects || []),
		];

		countries.value = rawCountries.sort((a, b) =>
			(a.names?.common || '').localeCompare(b.names?.common || '')
		);

		// Configurar o Fuse.js após buscar os países
		fuse.value = new Fuse(countries.value, {
			keys: [
				{name: 'names.common', weight: 0.4}, // Nome comum do país
				{name: 'names.translations.por.common', weight: 0.3}, // Nome em português
			],
			includeScore: true,
			threshold: 0.3, // Ajuste o limiar para mais ou menos flexibilidade
		});
	} catch (err) {
		error.value = 'Erro ao buscar países: ' + err.message;
	} finally {
		loading.value = false;
	}
};

const availableRegions = computed(() => {
	const uniqueRegions = new Set(
		countries.value.map((country) => country.region)
	);
	return Array.from(uniqueRegions).sort();
});

const filteredCountries = computed(() => {
	let countriesToShow = countries.value;

	if (fuse.value && searchTerm.value && searchTerm.value.trim() !== '') {
		const searchResults = fuse.value.search(searchTerm.value.trim());
		countriesToShow = searchResults.map((result) => result.item);
	}

	if (selectedRegion.value) {
		countriesToShow = countriesToShow.filter(
			(country) => country.region === selectedRegion.value
		);
	}
	return countriesToShow;
});

onMounted(() => {
	searchCountries();
});
</script>
<style>
.search-container {
	position: relative; /* Necessário para posicionar o ícone absolutamente dentro dele */
	display: flex;
	justify-content: center;
	margin: 20px 10px;
	padding: 0 5px; /* Adiciona um pouco de espaço nas laterais */
}

.search-container input {
	width: 100%; /* Ocupa a largura do search-container */
	max-width: 600px; /* Define uma largura máxima para o input */
	padding: 12px 15px 12px 40px; /* Ajustado padding-left para o ícone */
	border: 1px solid var(--shadow-color); /* Borda mais visível em fundo claro */
	border-radius: 4px;
	box-sizing: border-box; /* Garante que padding e border não aumentem a largura total */
	font-size: 16px;
	background-color: var(--bg-element);
}

.search-icon {
	position: absolute;
	left: 15px; /* Ajustado para posicionar o ícone dentro do padding do input */
	top: 50%;
	transform: translateY(-50%);
	color: #aaa; /* Cor do ícone mais visível em fundo claro */
	font-size: 16px; /* Tamanho do ícone */
	pointer-events: none; /* Impede que o ícone capture eventos de clique */
}

.country-list__text-content {
	padding: 10px; 
}

.country-list__filter-container {
	display: flex;
	justify-content: flex-start;
	margin-top: 10px;
	margin-left: 15px;
}

.country-list__select {
	width: 200px;
	padding: 15px;
	border-radius: 6px;
	border: 1px solid #ccc;
	background-color: #fff; 
	font-size: 14px; 
	color: #333; 
}

.country-list__content-area {
	display: flex;
	flex-direction: column; /* Para empilhar mensagens ou a lista */
	align-items: center; /* Centralizar mensagens ou a lista */
	margin: 20px 0;
}

.country-list__message {
	margin: 20px 0;
}

.country-list__items {
	display: flex;
	flex-wrap: wrap;
	gap: 30px;
	list-style: none;
	padding: 0;
	justify-content: center;
}

.country-list__item {
	background-color: var(--bg-element);
	border-radius: 5px;
	flex: 1 1 200px; 
	max-width: 310px;
	box-shadow: 0 2px 5px var(--shadow-color);
}

.country-list__flag {
	width: 100%;
	height: 160px;
	object-fit: cover;
	border-radius: 4px;
}

.country-list__name {
	padding-left: 20px;
	margin-bottom: 20px;
	font-weight: bold;
	font-size: 18px;
}

.country-list__info {
	padding-left: 20px;
	font-size: 13px;
}

.country-list__info span {
	font-weight: 600; /* ou bold, se preferir */
}

@media (min-width: 600px) {
	.country-list {
		width: 95%;
		margin: 0 auto;
	}
	.country-list__item {
		display: flex;
		flex: 1 1 254px;
		flex-direction: column;
		gap: 10px;
	}

	.country-list__items{
		gap: 60px;

	}

	.country-list__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 auto;
	}
	
	.search-container input {
		width: 400px; /* Aumenta a largura do campo de pesquisa em telas maiores */
	}
}
</style>
