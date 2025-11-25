<script setup>
  import { computed, ref, useId } from 'vue';
  import ListItem from '@Utility/ListItem.vue';
  import ResultModal from '@Modals/ResultModal.vue';
  import DetailDrawer from '../Utility/DetailDrawer.vue';

  const props = defineProps({
    item: Object,
    category: String
  });

  const emit = defineEmits(['focus']);

  const modalRef = ref(null);

  const modalHidden = ref(true);
  const showDrawer = ref(false);

  const thisId = useId();

  const modalId = computed(() => {
    return `result-modal-${props.category}-${thisId}`;
  });

  function showDetails() {
    // modalRef.value?.openDialog();
    // modalHidden.value = false;
    showDrawer.value = true;
    emit('focus', props.item);
  }

  function modalClose() {
    modalHidden.value = true;
  }

  const icon = computed(() => {
    switch (props.category.toLowerCase()) {
      case 'buildings':
        switch (props.item.building_types.toLowerCase()) {
          case 'public': return 'building';
          case 'residential': return 'house';
          case 'religious': return 'church';
          case 'marker': return 'location-dot';
          case 'commercial': return 'industry'; //'store'?
          default: return 'building';
        }
      case 'people': return 'user';
      case 'documents':
        switch (props.item.category) {
          case 'census_record': return 'database';
          default:
            switch (props.item.content_type) {
              case 'application/pdf': return 'file-pdf';
              case 'image/png': return 'file-image';
              case 'image/jpeg': return 'file-image';
              case 'image/gif': return 'file-image';
              default: return 'file-alt';
            }
        }
      case 'census_records': return 'database';
      case 'stories': return 'book';
      case 'media':
        switch (props.item?.type) {
          case 'photo': return 'image';
          case 'video': return 'video';
          case 'audio': return 'volume-high';
        }
      default: return 'file-alt';
    }
  });

  function formatKey(key, val) {
    if (key === 'media') return 'media';
    if (key === 'people') return val === 1 ? 'person' : 'people';
    if (key === 'stories') return val === 1 ? 'story' : 'stories';
    if (val === 1 && key.endsWith('s')) return key.slice(0, -1);
    // Convert to lowercase and replace underscores or dashes with spaces
    return key.toLowerCase().replace(/_|-/g, ' ');
  }
</script>

<template>
  <ListItem class="search-result"
    @click="showDetails"
    aria-haspopup="dialog"
    :aria-controls="modalId"
    @keydown.enter="showDetails"
    @keydown.space.prevent="showDetails"
    :icon="icon"
    :iconTitle="formatKey(category, 1)+' result-'+ thisId">
    {{ item?.name || item?.description || item?.caption || item?.story?.name }}
    <DetailDrawer v-model="showDrawer" :item="item" :category="category" />
    <!-- <ResultModal ref="modalRef" :aria-hidden="modalHidden" :dialogId="modalId" @close="modalClose" :item="item" :category="category" /> -->
  </ListItem>
</template>

<style scoped>
  .search-result {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    cursor: pointer;
  }
  .icon {
    margin-right: 0.5rem;
  }

  @media screen and (max-width: 1600px) {
    .search-result {
      font-size: 1.5rem;
    }
  }

  button {
    --fa-li-margin: 3rem;
    border-radius: unset;
    background: none;
    border: none;
    display: flex;
    width: 100%;
    padding: 0;
    cursor: pointer;
    appearance: auto;
    position: relative;
    text-align: -webkit-match-parent;
    unicode-bidi: isolate;
    font-style: normal;
    font-variant-ligatures: normal;
    font-variant-caps: normal;
    font-variant-numeric: normal;
    font-variant-east-asian: normal;
    font-variant-alternates: normal;
    font-variant-position: normal;
    font-variant-emoji: normal;
    font-stretch: 100%;
    font-size: 2rem;
    font-weight: 400;
    font-family: Poppins, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-optical-sizing: auto;
    font-size-adjust: none;
    font-kerning: auto;
    font-feature-settings: normal;
    font-variation-settings: normal;
    text-rendering: optimizeLegibility;
    color: #333;
    letter-spacing: normal;
    word-spacing: 0px;
    line-height: 1.5;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    box-sizing: content-box;
    margin: 0em;
    padding-block: 8px;
    padding-inline: 0px;
    transition: none;
  }
</style>
