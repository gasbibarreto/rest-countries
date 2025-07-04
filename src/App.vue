<template>
	<!-- Adiciona a classe 'dark-theme' dinamicamente -->
	<div class="header" :class="{'dark-theme': darkMode}">
		<h1 class="header__title">Where in the world?</h1>
		<p class="header__toggle-theme" @click="toggleDarkMode">
			{{ darkMode ? 'Light Mode' : 'Dark Mode' }}
		</p>
	</div>
	<!-- CountryList agora pode injetar o estado do tema diretamente -->
	<CountryList />
</template>

<script>
import {computed} from 'vue';
import CountryList from './components/CountryList.vue';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

library.add(faSearch);

export default {
	name: 'App',
	components: {
		CountryList,
	},
	data() {
		return {
			darkMode: false,
		};
	},
	provide() {
		// Fornece o estado darkMode de forma reativa para os componentes filhos
		return {
			isDarkMode: computed(() => this.darkMode),
		};
	},
	methods: {
		toggleDarkMode() {
			this.darkMode = !this.darkMode;
			this.updateBodyClass();
		},
		updateBodyClass() {
			const body = document.body;
			// Garante que apenas a classe de tema correta esteja no body
			body.classList.remove('global-dark-mode', 'global-light-mode');
			body.classList.add(
				this.darkMode ? 'global-dark-mode' : 'global-light-mode'
			);
		},
	},

	mounted() {
		// Define o tema inicial no body ao carregar a página
		this.updateBodyClass();
	},
};
</script>

<style>
body {
	margin: 0;
	font-family: 'Segoe UI', sans-serif;
	background-color: #fafafa;
	color: #111;
}

/* Classes globais para o tema. Usar 'body' torna o seletor mais específico. */
body.global-dark-mode {
	background-color: #202c37;
	color: white;
}

body.global-light-mode {
	background-color: #fafafa;
	color: #111517;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: white;
	padding: 20px 15px;
	box-sizing: border-box;
	margin-bottom: 24px;
}

.header.dark-theme {
	background-color: #2b3743;
	box-shadow: none; /* Opcional: remover sombra no modo escuro */
	color: white;
}

.header__title {
	font-size: 18px;
	font-weight: 800;
}

.header__toggle-theme {
	background: none;
	border: none;
	font-size: 14px;
	cursor: pointer;
}

.header__toggle-theme:hover {
  text-decoration: underline;
}
</style>
