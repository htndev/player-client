import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

import { colors as appColors } from '@/common/colors';
import { Quasar, colors } from 'quasar';
import Vue from 'vue';

Object.entries(appColors).forEach(([brand, color]) => {
  colors.setBrand(brand, color);
});

Vue.use(Quasar, {
  config: {},
  plugins: {}
});
