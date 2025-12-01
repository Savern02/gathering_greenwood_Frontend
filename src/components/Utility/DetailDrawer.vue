<script setup>
import { onMounted, onBeforeMount, ref, computed, watch } from 'vue';
import Drawer from './Drawer.vue'
import BuildingForm from '@Forms/BuildingForm.vue';
import PersonForm from '@Forms/PersonForm.vue';
import DocumentForm from '@Forms/DocumentForm.vue';
import CensusRecordForm from '@Forms/CensusRecordForm.vue';
import StoryForm from '@Forms/StoryForm.vue';
import AudioMediaForm from '@Forms/AudioMediaForm.vue';
import VideoMediaForm from '@Forms/VideoMediaForm.vue';
import PhotoMediaForm from '@Forms/PhotoMediaForm.vue';
import PDFForm from '@Forms/PDFForm.vue';
import ScrollbarCss from '@/styles/scrollbar.module.css';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  category: {
    type: String,
    required: false
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  dialogId: {
    type: String,
    default: 'result-modal'
  }
});

const emit = defineEmits(['update:modelValue', 'close'])

// Internal state for drawer visibility
const detailOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Enhanced item type detection
const detectItemType = (item) => {
  if (!item || typeof item !== 'object') return null;

  try {
    // Check for explicit type field
    if (item.type) {
      // GeoJSON feature detection
      if (item.type === 'Feature') {
        if (item.geometry?.type === 'Polygon' || item.geometry?.type === 'MultiPolygon') {
          return 'buildings';
        }
        if (item.geometry?.type === 'Point') {
          return 'buildings'; // POI buildings
        }
      }
      // Media type detection
      if (['photo', 'video', 'audio'].includes(item.type)) {
        return 'media';
      }
    }

    // Content type detection for documents
    if (item.content_type) {
      return 'documents';
    }

    // City directory person detection (has name, address, profession fields)
    if (item.name && item.address && item.hasOwnProperty('profession and establishment type')) {
      return 'people';
    }

    // Census record detection
    if (item.first_name && item.last_name && (item.birth_year || item.race || item.sex)) {
      return 'census_records';
    }

    // Person record detection (has person-like fields)
    if (item.first_name || item.last_name || item.searchable_name) {
      return 'people';
    }

    // Story/narrative detection
    if (item.story || item.sources || (item.record && item.record.searchable_text !== undefined)) {
      return 'stories';
    }

    // Building with properties detection (POI format)
    if (item.properties && (item.properties.title || item.properties.location_id || item.properties.addresses)) {
      return 'buildings';
    }

    // Building detection (has building-related fields)
    if (item.title || item.location_id || item.addresses || item.building_id) {
      return 'buildings';
    }

    return null;
  } catch (error) {
    console.error('Error in detectItemType:', error);
    return null;
  }
}

const getComponent = computed(() => {
  try {
    const mediaTypes = {
      photo: PhotoMediaForm,
      video: VideoMediaForm,
      audio: AudioMediaForm
    }

    const documentTypes = {
      "application/pdf": PDFForm,
      "image/png": PhotoMediaForm,
      "image/jpeg": PhotoMediaForm,
      "image/gif": PhotoMediaForm,
      "image/webp": PhotoMediaForm,
    }

    const formMap = {
      buildings: BuildingForm,
      people: PersonForm,
      documents: documentTypes[props.item?.content_type] || DocumentForm,
      census_records: CensusRecordForm,
      stories: StoryForm,
      media: mediaTypes[props.item?.type] || PhotoMediaForm
    }

    // Use provided category or auto-detect
    const itemType = props.category || detectItemType(props.item);

    if (!itemType) {
      console.warn('No item type detected for item:', props.item);
      return null;
    }

    const component = formMap[itemType];
    if (!component) {
      console.warn('No component found for item type:', itemType);
      return null;
    }

    return component;
  } catch (error) {
    console.error('Error in getComponent:', error);
    return null;
  }
})

// Enhanced item data processing
const processedItem = computed(() => {
  if (!props.item || typeof props.item !== 'object') return null;

  try {
    const itemType = props.category || detectItemType(props.item);

    // Process GeoJSON features to extract relevant data
    if (props.item.type === 'Feature') {
      if (itemType === 'buildings') {
        // For building features, merge geometry data with properties
        return {
          ...props.item.properties,
          geometry: props.item.geometry,
          coordinates: props.item.geometry?.coordinates,
          // For POI data, flatten nested structures
          ...(props.item.properties?.people && { people: props.item.properties.people }),
          ...(props.item.properties?.stories && { stories: props.item.properties.stories }),
          ...(props.item.properties?.photos && { photos: props.item.properties.photos }),
          ...(props.item.properties?.videos && { videos: props.item.properties.videos }),
          ...(props.item.properties?.audios && { audios: props.item.properties.audios }),
          ...(props.item.properties?.documents && { documents: props.item.properties.documents }),
          ...(props.item.properties?.census_records && { census_records: props.item.properties.census_records }),
        };
      }
    }

    // Return item as-is for other types
    return props.item;
  } catch (error) {
    console.error('Error in processedItem:', error);
    return props.item;
  }
})

</script>
<template>
  <Drawer v-model="detailOpen" position="right" :overlay="true" width="30vw">
    <template v-if="detailOpen && processedItem">
      <div :class="['modal-body', ScrollbarCss.scrollbar]">
        <component
          :is="getComponent"
          :item="processedItem"
          v-if="getComponent"
          :key="`${getComponent.name || 'component'}-${JSON.stringify(processedItem).slice(0, 50)}`"
        />
        <div v-else class="unknown-type-message">
          <h3>Unknown Item Type</h3>
          <p>Category: {{ category || 'Auto-detected' }}</p>
          <p>Detected Type: {{ detectItemType(item) || 'Unknown' }}</p>
          <details>
            <summary>Raw Data</summary>
            <pre>{{ JSON.stringify(item, null, 2) }}</pre>
          </details>
        </div>
      </div>
    </template>
    <template v-else-if="detailOpen">
      <div class="error-message">
        <h3>Error Loading Item</h3>
        <p>Unable to process the provided item data.</p>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
.modal-body {
  height: 85%;
  padding: 1rem;
  overflow-y: auto;
  line-height: 1.5;
  font-size: 0.9rem;
}

.unknown-type-message {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border-left: 4px solid #ffc107;
}

.unknown-type-message h3 {
  margin: 0 0 1rem 0;
  color: #856404;
}

.unknown-type-message p {
  margin: 0.5rem 0;
  color: #6c757d;
}

.unknown-type-message details {
  margin-top: 1rem;
}

.unknown-type-message summary {
  cursor: pointer;
  font-weight: 500;
  color: #495057;
}

.unknown-type-message pre {
  background-color: #f1f3f4;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow-x: auto;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.error-message {
  padding: 1rem;
  background-color: #fee;
  border-radius: 0.5rem;
  border-left: 4px solid #dc3545;
  text-align: center;
}

.error-message h3 {
  margin: 0 0 1rem 0;
  color: #721c24;
}

.error-message p {
  margin: 0;
  color: #721c24;
}

.modal-body :deep(h3) {
  color: var(--gcc-dk-green);
  font-size: 1.1rem;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.modal-body :deep(summary h3),
.modal-body :deep(h4),
.modal-body :deep(h5),
.modal-body :deep(h6) {
  display: inline;
}

.modal-body :deep(h4) {
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.4rem;
}

.modal-body :deep(h5) {
  font-size: 0.95rem;
  margin-top: 0.4rem;
  margin-bottom: 0.3rem;
}

.modal-body :deep(h6) {
  font-size: 0.9rem;
  margin-top: 0.3rem;
  margin-bottom: 0.25rem;
}

.modal-body :deep(p), .modal-body :deep(img) {
  color: var(--gcc-black);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.modal-body :deep(strong) {
  font-weight: 600;
}

.modal-body :deep(details) {
  margin-bottom: 0.75rem;
}

.modal-body :deep(summary) {
  cursor: pointer;
  padding: 0.4rem 0;
  font-weight: 500;
  font-size: 0.95rem;
}

.modal-body :deep(summary:hover) {
  color: var(--gcc-dk-green);
}

.modal-body :deep(hr) {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 1024px) {
  /* On tablets and smaller, make drawer slightly wider */
  .modal-body {
    font-size: 0.85rem;
  }
}

@media (max-width: 640px) {
  /* On mobile, font can be even smaller since drawer is full width */
  .modal-body {
    font-size: 0.8rem;
  }
  
  .modal-body :deep(h3) {
    font-size: 1rem;
  }
  
  .modal-body :deep(h4) {
    font-size: 0.9rem;
  }
}
</style>
