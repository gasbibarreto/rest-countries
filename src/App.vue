<template>
	<MainHeader />
	<CountryList />
</template>

<script>
import CountryList from './components/CountryList.vue';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import MainHeader from './components/MainHeader.vue';

library.add(faSearch);

export default {
	name: 'App',
	components: {
		CountryList,
		MainHeader,
	},
};
</script>
