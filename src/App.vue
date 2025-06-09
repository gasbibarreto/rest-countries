<template>
    <MainHeader></MainHeader>
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Pesquisar país..." />
    </div>
    <CountryList :searchTerm="searchQuery" />
</template>

<script>
import MainHeader from './components/MainHeader.vue';
import CountryList from './components/CountryList.vue';

export default {
  name: 'App',
  components: {
    MainHeader,
    CountryList
  },

  data() {
    return {
      searchQuery: '' // Variável para armazenar o termo de pesquisa
    };
  }
};
</script>

<style>
  .search-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  .search-container input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
