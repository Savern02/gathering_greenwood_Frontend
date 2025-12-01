<script setup>

const props = defineProps({ item: {type: Object, required: true} });
</script>

<template>
  <div>
    <h2>Story</h2>
    <p><strong>Story:</strong> <span v-html="item.story.body"></span> </p>
    <p><strong>Sources:</strong> <span v-html="item.sources.body"></span></p>
  </div>
</template>

<style scoped>
  h2 {
    color: var(--gcc-dk-green);
  }

  p {
    color: var(--gcc-black);
  }
</style>