<template>
  <v-app id="app">
    <nav-bar/>

    <v-main>
      <v-fade-transition :hide-on-leave="true">
        <router-view/>
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/navbar.vue"

export default {
  components: {
    NavBar,
  },
  name: 'App',
  data() { 
    return{
    }
  },
};
</script>

<style scoped>
#app{
  background-color: #F5F5F5;
}
</style>