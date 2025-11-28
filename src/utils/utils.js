export const centuryPrefixes = ["16", "17", "18", "19", "20", "21", "22", "23"];

export function findObjectByKey(array, key) {
  return array.find(obj => obj && Object.hasOwn(obj, key));
};

export function isYear(value) {
  const centuryPrefix = value.toString().slice(0, 2);
  if (typeof value === 'number') {
    return (
      value >= 1000 &&
      value <= 9999 &&
      !isNaN(value) &&
      centuryPrefixes.includes(centuryPrefix)
    );
  } else {
    return (
      value.length === 4 &&
      !isNaN(Number(value)) &&
      centuryPrefixes.includes(centuryPrefix)
    );
  }
}

export async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export function titleCase(s) {
  return s.toLowerCase()
          .split(' ')
          .map(word => capitalize(word))
          .join(' ');
};

export function formatRawGeoJson(rawGeoJson, id='search-source', inject_year=null) {
  if (rawGeoJson.type !== 'FeatureCollection') {
    console.warn('Invalid GeoJSON type, expected FeatureCollection.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  };
  if (rawGeoJson.features.length === 0) {
    console.warn('No features found in GeoJSON data.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  };
  if (!rawGeoJson.features.every(feature => feature && feature.type === 'Feature')) {
    console.warn('Some features are not valid GeoJSON features.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  };
  if (!rawGeoJson.features.every(feature => feature.geometry && feature.properties)) {
    console.warn('Some features are missing geometry or properties.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  };
  if (!rawGeoJson.features.every(feature => feature.properties && typeof feature.properties === 'object')) {
    console.warn('Some features have invalid properties, converting to empty object.');
    return { type:'geojson', data: { id: id, type: 'FeatureCollection', features: [] } };
  };

  if(!rawGeoJson.id) {
    rawGeoJson.id = id;
  };
  rawGeoJson.features = rawGeoJson.features.map(feature => {
    if (!feature.properties.year) {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          year: inject_year
        }
      };
    }
    return feature;
  });

  rawGeoJson.features = rawGeoJson.features.filter(feature => {
    if (!feature || !feature.geometry || !feature.properties) {
      console.warn('Skipping invalid feature:', feature);
      return false;
    }
    if (typeof feature.properties !== 'object') {
      console.warn('Feature properties are not an object, converting to empty object:', feature);
      feature.properties = {};
    }
    if (!feature.geometry.type || !['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(feature.geometry.type)) {
      console.warn('Feature geometry type is invalid or missing, skipping:', feature);
      return false;
    }
    if (!feature.geometry.coordinates || !Array.isArray(feature.geometry.coordinates) || feature.geometry.coordinates.some(coord => coord === null || Number.isNaN(coord))) {
      console.warn('Feature geometry coordinates are invalid or missing, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'Point' && feature.geometry.coordinates.length !== 2) {
      console.warn('Point geometry must have exactly two coordinates, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'LineString' && feature.geometry.coordinates.length < 2) {
      console.warn('LineString geometry must have at least two coordinates, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates.length < 1) {
      console.warn('Polygon geometry must have at least one ring, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'MultiPoint' && feature.geometry.coordinates.some(coord => coord.length !== 2)) {
      console.warn('MultiPoint geometry must have coordinates with exactly two values, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'MultiLineString' && feature.geometry.coordinates.some(line => line.length < 2)) {
      console.warn('MultiLineString geometry must have at least two coordinates in each line, skipping:', feature);
      return false;
    }
    if (feature.geometry.type === 'MultiPolygon' && feature.geometry.coordinates.some(polygon => polygon.length < 1)) {
      console.warn('MultiPolygon geometry must have at least one ring in each polygon, skipping:', feature);
      return false;
    }
    return true;
  }).map(feature => {
    if (feature.geometry.coordinates.every(coord => Array.isArray(coord))) {
      feature.geometry.coordinates = feature.geometry.coordinates.map(coords => coords.map(coord => parseFloat(coord)));
    }
    else {
      feature.geometry.coordinates = feature.geometry.coordinates.map(coord => parseFloat(coord));
    }
    return feature;
  });

  console.log(`formatRawGeoJson: Processed ${rawGeoJson.features.length} features`);

  return {
    type: 'geojson',
    data: rawGeoJson
  };
};

export async function delayedAction(func, ms) {
  await sleep(ms); // Wait for ms seconds
  func();
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export function isEmpty(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  };
};

export function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export function uniqueArray(arr) {
  return [...new Set(arr)];
};

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function dedupeByCustomKey(array, keyFunction) {
  return Array.from(
    new Map(array.map(item => [keyFunction(item), item])).values()
  );
}

export function isValidNamedColor(colorName) {
  const style = new Option().style;
  style.color = colorName;
  return style.color !== '';
}

export function extractValuesFromRGB(rgb) {
  return rgb.match(/\b(\d{1,3})\b(?=\s*[,)])/g);
}

export function objectMap(obj, fn) {
  const newObject = {};
  Object.keys(obj).forEach((key) => {
    newObject[key] = fn(obj[key]);
  });
  return newObject;
}

export function objectMapToArray(obj, fn) {
  const array = [];
  Object.keys(obj).forEach((key) => {
    array.push(fn(obj[key]));
  });
  return array;
}

export function convertToE164(phoneNumber, countryCode) {
  // 1. Remove non-numeric characters
  let cleanedNumber = phoneNumber.replace(/\D/g, '');

  // 2. Handle leading zeros for local numbers (if applicable)
  // This step depends on the specific country's numbering plan.
  // For example, in some countries, leading zeros are removed before adding the country code.
  // This example assumes a simple case where leading zeros in the subscriber number are not present
  // or are already handled by the input.

  // 3. Prepend the country code if it's not already present
  if (!cleanedNumber.startsWith(countryCode)) {
    cleanedNumber = countryCode + cleanedNumber;
  }

  // 4. Prepend the '+' sign if it's not already present
  if (!cleanedNumber.startsWith('+')) {
    cleanedNumber = '+' + cleanedNumber;
  }

  return cleanedNumber;
}

const utils = {
  findObjectByKey,
  isYear,
  hashString,
  titleCase,
  formatRawGeoJson,
  delayedAction,
  sleep,
  centuryPrefixes,
  isEmpty,
  debounce,
  copyToClipboard,
  downloadFile,
  uniqueArray,
  capitalize,
  dedupeByCustomKey,
  isValidNamedColor,
  extractValuesFromRGB,
  objectMap,
  objectMapToArray,
  convertToE164
};

export default utils;
