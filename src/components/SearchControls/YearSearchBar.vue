<script setup>
  import { useTemplateRef } from 'vue';
  import SearchBar from '@Search/Search/SearchBar.vue';
  import YearSelector from '@Search/Year/YearSelector.vue';

  const searchBarRef = useTemplateRef('searchBarRef');

  // Props
  const props = defineProps({
    onYearChange: {
      type: Function,
      required: true
    },
    years: {
      type: Array,
      required: true
    },
    onSearch: {
      type: Function,
      required: true
    },
    suggestions: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['clear']);

  function emitClear() {
    emits('clear');
  }

  function updateYear(year) {
    props.onYearChange(year);
  }

  function passSearch(searchValue) {
    props.onSearch(searchValue);
  }

  defineExpose({
    clearSearch() {
      searchBarRef.value.clearSearch();
    },
  });
</script>


<template>
  <div class="year-search-bar">
    <YearSelector :onYearChange="props.onYearChange" :yearArray="props.years"/>
    <SearchBar ref="searchBarRef" @clear="emitClear" :onSearch="props.onSearch" :suggestions="props.suggestions"/>
  </div>
</template>

<style scoped>
.year-search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  position:absolute;
  right:0;
  padding: 1rem 1rem 3rem 1rem;
  bottom: -2rem;
  border-top-left-radius: 10px;
  background-color: var(--gcc-dk-green);
  z-index: 1;
}
</style>
