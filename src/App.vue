<template>
    <!-- Adiciona a classe 'dark-theme' dinamicamente -->
    <div class="header" :class="{ 'dark-theme': darkMode }">
        <h1 class="header__title">Where in the world?</h1>        
        <p class="header__toggle-theme" @click="toggleDarkMode">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</p>
    </div>
    <div class="search-container" :class="{ 'dark-theme': darkMode }">
      <font-awesome-icon icon="search" class="search-icon" />
      <input type="text" v-model="searchQuery" placeholder="Search for a country..." />
    </div>
    <!-- CountryList agora pode injetar o estado do tema diretamente -->
    <CountryList :searchTerm="searchQuery" />
</template>

<script>
import { computed } from 'vue';
import CountryList from './components/CountryList.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch);

export default {
  name: 'App',
  components: {
    CountryList,
    FontAwesomeIcon
  },
  data() {
    return {
      searchQuery: '',
      darkMode: false,
    };
  },
  provide() {
    // Fornece o estado darkMode de forma reativa para os componentes filhos
    return {
      isDarkMode: computed(() => this.darkMode)
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.updateBodyClass();
    },
    updateBodyClass() {
      const body = document.body;
      // Garante que apenas a classe de tema correta esteja no body
      body.classList.remove('global-dark-mode', 'global-light-mode');
      body.classList.add(this.darkMode ? 'global-dark-mode' : 'global-light-mode');
    },
  },

  mounted() {
    // Define o tema inicial no body ao carregar a página
    this.updateBodyClass(); 
  }

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
body.global-dark-mode { background-color: #202c37; color: white; }
body.global-light-mode { background-color: #fafafa; color: #111517; }

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

.header__title{
    font-size: 18px;
    font-weight: 800;
}

.header__toggle-theme {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

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
    background-color: #2b3743;
    border-color: #2b3743;
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

</style>
