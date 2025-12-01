<script setup>

const props = defineProps({ item: {type: Object, required: true} });
</script>

<template>
  <div>
    <h2>Video</h2>
    <p><strong>Description:</strong> {{ item.description }} </p>
    <p><strong>Caption:</strong> {{ item.caption }} </p>
    <p><strong>Description:</strong> <a href="item.URL" target="_blank"> {{ item.URL }}</a> </p>
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