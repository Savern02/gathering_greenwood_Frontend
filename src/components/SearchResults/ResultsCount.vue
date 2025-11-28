<script setup>
  import { computed } from 'vue';
  import { Count } from '@utils/ResponseHandler.js';

  const props = defineProps({
    count: {
      type: Count,
      required: true,
    },
    loading : {
      type: Boolean,
      default: false,
    },
  });

  function formatKey(key, val) {
    if (key === 'media') return 'media';
    if (key === 'people') return val === 1 ? 'person' : 'people';
    if (key === 'stories') return val === 1 ? 'story' : 'stories';
    if (val === 1 && key.endsWith('s')) return key.slice(0, -1);
    // Convert to lowercase and replace underscores or dashes with spaces
    return key.toLowerCase().replace(/_|-/g, ' ');
  }

  const displayItems = computed(() => {
    return props.count
      ? Object.entries(props.count)
          .filter(([key, val]) => key !== 'year' && key !== 'totalFlag' && val > 0)
          .map(([key, val]) => `${val} ${formatKey(key, val)}`)
      : [];
  });
</script>

<template>
  <div v-if="!loading" class="results-count">
    <span v-if="count && displayItems.length">{{ displayItems.join(', ') }}</span>
    <span v-else>No results</span>
  </div>
</template>

<style scoped>
  .results-count {
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: bold;
    color: var(--gcc-dk-green);
    font-style: italic;
  }

</style>