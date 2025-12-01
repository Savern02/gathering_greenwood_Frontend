<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({ item: {type: Object, required: true} });

var backendURL = import.meta.env.VITE_BACKEND_HOST;

const fixedURL = `${backendURL}${props.item.URL}`;
</script>

<template>
  <div>
    <h3>Document Details</h3>
    <p><strong>Title: </strong><a :href="fixedURL" target="_blank"> {{ item.name }}</a><FontAwesomeIcon icon="link" style="color:#646cff; margin-left:5px;"></FontAwesomeIcon></p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <img :src="fixedURL" :alt="item.description" style="max-width: 100%" />
  </div>
</template>