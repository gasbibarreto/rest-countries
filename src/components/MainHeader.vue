<template>
    <div class="header">
        <h1 class="header__title">Where in the world?</h1>        
        <p class="header__toggle-theme" @click="toggleDarkMode">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    methods: {
        toggleDarkMode() {
            this.darkMode = !this.darkMode
        }
    },
    props: {
        darkMode: Boolean,
    },

    mounted() {
       // Define o tema inicial no body
       document.body.classList.add(this.darkMode ? 'global-dark-mode' : 'global-light-mode');
    }
}


</script>

<style>

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 20px 15px; 
    box-sizing: border-box;
    margin-bottom: 24px;
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
.global-dark-mode { background-color: #202c37; color: white; }
.global-light-mode { background-color: #fafafa; color: #111517; }

</style>