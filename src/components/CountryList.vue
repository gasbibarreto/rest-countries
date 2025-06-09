<template>
<div class="country-list">
	<div class="country-list__filter-container">
		<select
			class="country-list__select"
			@change="applyRegionFilter($event.target.value)">
			<option v-for="region in availableRegions" :key="region">
				{{ region }}
			</option>
			<option value="">Filter by Region</option>
		</select>
	</div>
	<div class="country-list__content-area">
		<p class="country-list__message" v-if="loading">Carregando países...</p>
		<p class="country-list__message" v-else-if="error">{{ error }}</p>
		<ul class="country-list__items" v-else-if="filteredCountries.length">
			<li class="country-list__item" v-for="country in filteredCountries" :key="country.cca3">
				<img class="country-list__flag" :alt="country.flags.alt" :src="country.flags.png" />
				<p>{{ country.name.common }}</p>
				<p><span>Population:</span> {{ country.population }} </p>
				<p>Region: {{ country.region }}</p>
				<p>Capital: {{
					country.capital && country.capital.length > 0
						? country.capital[0]
						: 'Capital não identificada'
				}}</p>
			</li>
		</ul>
		<p class="country-list__message" v-else-if="searchTerm && !filteredCountries.length">
			Nenhum país encontrado para "{{ searchTerm }}".
		</p>
		<p class="country-list__message" v-else>Nenhum país encontrado.</p>
	</div>
	</div>
</template>

<script>
import axios from 'axios';
import Fuse from 'fuse.js'; // Para uma pesquisa mais flexível (fuzzy search)

const API_URL = 'https://restcountries.com/v3.1/all';

export default {
	props: {
		searchTerm: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			countries: [], // Lista de países
			loading: true, // Estado de carregamento
			error: null,
			fuse: null, // Instância do Fuse.js
			selectedRegion: null, // Região selecionada
		};
	},
	mounted() {
		this.searchCountries();
	},
	methods: {
		applyRegionFilter(region) {
			this.selectedRegion = region;
		},
		async searchCountries() {
			this.error = null;
			try {
				const response = await axios.get(`${API_URL}?fields=name,cca3,flags,population,region,capital,translations`);
				this.countries = response.data.sort((a, b) =>
					a.name.common.localeCompare(b.name.common)
				);
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
.country-list__filter-container {
	display: flex;
	justify-content: flex-start;
	margin-top: 10px;
}

.country-list__select {
	width: 150px;
	padding: 10px;
	border-radius: 4px;
	border: 1px solid #ccc;
	background-color: #f9f9f9;
}

.country-list__content-area {
	display: flex;
	flex-direction: column; /* Para empilhar mensagens ou a lista */
	align-items: center; /* Centralizar mensagens ou a lista */
	margin: 20px 0
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
  	margin: 0;
	justify-content: center;
} 

.country-list__item {
	background-color: #f1f1f1;
	border-radius: 5px;
	flex: 1 1 200px; /* mínimo de 200px por item */
	max-width: 230px;
    justify-items: center;
	padding: 0px 15px 0px 15px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.country-list__flag {
	width: 260px;
    height: 160px;
	object-fit: cover;
	border-radius: 4px;
}

@media (min-width: 600px) {
	.country-list__item{
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.country-list__select {

	}
}
</style>
