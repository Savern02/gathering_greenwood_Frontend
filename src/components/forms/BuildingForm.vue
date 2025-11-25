<script setup>
import { computed } from 'vue';
import utils from '@utils/utils.js';
import CensusRecordFields from '@FormsPartials/CensusRecordFields.vue';
import InfoWindow from '@Utility/InfoWindow.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({ item: {type: Object, required: true} });

const formatLocation = (location) => {
  // Normalize strings like "[lon, lat]" into arrays
  let coords = location;
  if (typeof location === 'string') {
    try {
      coords = JSON.parse(location);
    } catch {
      return 'Unknown';
    }
  }

  // Only treat numeric coordinate arrays as valid; everything else is unknown
  if (Array.isArray(coords) && coords.length === 2) {
    const numbers = coords.map((coord) => Number(coord));
    if (numbers.every((coord) => Number.isFinite(coord))) {
      return numbers.join(',');
    }
  }
  return 'Unknown';
};


const people = props.item.properties?.people?.sort((a,b) => {
    const nameA = a?.sortable_name?.toUpperCase();
    const nameB = b?.sortable_name?.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}) || [];

const census_records = () => {
  let people_census_ids = people.flatMap(person => person.properties?.census_records?.flatMap(record => record.id));
  return props.item.properties?.census_records?.filter(record => !people_census_ids?.includes(record.id))?.sort((a,b) => {
    const nameA = a?.sortable_name?.toUpperCase();
    const nameB = b?.sortable_name?.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}) || [];
};

const regex = /(?:<pre>)?(?:&lt;|<)i data-poi(?:=?(?:&quot;&quot;|""|\\\\"\\\\")?)?(?:&gt;|>)(?:&lt;\/|<\/)i(?:&gt;|>)(?:<\/pre>)?/gi;

function getRace(raceCode) {
  const raceMap = {
    'W': 'White',
    'B': 'Black',
    'I': 'Native American',
    'A': 'Asian',
    'H': 'Hispanic',
    'O': 'Other'
  };
  return raceMap[raceCode] || 'Unknown';
};

function getGender(genderCode) {
  const genderMap = {
    'M': 'Male',
    'F': 'Female',
    'O': 'Other'
  };
  return genderMap[genderCode] || 'Unknown';
};

const searchableName = (person) => {
  if (person && person?.name) {
    return person?.name;
  }
  else if (person)
  {
    return `${ (person?.first_name || person?.First_Name) || '' } ${ (person?.middle_name || person?.Middle_Name) || '' } ${ (person?.last_name || person?.Last_Name) || '' } `;
  }
  else {
    return 'Unknown';
  }};


function getreadablePersonId(notes) {
  const match = notes?.match(/ID: P-(\d+)/);
  return match ? match[1] : null;
}

function getPersonID(notes) {
  const match = notes?.match(/ID: P-(\d+)/);
  return match ? `P-${match[1]}` : null;
}

function age(person) {
  if (person) {
    if (!person || !person?.Age || person?.age_months == null) {
      return 'N/A';
    }
    if (person?.Age === 0 && person?.age_months === 0) {
      return 'Newborn';
    }
    if (person?.Age < 0 || person?.age_months < 0) {
      return 'N/A';
    }
    if (person?.Age === 0 && person?.age_months > 0) {
      return `${ person?.age_months } months`;
    }
    if (person?.Age > 0 && (person?.age_months === 0 || person?.age_months === '')) {
      return `${ person?.Age } years`;
    }
    if (person?.Age > 0 && person?.age_months > 0) {
      return `${ person?.Age } years, ${ person?.age_months } months`;
    }
    if (person?.Age > 0 && person?.age_months < 0) {
      return `${ person?.Age } years`;
    }
    if (person?.Age < 0 && person?.age_months > 0) {
      return `${ person?.age_months } months`;
    }
    return `N/A`;
  }
  return 'N/A';
};

const rich_description = computed(() => {
  if (!props.item || !props.item?.rich_description) {
    return 'N/A';
  }
  return props.item?.rich_description?.replace(regex, "") || 'N/A';
});

</script>

<template>
  <div>
    <h3>Building Details</h3>
    <InfoWindow v-if="item.confidence_score" :item="item"></InfoWindow>
    <img v-if="item.photo" :src="item.photo" :alt="item.name || item.address" style="max-width: 100%; height: auto; margin-bottom: 1rem;" />
    <p><strong>Name:</strong> {{ item.name || item.address.replaceAll("  "," ") }}</p>
    <p><strong>{{utils.titleCase(item.rich_description_name)}}:</strong><span v-html="rich_description"></span></p>
    <p><strong>Address:</strong> {{ item.address.replaceAll("  "," ") }} </p>
    <p><strong>Location:</strong> {{ formatLocation(item.location) }}</p>
    <div class="people_container" v-if="people.length">
      <h3>Associated People</h3>
      <div v-for="(person,index) in people" :id="getPersonID(person?.notes)" :name="`person`" class="person_accordian" :key="getPersonID(person?.notes) || person?.id">
        <details>
          <summary><h4>{{ searchableName(person) + '( Age: ' + (person?.age || '') + ')' }} </h4></summary>
          <p><strong>Name:</strong> {{ person?.name }}</p>
          <p><strong>Description:</strong> {{ person?.description }}</p>
          <p><strong>Race:</strong> {{ getRace(person?.race) }}</p>
          <p><strong>Gender:</strong> {{ getGender(person?.gender) }}</p>
          <p><strong>Age:</strong> {{ person?.age }}</p>
          <p><strong>Place of Birth:</strong> {{ person?.place_of_birth }}</p>
          <p><strong>Birth Year:</strong> {{ person?.birth_year }}</p>
          <p><strong>Census Year:</strong> {{ person?.year }}</p>
          <p><strong>Notes:</strong> {{ person?.notes }}</p>
          <div v-if="person.properties.census_records && person.properties.census_records.length">
            <h4>Census Records:</h4>
            <details v-for="(record,index) in person.properties.census_records.filter((cr => cr.person_id === person.id))" name="people_census" :key="record.id">
              <summary><h6>{{ searchableName(record) + '(' + (record?.age || '') + ')'}}</h6></summary>
              <CensusRecordFields :record="record"></CensusRecordFields>
            </details>
          </div>
        </details>
      </div>
    </div>
    <hr/>
    <div v-if="census_records.length">
      <h3>Census Records Without Associated People</h3>
      <details v-for="(record,index) in census_records" name="census" :key="getPersonID">
        <summary><h4>{{ searchableName(record) + '(' + (record?.age || '') + ')'}}</h4></summary>
        <CensusRecordFields :record="record"></CensusRecordFields>
      </details>
    </div>
  </div>
</template>

<style scoped>

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  div.person_accordian {
    padding: 1rem;
  }

  div.people_container div:nth-child(odd) {
    background-color: #dbd3c6;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

  summary h4 {
    color: var(--gcc-black);
  }
</style>
