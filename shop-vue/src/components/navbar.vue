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

          <v-badge v-show="userCart > 0" :content="userCart" color="red" 
            overlap offset-x="17" offset-y="17">
            <v-btn icon large @click.prevent="changeRoute('/cart')">
              <v-icon>mdi-cart</v-icon>
            </v-btn>
          </v-badge>
        </div>

        <div>
          <v-menu rounded="lg" offset-y bottom transition="slide-y-transition">
            <template v-slot:activator="{on, attrs}">
              <div v-bind="attrs" v-on="on" class="pa-2 mx-2 d-flex align-center">
                <strong class="mr-4 text-subtitle-1 white--text">{{userFullName}}</strong>
                <template v-if="userProfilePic !== null">
                  <v-avatar size="40" class="">
                    <img :src="userProfilePic" alt="John">
                  </v-avatar>
                </template>

                <template v-if="userProfilePic === null">
                  <v-avatar size="40" color="background">
                    <span class="primary--text text-body-1 font-weight-medium">{{userInitials}}</span>
                  </v-avatar>
                </template>
              </div>
            </template>

            <v-list>
              <v-list-item>
                <v-btn text color="primary" width="100%" @click.prevent="changeRoute('/profile')">
                  <v-icon left>mdi-account</v-icon>
                  Profile
                </v-btn>
              </v-list-item>

              <v-list-item>
                <v-btn text color="primary" width="100%" @click.prevent="changeRoute('/purchase')">
                  <v-icon left>mdi-cash-check</v-icon>
                  Purchases
                </v-btn>
              </v-list-item>

              <v-list-item>
                <v-btn text color="primary" width="100%" @click.prevent="signOutUser()">
                  <v-icon left>mdi-logout</v-icon>
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
/* eslint-disable */
import { getAuth, signOut } from 'firebase/auth'
import { doc, updateDoc } from "firebase/firestore";
import { db} from "../../firebase/firebaseConfig"

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
      // console.log(this.$store.getters["uState/getUserState"])
      return this.$store.getters["uState/getUserState"]
    },
    userCart(){
      // if("uCart" in localStorage) this.$store.dispatch("uCart/addProductToCart")
      return this.$store.getters["uCart/getUserCartLength"]
    },
    userFullName(){
      const userState = JSON.parse(this.userState)
      return `${userState.fName} ${userState.lName}`
    },
    userProfilePic(){
      const userState = JSON.parse(this.userState)
      return userState.imgURL
    },
    userInitials(){
      const userState = JSON.parse(this.userState)
      let firstNameInitial = userState.fName.charAt(0)
      let lastNameInitial = userState.lName.charAt(0)
      return `${firstNameInitial}${lastNameInitial}`
    }
  },
  methods: {
    // dropdownFunction(func){
    //   func();
    // },
    async signOutUser(){
      const auth = getAuth()
      const userState = JSON.parse(this.userState)
      // const userState = this.userState
      // console.log(JSON.stringify(userState))
      await signOut(auth).then(async () => {
        let currentTime = new Date().toLocaleDateString("en-MY", {hour12: false, hour: "numeric", minute:"numeric", second: "numeric"})
        const docRef = doc(db, "Users", userState.uid)
        await updateDoc(docRef, {
          lastLogout: currentTime
        }).then(() => {
          this.$store.dispatch("uState/clearUserState")
          this.$router.push("/signup")
        }).catch((error) => {
          console.log(error.message)
        })
      })

      // localStorage.removeItem("uState")
      // this.$router.push("/signup")
    },
    changeRoute(route){
      this.$router.push(route)
    }
  }
}
</script>