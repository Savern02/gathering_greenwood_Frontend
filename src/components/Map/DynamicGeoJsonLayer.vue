<script setup>
  import { computed, onMounted, onUnmounted, ref, inject } from 'vue';
  import { MglGeojsonLayer, MglPopup } from 'vue-mapbox3';
  import FeatureModal from '@Modals/FeatureModal.vue';
  import utils from '@utils/utils.js';
import DetailDrawer from '../Utility/DetailDrawer.vue';

  const props = defineProps({
    geojson: {
      type: Object,
      required: true,
      validator: (val) =>
        val && typeof val === 'object' &&
        val.type === 'geojson' &&
        val.data && typeof val.data === 'object' &&
        val.data.type === 'FeatureCollection' &&
        Array.isArray(val.data.features) &&
        val.data.features.length >= 0,
    },
    type: {
      type: String,
      required: true,
      validator: val => ['fill', 'line', 'circle', 'symbol'].includes(val)
    },
    paint: {
      type: Object,
      default: () => ({}),
      validator: val => typeof val === 'object' &&
        Object.keys(val).length > 0 &&
        Object.values(val).every(value => typeof value === 'string' ||
          typeof value === 'number'||
          typeof value === 'boolean')
    },
    layout: {
      type: Object,
      default: () => ({}),
      validator: val => typeof val === 'object' &&
        Object.keys(val).length > 0 &&
        Object.values(val).every(value => typeof value === 'string' ||
          typeof value === 'boolean')
    },
    layerId: {
      type: String,
      default: () => `layer-${Math.random().toString(36).slice(2)}`
    },
    filterYear: {
      type: String,
      default: ''
    },
    map: {
      type: Object,
      required: true,
      validator: val => val && typeof val === 'object' && 'on' in val && 'off' in val
    },
    featureFormatter: {
      type: Function,
      default: (feature) => feature
    },
    searchTerm: {
      type: String,
      default: ''
    }
  })

  const mapboxgl = inject('mapboxgl');

  const emit = defineEmits(['drawer-closed']);

  defineExpose({
    fitMapToMarkers,
  });

  function fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();

    // Get the features from the source
    const features = props.map.querySourceFeatures(props.geojson.data.id, {
      sourceLayer: props.layerId // If using vector tiles, specify the source layer
    });

    // Extend the bounds for each feature
    for (const feature of features) {
      if (feature.geometry.type === 'Point') {
        bounds.extend(feature.geometry.coordinates);
      }
    }

    // Fit the map to the calculated bounds
    props.map.fitBounds(bounds, {
      padding: 200
    });
  }

  const clickedfeature = ref({id:0, properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } });

  const detailRef = ref(null);
  const showDrawer = ref(false);

  // Handle drawer close - emit event to parent to clear search and reset map
  function handleDrawerClose() {
    emit('drawer-closed');
  }

  // Conditionally apply filter based on string year
  const layerDefinition = computed(() => {
    const includeSearch = props.layerId.includes("search");
    const YearExemptLayers = ['1920-burned-area-layer', 'poi-layer', 'poi-footprints-layer', '1920-street-layer', '1920-building-layer', 'search-layer'];
    const hasYear = props.filterYear && utils.isYear(props.filterYear);
    const hasSearchTerm = !!props.searchTerm && includeSearch;

    const filterParts = ['all'];

    const isYearExempt = YearExemptLayers.includes(props.layerId);

    if (hasYear && !isYearExempt) {
      filterParts.push(['==', ['get', 'year'], props.filterYear === "" ? "" : Number.parseInt(props.filterYear)]);
    }

    if (hasSearchTerm) {
      filterParts.push(['in', props.searchTerm.toLowerCase(), ['get', 'searchable_text']]);
    }

    const filter = filterParts;

    return {
      id: props.layerId,
      type: props.type,
      paint: props.paint,
      layout: props.layout,
      filter: filter,
    }
  })


// Popup state
const popupCoords = ref(null);
const popupProps = ref(null);


  function showDetails() {
    // modalRef.value?.openDialog();
    // modalHidden.value = false;
    showDrawer.value = true;
  }


  onMounted(() => {
    props.map.on('click', props.layerId, handleClick); // Attach click listener to the layer
  })

  onUnmounted(() => {
    props.map.off('click', props.layerId, handleClick); // Clean up click listener
  })

  function validateJsonData(json) {
    if (!json || !json.data || !json.data.features || !Array.isArray(json.data.features)) {
      console.warn('Invalid GeoJSON data, expected an object with a features array.');
      return { type:'geojson', data: { id: data.id, type: 'FeatureCollection', features: [] } };
    }
    if (!json.data.id || typeof json.data.id !== 'string') {
      console.error('GeoJSON data is missing a valid id');
      return;
    }
    return json;
  }

  async function handleClick(e) {
    if (!e || !e.features || e.features.length === 0) return;
    if (e.features.length > 1) {
      console.warn('Multiple features clicked, only the first will be processed.');
    }
    if (!e.features[0].properties) {
      console.warn('Clicked feature has no properties, skipping.');
      return;
    }
    if (!props.featureFormatter || typeof props.featureFormatter !== 'function') {
      console.warn('featureFormatter is not a valid function, using default formatter.');
      props.featureFormatter = (feature) => feature;
    }
    // Wait for feature to be fully formatted (includes API calls for POI details)
    const formattedFeature = await props.featureFormatter(e.features[0]);

    // Verify we have valid data before proceeding
    if (!formattedFeature || !formattedFeature.properties) {
      console.warn('Feature formatter returned invalid data - skipping drawer open');
      return;
    }

    // Only set clickedfeature if we have complete, valid data
    clickedfeature.value = formattedFeature;

    // Get center coordinates based on geometry type
    const geomType = clickedfeature.value.geometry?.type;
    const coords = clickedfeature.value.geometry?.coordinates;
    let centerCoords;

    if (geomType === 'Point' && Array.isArray(coords) && coords.length === 2) {
      // Point geometry - use coordinates directly
      centerCoords = coords;
    } else if (geomType === 'Polygon' && Array.isArray(coords) && coords[0] && coords[0][0]) {
      // Polygon geometry - calculate centroid
      const points = coords[0]; // Get outer ring
      let sumLng = 0, sumLat = 0;
      for (const point of points) {
        sumLng += point[0];
        sumLat += point[1];
      }
      centerCoords = [sumLng / points.length, sumLat / points.length];
    } else {
      console.warn('Unknown geometry type or invalid coordinates:', geomType);
      return;
    }

    // Fly to location first
    props.map.flyTo({
      center: centerCoords,
      zoom: geomType === 'Polygon' ? 18 : 16,
      speed: 1.2,
      curve: 1.5,
      easing: (t) => t
    });

    // Wait for map animation to complete AND ensure data is ready
    await utils.delayedAction(() => {
      // Double-check data is still valid before opening
      if (clickedfeature.value && clickedfeature.value.properties) {
        showDetails();
      } else {
        console.warn('Clicked feature data lost before drawer opened');
      }
    }, 1300);
  }

  function openPopup()
  {
    popupCoords.value = clickedfeature.value.geometry.coordinates;
  }
</script>

<template>
  <MglGeojsonLayer
    :layerId="layerId"
    :source-id="geojson.data.id"
    :source="validateJsonData(geojson)"
    :reactive="true"
    :layer="layerDefinition"
  />
   <!-- Popup for selected feature -->
  <!-- <MglPopup :coordinates="popupCoords" anchor="bottom" @close="popupCoords = null">
    <div @click="{ detailRef.value?.openDialog; }">
      <strong>{{ popupProps?.name || popupProps?.description }}</strong><br>
      <small>{{ popupProps?.type || 'Feature' }}</small>
    </div>
  </MglPopup> -->
  <!-- <slot name="modal" :feature="clickedfeature" />
  <slot /> -->
  <DetailDrawer
    v-if="clickedfeature"
    :item="clickedfeature"
    v-model="showDrawer"
    @close="handleDrawerClose"/>
  <!-- <FeatureModal
    v-if="clickedfeature"
    :feature="clickedfeature"
    ref="detailRef"/> -->

</template>
