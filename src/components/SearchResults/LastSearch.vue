<script setup>

defineProps({
	lastSearch: {
		type: String,
		default: ''
	}
});
</script>

<template>
	<div><span v-if="lastSearch" class="search-label">Results for "{{ lastSearch }}"</span></div>
</template>

<style scoped>
  div {
    display:flex;
  }

	.search-label {
      margin-right: auto;
      font-size: 1rem;
      font-weight: 700;
      color: #000000;
      background-color: var(--gcc-v-lt-green);
      background: radial-gradient(ellipse, rgba(114,169,127,0.6) 30%, rgba(114,169,127,0.02) 99%);
      flex-grow: 1;
      padding: 1rem;
      letter-spacing: 0.5px;
    }
</style>