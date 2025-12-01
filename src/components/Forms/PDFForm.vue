<script setup>
import { ref, watch } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const props = defineProps({ item: {type: Object, required: true} });

const isLoading = ref(true);
const page = ref(1);
const pageCount = ref(0);
const pdfSource = ref(props.item.data_uri);
const showAllPages = ref(false);

function handleDocumentLoad({numPages}) {
  pageCount.value = numPages;
}

function handleDocumentRender() {
  isLoading.value = false;
  if (showAllPages.value) {
    page.value = 1;
  } else {
    page.value = Math.min(page.value, pageCount.value);
  }
}

function handlePasswordRequest() {}

watch(
  () => showAllPages.value,
  (newValue) => {
    page.value = newValue ? null : 1
  }
);
</script>

<template id="appTemplate">
<h3>Document Details</h3>
<p><strong>Title: </strong></p>
<p><strong>Description:</strong> {{ item.description }}</p>

  <div class="app-header">
    <template v-if="isLoading">Loading...</template>

    <template v-else>
      <span v-if="showAllPages">{{ pageCount }} page(s)</span>

      <span v-else>
        <button :disabled="page <= 1" @click="page--">❮</button>
        <span>{{ page }} / {{ pageCount }}</span>
        <button :disabled="page >= pageCount" @click="page++">❯</button>
      </span>

      <label>
        <input id="showAllPages" v-model="showAllPages" type="checkbox">
        <span>Show all pages</span>
      </label>
    </template>
  </div>

  <div class="app-content">
    <vue-pdf-embed
      :source="pdfSource"
      :page="page"
      annotation-layer
      text-layer
      @password-requested="handlePasswordRequest"
      @loaded="handleDocumentLoad"
      @rendered="handleDocumentRender"
    />
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  background-color: #555;
  color: #ddd;
}

.app-header > * {
  display: flex;
  align-items: center;
  gap: 4px;
}

.app-content {
  padding: 24px 16px;
}

.vue-pdf-embed {
  margin: 0 auto;
}

.vue-pdf-embed__page {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}
</style>