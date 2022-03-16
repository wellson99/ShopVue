import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#EF5350',
        background: '#BDBDBD',
        // secondary: '#b0bec5',
        // anchor: '#8c9eff',
      },
    },
  },
})

export default vuetify
