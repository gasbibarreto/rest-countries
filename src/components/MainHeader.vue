<template>
    <div class="main-header-container" :class="{ 'dark-mode-active': darkMode }">
        <h1>Where in the world?</h1>
        <p @click="toggleDarkMode">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            darkMode: false
        };
    },
    methods: {
        toggleDarkMode() {
            this.darkMode = !this.darkMode
        }
    },
     watch: {
       darkMode(isDark) {
         if (isDark) {
           document.body.classList.add('global-dark-mode');
           document.body.classList.remove('global-light-mode');
       } else {
           document.body.classList.add('global-light-mode');
           document.body.classList.remove('global-dark-mode');
        }
       }
    },
    mounted() {
       // Define o tema inicial no body
       document.body.classList.add(this.darkMode ? 'global-dark-mode' : 'global-light-mode');
    }
}


</script>

<style>
.main-header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 20px 15px; /* Ajuste o padding conforme necessário (vertical, horizontal) */
    box-sizing: border-box; /* Garante que o padding não aumente a largura total do elemento */
}

.main-header-container h1{
    font-size: 14px; /* Ajuste o tamanho da fonte conforme necessário */
    margin: 0; /* Remove a margem padrão do h1 */
}

.main-header-container p{
    font-size: 10px;
}

.main-header-container.dark-mode-active {
    background-color: #2b3743; 
    color: white; 
}

.global-dark-mode { background-color: #202c37; color: white; }
.global-light-mode { background-color: #fafafa; color: #111517; }

</style>