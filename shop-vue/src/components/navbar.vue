<template>
  <nav>
    <v-toolbar height="65px" elevation="2" color="primary" dark>
      <v-icon x-large>mdi-vuejs</v-icon>
      <v-toolbar-title class="text-h5 font-weight-medium">shopVue</v-toolbar-title>
      
      <template v-if="userState !== null">
        <div class="ml-8 d-flex align-center">
          <v-btn text large class="text-subtitle-1 font-weight-medium" @click.prevent="changeRoute('/')">
            Home
          </v-btn>

          <v-btn text large class="text-subtitle-1 font-weight-medium" @click.prevent="changeRoute('/products')">
            Products
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <div class="mx-4 d-flex align-center">
          <v-btn v-show="userCart < 1" icon large @click.prevent="changeRoute('/cart')">
            <v-icon >mdi-cart</v-icon>
          </v-btn>

          <v-badge v-show="userCart > 0" :content="userCart" color="red" overlap>
            <v-btn icon large @click.prevent="changeRoute('/cart')">
              <v-icon >mdi-cart</v-icon>
            </v-btn>
          </v-badge>
        </div>

        <div>
          <v-menu rounded="lg" offset-y bottom transition="slide-y-transition">
            <template v-slot:activator="{on, attrs}">
              <div v-bind="attrs" v-on="on" class="pa-2 mx-2 d-flex align-center">
                <strong class="mr-4 text-subtitle-1 white--text">username username</strong>
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
      </template>
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
      cart: [],
      itemsInCart: null
    }
  },
  computed:{
    userState(){
      if("uState" in localStorage) this.$store.dispatch("uState/setUserState")
      return this.$store.getters["uState/getUserState"]
    },
    userCart(){
      // if("uState" in localStorage) this.$store.dispatch("uState/setUserState")
      return this.$store.getters["uCart/getUserCartLength"]
    }
  },
  methods: {
    // dropdownFunction(func){
    //   func();
    // },
    async signOutUser(){
      const auth = getAuth()
      this.$store.dispatch("uState/clearUserState")
      localStorage.clear("uCart")
      await signOut(auth)
      this.$router.push("/signup")
    },
    changeRoute(route){
      this.$router.push(route)
    }
  }
}
</script>