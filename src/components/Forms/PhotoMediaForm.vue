<script setup>
const props = defineProps({ item: {type: Object, required: true} });


const photo = props.item;
const thumbnail = photo?.data_uri || photo?.URL;
</script>

<template>
  <div>
    <h3>Photo</h3>
    <img :src="thumbnail" :alt="photo.description" style="max-width: 100%" />
    <p><strong>Description:</strong> {{ photo.description }} </p>
    <p><strong>Caption:</strong> {{ photo.caption }} </p>
  </div>
</template>
