<template>
	<div class="country-list" :class="{'dark-theme': isDarkMode}">
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
						:key="country.cca3"
						tabindex="0"
						role="button"
						:aria-label="`View details for ${country.name.common}`"
						@click="openDetailsCountry(country)"
						@keydown.enter="openDetailsCountry(country)"
						@keydown.space.prevent="openDetailsCountry(country)">
						<img
							class="country-list__flag"
							:alt="country.flags.alt"
							:src="country.flags.png" />

						<div class="country-list__text-content">
							<p class="country-list__name">{{ country.name.common }}</p>

							<p class="country-list__info">
								<span>Population:</span> {{ country.population.toLocaleString() }}
							</p>
							<p class="country-list__info">
								<span>Region:</span> {{ country.region }}
							</p>
							<p class="country-list__info">
								<span>Capital:</span>
								{{
									country.capital && country.capital.length > 0
										? country.capital[0]
										: 'Capital não identificada'
								}}
							</p>
						</div>
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

<script>
import CountryDetailModal from './CountryDetailModal.vue';
import axios from 'axios';
import Fuse from 'fuse.js'; // Para uma pesquisa mais flexível (fuzzy search)
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

const API_URL = 'https://api.restcountries.com';
const API_KEY = process.env.VUE_APP_API_KEY;

// Função adaptadora: normaliza o formato da API v5 para a estrutura esperada pela aplicação
function formatCountry(c) {
	return {
		cca3: c.codes?.alpha_3 || c.codes?.alpha_2 || c.uuid || '',
		name: {
			common: c.names?.common || '',
			official: c.names?.official || '',
		},
		translations: c.names?.translations || {},
		flags: {
			png: c.flag?.url_png || '',
			svg: c.flag?.url_svg || '',
			alt: c.flag?.description || `Bandeira de ${c.names?.common || ''}`,
		},
		population: c.population || 0,
		region: c.region || '',
		subregion: c.subregion || '',
		capital: Array.isArray(c.capitals)
			? c.capitals.map((cap) => cap.name).filter(Boolean)
			: [],
		tld: c.tlds || [],
		currencies: Array.isArray(c.currencies)
			? c.currencies.reduce((acc, cur) => {
				if (cur.code) acc[cur.code] = {name: cur.name, symbol: cur.symbol};
				return acc;
			}, {})
			: {},
		languages: Array.isArray(c.languages)
			? c.languages.reduce((acc, lang) => {
				const key = lang.iso639_1 || lang.bcp47 || lang.name;
				acc[key] = lang.name;
				return acc;
			}, {})
			: {},
		borders: c.borders || [],
	};
}

export default {
	inject: ['isDarkMode'],
	data() {
		return {
			countries: [], // Lista de países
			loading: true, // Estado de carregamento
			error: null, // Mensagem de erro
			fuse: null, // Instância do Fuse.js
			selectedRegion: null, // Região selecionada
			selectedCountryToOpenModal: null, // País selecionado para o modal
			searchTerm: '', // Termo de pesquisa
		};
	},
	components: {
		CountryDetailModal,
		FontAwesomeIcon,
	},
	mounted() {
		this.searchCountries();
	},
	methods: {
		applyRegionFilter(region) {
			this.selectedRegion = region;
		},

		async searchCountries() {
			this.loading = true;
			this.error = null;
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

				this.countries = rawCountries
					.map(formatCountry)
					.sort((a, b) => a.name.common.localeCompare(b.name.common));

				// Configurar o Fuse.js após buscar os países
				this.fuse = new Fuse(this.countries, {
					keys: [
						{name: 'name.common', weight: 0.4}, // Nome comum do país
						{name: 'translations.por.common', weight: 0.3}, // Nome em português
					],
					includeScore: true,
					threshold: 0.3, // Ajuste o limiar para mais ou menos flexibilidade
				});
			} catch (err) {
				this.error = 'Erro ao buscar países: ' + err.message;
			} finally {
				this.loading = false;
			}
		},

		openDetailsCountry(country) {
			// Como o país na API v5 já vem completo com todos os detalhes (capitais, moedas, idiomas, etc.),
			// não é necessário fazer uma nova requisição HTTP
			this.selectedCountryToOpenModal = country;
		},

		closeDetailModal() {
			this.selectedCountryToOpenModal = null;
		},
	},
	computed: {
		availableRegions() {
			const uniqueRegions = new Set(
				this.countries.map((country) => country.region)
			);
			return Array.from(uniqueRegions).sort();
		},

		filteredCountries() {
			let countriesToShow = this.countries;

			if (this.fuse && this.searchTerm && this.searchTerm.trim() !== '') {
				const searchResults = this.fuse.search(this.searchTerm.trim());
				countriesToShow = searchResults.map((result) => result.item);
			}

			if (this.selectedRegion) {
				countriesToShow = countriesToShow.filter(
					(country) => country.region === this.selectedRegion
				);
			}
			return countriesToShow;
		},
	},
};
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
	border: 1px solid #ccc; /* Borda mais visível em fundo claro */
	border-radius: 4px;
	box-sizing: border-box; /* Garante que padding e border não aumentem a largura total */
	font-size: 16px;
}

.search-container.dark-theme input {
	background-color: var(--color-primary-grey-50);
	border-color: var(--color-primary-grey-50);
	color: white;
}

.search-container.dark-theme input::placeholder {
	color: white;
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

.search-container.dark-theme .search-icon {
	color: white;
}

.country-list__text-content {
	padding: 10px; 
}

.country-list.dark-theme {
	background-color: var(--bg-page); 
	color: var(--text-color);
	min-height: 100vh; 
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

.country-list.dark-theme .country-list__select {
	background-color: var(--bg-element);
	color: var(--text-color);
	border-color: var(--shadow-color);
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

.country-list.dark-theme .country-list__item {
	background-color: var(--bg-element);
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
