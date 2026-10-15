<template>
    <div class="header__component">
        <div class="header">
            <h1 class="header__title">Where in the world?</h1>        
            <button class="header__toggle-theme" @click="toggleDarkMode()">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
    return {
      darkMode: false,
    };
  },

    methods: {
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
  },

  applyTheme() {
    const theme = this.darkMode ? 'dark' : 'light';
    
    // 1. Altera o atributo na tag <html>
    document.documentElement.setAttribute('data-theme', theme);
    
    // 2. Salva a escolha do usuário no navegador
    localStorage.setItem('theme', theme);
  },

  initializeTheme() {
    // 1. Verifica se o usuário já visitou o site e salvou um tema
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      this.darkMode = savedTheme === 'dark';
    } else {
      // 2. Se for a primeira visita, verifica se o sistema operacional está em modo escuro
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode = systemPrefersDark;
    }

    // Aplica o tema inicial
    this.applyTheme();
  }
},

mounted() {
  this.initializeTheme();
}
}


</script>

<style> 
.header__component{
    background-color: var(--bg-element);
    color: var(--text-color);
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px; 
    box-sizing: border-box;
    width: 95%;
    margin: 0 auto;
}

.header__title{
    font-size: 18px;
    font-weight: var(--font-weight-800);
}

.header__toggle-theme {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: var(--font-weight-600);
  cursor: pointer;
}

button {
    color: var(--text-color);
}

</style>