import { createApp, provide } from 'vue';
import './style.css';
import App from './App.vue';
import Toast from "vue-toastification";
import mapboxgl from 'mapbox-gl';
import "vue-toastification/dist/index.css";

/* import the fontawesome core */
import { library, config } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faSearch }           from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faBuilding }         from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faUser }             from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faFileAlt }          from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faDatabase }         from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faBook }             from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faImage }            from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faVideo }            from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faVolumeHigh }       from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faHouse }            from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faQuestion }         from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faLink }             from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faTimes }            from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faChurch }           from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faLocationDot }      from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faIndustry }         from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faStore }            from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faCircleHalfStroke } from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faAdjust }           from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faFilePdf }          from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faFileWord }         from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faFileExcel }        from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faFileImage }        from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faFileVideo }        from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faFileAudio }        from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faFileText }         from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faCircleInfo }       from '@awesome.me/kit-45e7af7a78/icons/classic/regular';
import { faStar }             from '@awesome.me/kit-45e7af7a78/icons/duotone/regular';

/* add icons to the library */
library.add(faSearch,
  faBuilding,
  faUser,
  faFileAlt,
  faDatabase,
  faBook,
  faImage,
  faVideo,
  faVolumeHigh,
  faHouse,
  faQuestion,
  faLink,
  faTimes,
  faChurch,
  faLocationDot,
  faIndustry,
  faStore,
  faCircleHalfStroke,
  faAdjust,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileText,
  faCircleInfo,
  faStar);

const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
};

config.familyDefault = 'classic';
config.styleDefault = 'regular';

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(Toast, toastOptions)
  .provide('mapboxgl', mapboxgl)
  .mount('#app');
