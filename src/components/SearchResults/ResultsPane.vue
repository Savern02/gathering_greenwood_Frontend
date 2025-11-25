<script setup>
  import { ref, computed } from 'vue';
  import ResultsCount from '@Results/ResultsCount.vue';
  import ResultsList from '@Results/ResultsList.vue';
  import LastSearch from '@Results/LastSearch.vue';
  import { formatRawGeoJson } from '@utils/utils.js';
  import { ResultsJson, ResultsGeoJson, Status, DetailedResponse, Count } from '@utils/ResponseHandler.js';
  import { useToast } from "vue-toastification";

  const props = defineProps({
    year: {
      type: String,
      required: true
    },
    years: {
      type: Array,
      required: true
    }
  });

  const loading = ref(false);
  const lastSearch = ref('');
  const toast = useToast();

  const categoryOrder = [
    'buildings',
    'people',
    'census_records',
    'documents',
    'media',
    'stories'
  ];

  const orderedResults = computed(() => {
    return categoryOrder.map((key) => {
        const group = results.value ? results.value[key] : null;
        if (group && Array.isArray(group) && group.length > 0 && key !== 'count') {
          return key;
        }
        return null;
      }).filter((key) => key !== null);
  });

  const emit = defineEmits(['update:geojson', 'update:results', 'focus-feature', 'focus-feature-missing']);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;

  const searchTerm = ref('');

  const results = ref(ResultsJson.createEmpty());
  const count = ref(new Count());
  const geojson = ref(ResultsGeoJson.createEmpty());

  const resultsData = ref({});
  const geoData = ref([]);

  const JsonResponse = ref(new DetailedResponse(ResultsJson.createEmpty(), null, Status.Success, null, false));
  const geoJsonResponse = ref(new DetailedResponse(ResultsGeoJson.createEmpty(), null, Status.Success, null, false));
  const filteredJson = ref(ResultsJson.createEmpty());

  function resetState() {
    results.value = ResultsJson.createEmpty();
    count.value = new Count();
    lastSearch.value = '';
  }

  function focusResult(item) {
    if (!item || !geojson.value?.data?.features) return;
    const features = geojson.value.data.features;
    const targetId = item.id != null ? String(item.id) : null;

    // Try to find by id (string-insensitive)
    let feature = features.find((f) => {
      const locId = f?.properties?.location_id;
      const propId = f?.properties?.id;
      return (locId != null && String(locId) === targetId) || (propId != null && String(propId) === targetId);
    });

    // Fallback: match by title/address if ids do not align
    if (!feature && item.address) {
      const targetAddr = item.address.trim();
      feature = features.find((f) => (f?.properties?.title || '').trim() === targetAddr);
    }

    if (feature) {
      emit('focus-feature', feature);
    } else {
      emit('focus-feature-missing', item);
    }
  }

  defineExpose({
    resetState,
    search,
    yearChanged
  });

  function yearChanged(newYear) {
    if (!results.value.isEmpty()) {
      if (newYear !== '') {
        filteredJson.value = (JsonResponse.value.results).filterByYear(newYear);
        results.value = filteredJson.value;
        count.value = filteredJson.value.count.filter((count)=> count.year === newYear)[0];
      } else {
        results.value = JsonResponse.value.results;
        count.value = JsonResponse.value.results.TotalCount();
      }
    }
  }

  async function search(searchValue) {
    loading.value = true;

    if (!searchValue) {
      console.error('No search value provided');
      toast.warning('Please enter a search term.');
      return;
    }

    searchTerm.value = searchValue.search;
    lastSearch.value = searchValue.search;

    try {
      const [resultsRes, geoJsonRes] = await Promise.all([
        fetch(`${backendHost}/api/json?search=${searchTerm.value}`),
        fetch(`${backendHost}/api/search?search=${searchTerm.value}`)
      ]);

      resultsData.value = await resultsRes.json();
      geoData.value = await geoJsonRes.json();

      ResultsJson.fromJson((response) => {
        if (response.status === Status.Success) {
          JsonResponse.value = response;
        } else {
          console.error("Error:", response.error || response.message);
        }
      },resultsData.value)

      ResultsGeoJson.fromJson((response) => {
        if (response.status === Status.Success) {
          geoJsonResponse.value = response;
        } else {
          console.error("Error:", response.error || response.message);
        }
      },geoData.value);

      if (JsonResponse.value.status !== Status.Success ||
          geoJsonResponse.value.status !== Status.Success ||
          JsonResponse.value.isError ||
          geoJsonResponse.value.isError ||
          JsonResponse.value.results === null ||
          geoJsonResponse.value.results === null) {
            console.error('Error fetching results:', JsonResponse.value.error);
            return;
          }

      if (props.year !== '') {
        filteredJson.value = (JsonResponse.value.results).filterByYear(props.year);
        results.value = filteredJson.value;
        count.value = filteredJson.value.count.filter((count)=> count.year === props.year)[0];
      } else {
        results.value = JsonResponse.value.results;
        count.value = JsonResponse.value.results.TotalCount();
      }

      geojson.value = formatRawGeoJson(geoJsonResponse.value.results);
      lastSearch.value = searchTerm.value;

      emit('update:geojson', geojson.value);
      emit('update:results', results.value);
    } catch (err) {
      console.error(err);

      toast.error(`There was an error fetching results: Server is not responding. Please notify Administrator.`);
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="results-pane">
    <LastSearch v-if="!loading && results" :lastSearch="lastSearch" />
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
    </div>
    <ResultsCount v-if="count" :count="count" :loading="loading" />
    <ResultsList
      v-if="!loading && results"
      :results="results"
      :categories="orderedResults"
      @focus="focusResult"
    />
  </div>
</template>

<style scoped>
  .results-pane {
    width: var(--results-width);
    height: var(--results-height);
    background: var(--gcc-white);
    padding: 1rem;
    color: #333;
    overflow-y: hidden;
    border-left: var(--gcc-dk-green) .2rem solid;
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
  }

  .spinner {
    border: 0.25rem solid #eee;
    border-top: 0.25rem solid var(--gcc-orange);
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
