import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#00897B',
        background: '#F5F5F5',
        // secondary: '#b0bec5',
        // anchor: '#8c9eff',
      },
    },
  },
})

export default vuetify
