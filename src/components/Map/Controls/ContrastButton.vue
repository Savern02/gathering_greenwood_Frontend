<script setup>
import { onMounted, useTemplateRef, ref, inject } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CustomControl from '@CustomControls/CustomControl.vue';

const control = useTemplateRef('control');

const contrast = ref(false);

const map = inject('map');

function onClick() {
  contrast.value = !contrast.value;
  if (contrast.value) {
    map.value.setPaintProperty('land','fill-color','rgba(255, 255, 255, 1)');
    map.value.setPaintProperty('roads_tertiary','line-color',['interpolate',['linear'],['zoom'],10,'rgba(240, 240, 240, 1)',12,'#ffffff']);
    map.value.setPaintProperty('roads_tertiarybridgetop_construction','line-color',['interpolate',['linear'],['zoom'],10,'rgba(217, 217, 217, 1)',11,'#ffffff']);
    map.value.setPaintProperty('roads_secondarybridgetop','line-color',['interpolate',['linear'],['zoom'],10,'rgba(217, 217, 217, 1)',11,'#ffffff']);
    map.value.setPaintProperty('roads_tertiarybridgetop','line-color',['interpolate',['linear'],['zoom'],10,'rgba(217, 217, 217, 1)',11,'#ffffff']);
    map.value.setPaintProperty('roads_residential','line-color','#ffffff');
    map.value.setPaintProperty('landuse_areas_z12_localized_land_use','fill-color', ['interpolate',['linear'],['zoom'],0,['match',['get','type'],'railway','rgba(214, 214, 214, 1)','transparent']]);
    //map.value.setStyle('https://www.openhistoricalmap.org/map-styles/main/main.json');
  } else {
    //map.value.setStyle('/historic.json');
    map.value.setPaintProperty('land','fill-color','rgba(242, 216, 191, 1)');
    map.value.setPaintProperty('roads_tertiary','line-color',['interpolate',['linear'],['zoom'],10,'#EEE',12,'#EEE']);
    map.value.setPaintProperty('roads_tertiarybridgetop_construction','line-color',['interpolate',['linear'],['zoom'],10,'rgba(217, 217, 217, 1)',11,'#EEE']);
    map.value.setPaintProperty('roads_secondarybridgetop','line-color',['interpolate',['linear'],['zoom'],10,'rgba(217, 217, 217, 1)',11,'#EEE']);
    map.value.setPaintProperty('roads_tertiarybridgetop','line-color',['interpolate',['linear'],['zoom'],10,'rgba(217, 217, 217, 1)',11,'#EEE']);
    map.value.setPaintProperty('roads_residential','line-color','#EEE');
    map.value.setPaintProperty('landuse_areas_z12_localized_land_use','fill-color', ['interpolate',['linear'],['zoom'],0,['match',['get','type'],'railway','rgba(224, 224, 224, 1)','transparent']]);
  }
}

onMounted(() => {

});

const controlType = 'contrast';

// Expose the onAdd and onRemove methods for Mapbox GL JS
defineExpose({
  onAdd () {
    return control.value.onAdd(map);
  },
  onRemove () {
    return control.value.onRemove(map);
  }
});
</script>

<template>
  <CustomControl
    ref="control"
    :position="'bottom-right'"
    :prepend="false"
    :prependParentId="null"
    :group="false"
    :customControlType="controlType">
    <button @click="onClick" :class="['custom-mapbox-contrast', $attrs.class]">
      <FontAwesomeIcon icon="circle-half-stroke"></FontAwesomeIcon>
    </button>
  </CustomControl>
</template>

<style scoped>

div.mapboxgl-ctrl-custom button.custom-mapbox-contrast:hover, div.mapboxgl-ctrl-custom button.custom-mapbox-contrast:active {
  background-color: var(--gcc-beige);
  box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.2);
}

div.mapboxgl-ctrl-custom button.custom-mapbox-contrast {
  background: var(--gcc-dk-green);
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
  border-radius: var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius);
  font-size: 2rem;
  width: 3rem;
  height: 5rem;
  padding: 0;
}
</style>
