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
                <!-- <router-link :to="{name: 'profile'}"> -->
                  <v-btn text color="primary" width="100%" @click.prevent="changeRoute('/profile')">
                    <v-icon left>mdi-account</v-icon>
                    Profile
                  </v-btn>
                <!-- </router-link> -->
              </v-list-item>

              <v-list-item>
                <!-- <router-link :to="{name: 'profile'}"> -->
                  <v-btn text color="primary" width="100%" @click.prevent="changeRoute('/purchase')">
                    <v-icon left>mdi-cash-check</v-icon>
                    Purchases
                  </v-btn>
                <!-- </router-link> -->
              </v-list-item>

              <v-list-item>
                <!-- <router-link @click="signOut()"> -->
                  <v-btn text color="primary" width="100%" @click.prevent="signOut()">
                    <v-icon left>mdi-logout</v-icon>
                    Logout
                  </v-btn>
                <!-- </router-link> -->
              </v-list-item>
            </v-list>
          </v-menu>
        </div> 
      </template>
    </v-toolbar>

    <loading-dialog :show.sync="showDialog" :message.sync="dialogMessage" />
  </nav>
</template>

<script>
import store from "@/store/index"
import router from "@/router/index"
import {computed, ref} from '@vue/composition-api'
import {signOutUser} from "../../firebase/functions/authentication"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"

export default {
  name: "NavBar",
  components:{
    loadingDialog
  },
  setup(){
    const showDialog = ref(false)
    const dialogMessage = ref(null)

    const userState = computed(() => {
      if("uState" in localStorage) store.dispatch("uState/setUserState")
      return store.getters["uState/getUserState"]
    })
    const userCart = computed(() => {
      // if("uCart" in localStorage) this.$store.dispatch("uCart/addProductToCart")
      return store.getters["uCart/getUserCartLength"]
    })
    const userFullName = computed(() => {
      const uState = JSON.parse(userState.value)
      return `${uState.fName} ${uState.lName}`
    })
    const userProfilePic = computed(() => {
      const uState = JSON.parse(userState.value)
      return uState.imgURL
    })
    const userInitials = computed(() => {
      const uState = JSON.parse(userState.value)
      let firstNameInitial = uState.fName.charAt(0)
      let lastNameInitial = uState.lName.charAt(0)
      return `${firstNameInitial}${lastNameInitial}`
    })

    const signOut = async () => {
      showDialog.value = true
      dialogMessage.value = "Hang on, signing you out ..."
      const uState = JSON.parse(userState.value)
      await signOutUser(uState.uid).then((result) => {
        if(result.success){
          store.dispatch("uState/clearUserState")
          store.dispatch("uCart/clearCart")
          router.push("/signup")
          showDialog.value = false
        }else{
          showDialog.value = false
          console.log(result.message)
        }
      })
    }
    const changeRoute = (selectedRoute) => {
      router.push(selectedRoute)
    }

    return {showDialog, dialogMessage, userState, userCart, userFullName, userProfilePic, userInitials, signOut, changeRoute}
  }
}
</script>