<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import objectHash from 'object-hash';

// Props
const props = defineProps({
  onYearChange: {
    type: Function,
    required: true
  },
  yearArray: {
    type: Array,
    required: true
  }
});

const years = ref([]);

const selected = ref("");

function buildYears() {
  years.value = props.yearArray.map((year, index) => {
    return {
      ...year,
      inputid: `input-${index + 1}`,
      labelid: `label-${index + 1}`,
      value: year.year,
      key: objectHash(year),
    };
  });

  // Add "Current" only once
  const currentObj = {
    year: `Current`,
    inputid: `input-${years.value.length + 1}`,
    labelid: `label-${years.value.length + 1}`,
    value: '',
    key: objectHash({ year: 'Current' }),
  };
  years.value.push(currentObj);
}

const clickedElement = ref(null);

onBeforeMount(() => {
  buildYears();
});

  onMounted(() => {
    // Set the default year to 1920 (where the actual census data is)
    const defaultYear = "1920";
    selected.value = defaultYear;
    var selector = `input[value="${defaultYear}"]`;
    var el = document.querySelector(selector);
    setYear(defaultYear, { target: el });
  });

// Function to set the year
function setYear(year, event) {
  console.log('🎯 YearSelector.setYear called with:', {
    year,
    yearType: typeof year,
    eventTargetValue: event.target?.value,
    eventTargetId: event.target?.id
  });

  // Remove the class from the previously clicked element
  if (clickedElement.value) {
    clickedElement.value.removeAttribute('checked');
    document.querySelector(`label[for="${clickedElement.value.id}"]`).classList.remove('selected');
  }

  // Update the selected year
  selected.value = year;

  // Store the clicked element
  clickedElement.value = event.target;

  // Add a class to the clicked element
  clickedElement.value.setAttribute('checked', '');

  document.querySelector(`label[for="${clickedElement.value.id}"]`).classList.add('selected');

  // Call the function passed from the parent to set the year
  console.log('  ➡️  Calling onYearChange with:', year);
  props.onYearChange(year);
}

const step = computed(() => {
  return years.value.length > 1 ? 100 / (years.value.length - 1) : 0;
});

const selectedIndex = computed(() =>
  years.value.findIndex(year => year.value === selected.value)
);

const lineWidth = computed(() => {
  return `${selectedIndex.value * step.value}%`;
});

</script>

<template>
    <div class="year-selector">
      <input v-for="year in years" type="radio" name="year" :id="year.inputid" :value="year.value" :key="year.key" @change="setYear($event.target.value, $event)"></input>
      <div class="content">
        <div class="timeline">
          <label class="timeline-dot" v-for="year in years" :for="year.inputid" :key="year.key">
            <span :id="year.labelid">{{ year.year }}</span>
          </label>
          <div class="timeline-line" :style="{ '--line-width': lineWidth }"></div>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  .year-selector {
    position: relative;
    user-select: none;
    width: 30rem;
    height: 4rem;
    max-width: 100%;
    margin-left: 3rem;
    z-index: 1000;
  }

  .year-selector .content {
    display: flex;
  }

  .year-selector .timeline {
    position: absolute;
    bottom: 0;
    right: 5rem;
    left: 0;
    height: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .year-selector .timeline-line {
    position: absolute;
    top: 50%;
    margin-top: -1px;
    width: 100%;
    height: 0.3rem;
    background: #827B68;
  }

  .year-selector .timeline-line:before {
    content: "";
    position: absolute;
    left: 0;
    width: 0%;
    height: 100%;
    background: var(--gcc-orange);
    width: var(--line-width, 0%);
    transition: width 100ms ease;
  }

  .year-selector .timeline-dot {
    position: relative;
    z-index: 1;
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #827B68;
    background: var(--gcc-orange);
    transition: 100ms ease all;
  }

  .year-selector .timeline-dot.selected {
    background: var(--gcc-white);
  }

  .year-selector .timeline-dot span {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 1.25rem;
    color: #959595;
    transition: color 100ms ease, font-size 100ms ease;
  }

  .year-selector .timeline-dot.selected span {
    color: var(--gcc-white);
    font-size: 1.5rem;
    font-weight: 600;
  }

  input {
    position: absolute;
    left: -9999px;
  }
  </style>
