<template>
  <nav>
    <v-toolbar height="80px" elevation="2" color="primary" dark>
      <v-toolbar-title class="text-h5 font-weight-medium">shopVue</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <div v-if="userState">
        <v-menu rounded="lg" offset-y bottom transition="slide-y-transition">
          <template v-slot:activator="{on, attrs}">
            <div v-bind="attrs" v-on="on" class="pa-2 mx-2 d-flex align-center">
              <strong class="mr-4 text-h6 white--text">username username</strong>

              <v-avatar size="40" class="">
                <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
              </v-avatar>
            </div>
          </template>

          <v-list>
            <v-list-item>
              <v-btn text>
                <v-icon>mdi-dots-vertical</v-icon>
                item1
              </v-btn>
            </v-list-item>

            <v-list-item>
              <v-btn text>
                <v-icon>mdi-dots-vertical</v-icon>
                item2
              </v-btn>
            </v-list-item>

            <v-list-item>
              <v-btn text @click.prevent="signOutUser()">
                <v-icon>mdi-logout</v-icon>
                Logout
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div> 

        <!-- <v-btn text @click.prevent="signOutUser">
        <v-icon>mdi-logout</v-icon>
        logout
      </v-btn> -->
      

      
      
      
    </v-toolbar>
  </nav>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'

// const isAuth = await userState()

export default {
  name: "NavBar",
  data() {
    return{
      
    }
  },
  computed:{
    userState(){
      if("uState" in localStorage) this.$store.dispatch("setUserState")
      return this.$store.getters.getUserState
    }
  },
  methods: {
    // dropdownFunction(func){
    //   func();
    // },
    async signOutUser(){
      const auth = getAuth()
      this.$store.dispatch("clearUserState")
      await signOut(auth)
      // this.$router.push("/signup")
    }
  }
}
</script>