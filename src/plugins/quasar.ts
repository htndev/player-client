import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

// import { Quasar } from 'quasar';
import Quasar, { Notify } from 'quasar';
import Vue from 'vue';

Vue.use(Quasar, {
  config: {},
  plugins: {
    Notify
  }
});
