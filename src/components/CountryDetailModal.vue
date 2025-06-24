<template>
  <div class="modal-overlay" v-if="country" @click.self="closeModal">
    <div class="modal-content">
      <button @click="closeModal" class="close-btn">Back</button>
      <div v-if="country">
        <h2>{{ country.name.common }}</h2>
        <img :src="country.flags.png" :alt="`Bandeira de ${country.name.common}`" class="modal-flag" />
        <p><strong>Native Name:</strong> {{ country.name.official }}</p>
        <p><strong>Population:</strong> {{ country.population.toLocaleString() }}</p>
        <p><strong>Region:</strong> {{ country.region }}</p>
        <p><strong>Sub Region:</strong> {{ country.subregion }}</p>
        <p><strong>Capital:</strong> {{ country.capital && country.capital.length > 0 ? country.capital.join(', ') : 'N/A' }}</p>
        <p><strong>Top Level Domain:</strong> {{ country.tld && country.tld.join(', ') }}</p>
        <p><strong>Currencies:</strong> {{ Object.values(country.currencies || {}).map(c => c.name).join(', ') }}</p>
        <p><strong>Languages:</strong> {{ Object.values(country.languages || {}).join(', ') }}</p>
  
        <p><strong>Borders:</strong> 
          <span v-if="country.borders && country.borders.length > 0">
            {{ country.borders.join(', ') }}
          </span>
          <span v-else>Nenhuma fronteira terrestre</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  position: relative;
  color: #333;
}
.modal-flag {
  width: 150px;
  height: auto;
  border: 1px solid #eee;
  margin-bottom: 15px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #555;
}
.modal-content h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  text-align: center;
}
.modal-content p {
  margin-bottom: 10px;
  line-height: 1.6;
}
.modal-content p strong {
  color: #34495e;
}
</style>
