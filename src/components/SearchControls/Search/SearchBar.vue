<script setup>
  import { ref, onMounted, onUpdated, watch } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  const searchValue = ref({});
  const input = ref('');
  const lastSearch = ref('');
  const showSuggestions = ref(false);
  const userHasInteracted = ref(false);

  const props = defineProps({
    onSearch: {
      type: Function,
      required: true
    },
    suggestions: {
      type: Array,
      default: () => []
    }
  });

  const datalistId = 'search-suggestions';

  function doSearch() {
    if (!input.value.trim()) return;
    searchValue.value = {
      search: input.value,
    };
    props.onSearch(searchValue.value);
  }

  defineExpose({
    clearSearch
  });

  const emits = defineEmits(['clear']);

  function clearSearch() {
      input.value = '';
      searchValue.value = {};
      showSuggestions.value = false;
      userHasInteracted.value = false;
  }

  function handleInputChange(event) {
    // Handle input changes if needed
  }

  // Watch for when input is cleared (including via native clear button)
  watch(input, (newValue, oldValue) => {
    if (oldValue && !newValue) {
      // Input was cleared
      searchValue.value = {};
      emits('clear');
    }
  });

  function handleFocus() {
    // Only show suggestions if user has actually interacted with the input
    if (userHasInteracted.value) {
      showSuggestions.value = true;
    }
  }

  function handleClick() {
    // Mark that user has interacted and show suggestions
    userHasInteracted.value = true;
    showSuggestions.value = true;
  }

  function handleBlur() {
    // Slight delay so clicks on suggestions still register
    setTimeout(() => showSuggestions.value = false, 150);
  }

  function chooseSuggestion(suggestion) {
    input.value = suggestion;
    showSuggestions.value = false;
    doSearch();
  }

  function handleSearchClear(event) {
    // Native search clear button was clicked
    // The watcher will handle emitting the clear event
  }

  // Component Lifecycle Hooks
  onMounted(() => {
    document.getElementById('search-input').focus();
  });

  onUpdated(() => {
    document.getElementById('search-input').focus();
  });
</script>

<template>
  <div class="search-bar" role="search">
    <span class="input-group">
      <div class="input">
        <input
          v-model="input"
          id="search-input"
          @keyup.enter.native="doSearch"
          @onChange="handleInputChange"
          @search="handleSearchClear"
          :list="datalistId"
          @click="handleClick"
          @focus="handleFocus"
          @blur="handleBlur"
          aria-description="search results will appear above"
          type="search"
          placeholder="Search..."
          required
          autocomplete="on"
        />
        <datalist :id="datalistId">
          <option v-for="suggestion in props.suggestions" :key="suggestion" :value="suggestion" />
        </datalist>
        <ul
          v-if="showSuggestions && props.suggestions.length"
          class="suggestions"
          role="listbox"
        >
          <li
            v-for="suggestion in props.suggestions"
            :key="suggestion"
            role="option"
            @mousedown.prevent="chooseSuggestion(suggestion)"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
      <button id="search-button" @click="doSearch" @keyup.enter="doSearch" aria-label="search">
        <FontAwesomeIcon icon="search" transform="grow-20 right-4" title="Perform Search"/>
      </button>
    </span>
  </div>
</template>

<style scoped>
    .search-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }

    .input-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 0 1rem 1rem;
      background-color: var(--gcc-dk-green);
      position: relative;
    }

    .input {
      padding-top: 0.1rem;
      padding-bottom: 0.1rem;
      padding-left: 0.3rem;
      padding-right: 0.3rem;
      display: inline-block;
      border-radius: 0.625rem;
      position: relative;
    }

    .input input {
      background-color: var(--gcc-white);
      border-radius: 0.625rem;
      border: none;
      color: var(--gcc-dk-green);
      padding: 0.2rem 0rem 0.2rem 0.5rem;
      font-size: 1rem;
      text-indent: 0.5rem;
    }

    /* Style the native search clear button */
    input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: searchfield-cancel-button;
      cursor: pointer;
      margin-right: 0.5rem;
    }

    /* For Firefox */
    input[type="search"]::-moz-search-clear-button {
      cursor: pointer;
    }

    .suggestions {
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      background: var(--gcc-white);
      color: var(--gcc-dk-green);
      border: 1px solid var(--gcc-dk-green);
      border-radius: 0.5rem;
      margin: 0 0 0.25rem 0;
      padding: 0.25rem 0;
      list-style: none;
      max-height: 14rem;
      overflow-y: auto;
      z-index: 100000;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    }

    .suggestions li {
      padding: 0.4rem 0.75rem;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .suggestions li:hover,
    .suggestions li:focus {
      background: var(--gcc-v-lt-green);
    }

    button#search-button {
      flex-shrink: 0;
      background: none;
      border-radius: unset;
      border: none;
      cursor: pointer;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(0.2rem);
    }
</style>
