<script setup>

const props = defineProps({ record: {type: Object, required: true} });

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

function buildCensusScope(record) {
  if (!record) {
    return 'N/A';
  }

  if (!record.census_scope) {
    return `Ward ${record.Ward} ED ${record.enum_dist} Sheet ${record.page_number}${record.page_side} #${record.line_number}`
  }

  return record.census_scope;
}
</script>

<template>
  <p><strong>Age:</strong> {{ age(record) }}</p>
  <p><strong>Gender:</strong> {{ record?.sex || 'N/A' }}</p>
  <p><strong>Race:</strong> {{ record?.race || 'N/A' }}</p>
  <p><strong>Primary Language Spoken:</strong> {{ record?.mother_tongue || 'N/A' }}</p>
  <p><strong>Marital Status:</strong> {{ record?.marital_status || 'N/A' }}</p>
  <p><strong>Foreign Born:</strong> {{ record?.foreign_born || 'N/A' }}</p>
  <p><strong>Naturalized:</strong> {{ record?.naturalized_alien || 'N/A' }}</p>
  <p><strong>Year Immigrated:</strong> {{ record?.year_immigrated || 'N/A' }}</p>
  <p><strong>Birthplace:</strong> {{ record?.pob || 'N/A' }}</p>
  <p><strong>Education:</strong> {{ record?.education || 'N/A' }}</p>
  <p><strong>Attended School:</strong> {{ record?.attended_school || 'N/A' }}</p>
  <p><strong>Can Read:</strong> {{ record?.can_read || 'N/A' }}</p>
  <p><strong>Can Write:</strong> {{ record?.can_write || 'N/A' }}</p>
  <p><strong>Can Speak English:</strong> {{ record?.can_speak_english || 'N/A' }}</p>
  <p><strong>Employment:</strong> {{ record?.employment || 'N/A' }}</p>
  <p><strong>Occupation:</strong> {{ record?.occupation || 'N/A' }}</p>
  <p><strong>Industry:</strong> {{ record?.industry || 'N/A' }}</p>
  <p><strong>Institution:</strong> {{ record?.institution || 'N/A' }}</p>
  <p><strong>Relationship To Head of Household:</strong> {{ record?.relation_to_Head || 'N/A' }}</p>
  <p><strong>Home Owned or Rented:</strong> {{ record?.home_owned_rented || 'N/A' }}</p>
  <p><strong>Farm Schedule No.:</strong> {{ record?.farm_schedule_no_ || 'N/A' }}</p>
  <p><strong>Mortgage:</strong> {{ record?.mortgage || 'N/A' }}</p>
  <p><strong>Father's Birthplace:</strong> {{ record?.pob_father || 'N/A' }}</p>
  <p><strong>Father's Language:</strong> {{ record?.mother_tongue_father || 'N/A' }}</p>
  <p><strong>Mother's Birthplace:</strong> {{ record?.pob_mother || 'N/A' }}</p>
  <p><strong>Mother's Language:</strong> {{ record?.mother_tongue_mother || 'N/A' }}</p>
  <p><strong>Census Scope</strong> {{ buildCensusScope(record) || 'N/A' }}</p>
</template>