<script setup>
  import { ref, computed, watch } from 'vue';
  import { ResultsJson } from '@utils/ResponseHandler.js';
  import ScrollbarCss from '@/styles/scrollbar.module.css';
  import SearchResult from '@Results/SearchResult.vue';

  const props = defineProps({
    results: {
      type: ResultsJson,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  });

  const emit = defineEmits(['focus']);

  function formatCategory(key) {
    //var key = Object.keys(results.value)[index];
    return key === 'narratives' ? 'Stories' : key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
  }
</script>

<template>
  <div :class="['results-list', ScrollbarCss.scrollbar]" role="list" aria-label="Search results">

  <!-- Iterate through the properties of the object -->
  <template v-for="(category) in categories" :key="category">
    <!-- Output the property name -->
    <section role="group" :aria-labelledby="formatCategory(category)+'_label'">
      <h4 :id="formatCategory(category)+'_label'" class="category-title">
        {{ formatCategory(category) }}
      </h4>
      <ul class="fa-ul">
        <SearchResult
          v-for="item in results[category || '']"
          :key="item?.id || item?.name || item?.description || item?.story?.name"
          :item="item"
          :category="category"
          @focus="emit('focus', $event)"
        ></SearchResult>
      </ul>
    </section>
  </template>

  </div>
</template>

<style scoped>
  .fa-ul {
    --fa-li-margin: 3rem;
    margin-block-start: 0.5rem;
    margin-block-end: 0.5rem;
  }

.results-list {
    margin-top: 1rem;
    padding: 0.5rem;
    height: 75%;
    overflow-y: scroll;
    border-radius: 0.5rem;
  }

  .category-title {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    font-size: 1rem;
    text-align: start;
    padding-bottom: 0.25rem;
  }

</style>
