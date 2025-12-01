<script setup>

const props = defineProps({ item: {type: Object, required: true} });

const census_records = () => {
  return props.item.properties?.census_records?.sort((a,b) => {
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

function getreadablePersonId(notes) {
  const match = notes?.match(/ID: P-(\d+)/);
  return match ? match[1] : null;
}

function getPersonID(notes) {
  const match = notes?.match(/ID: P-(\d+)/);
  return match ? `P-${match[1]}` : null;
}

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
    return `${ person?.first_name || person?.First_Name } ${person?.middle_name || person?.Middle_Name} ${ person?.last_name || person?.Last_Name } `;
  }
  else {
    return 'Unknown';
  }};

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

</script>

<template>
  <div>
    <h3>Person Details</h3>
    <p><strong>Name:</strong> {{ item.name }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <p><strong>Race:</strong> {{ getRace(item.race) }}</p>
    <p><strong>Gender:</strong> {{ getGender(item.gender) }}</p>
    <p><strong>Age:</strong> {{ item.age }}</p>
    <p><strong>Place of Birth:</strong> {{ item.place_of_birth }}</p>
    <p><strong>Birth Year:</strong> {{ item.birth_year }}</p>
    <p><strong>Census Year:</strong> {{ item.year }}</p>
    <p><strong>Notes:</strong> {{ item.notes }}</p>
    <div v-if="census_records && census_records.length">
      <details>
        <summary><h3>Census Records</h3></summary>
        <details v-for="(record,index) in census_records" :key="getrecordID">
          <summary><h4>{{ searchableName(record) + '(' + record?.age + ')'}}</h4></summary>
          <CensusRecordFields :record=record></CensusRecordFields>
        </details>
      </details>
    </div>
  </div>
</template>

<style scoped>
  details > summary {
    background: var(--gcc-white);
  }

  details {
    background-color: #cca16183;
  }

</style>