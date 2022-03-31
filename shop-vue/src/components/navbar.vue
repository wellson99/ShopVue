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
                <v-btn text color="primary" width="100%" @click.prevent="signOut()">
                  <v-icon left>mdi-logout</v-icon>
                  Logout
                </v-btn>
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
/* eslint-disable */
import {signOutUser} from "../../firebase/functions/authentication"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
// const isAuth = await userState()

export default {
  name: "NavBar",
  components:{
    loadingDialog
  },
  data() {
    return{
      cart: [],
      itemsInCart: null,
      showDialog: false,
      dialogMessage: "",
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
    async signOut(){
      this.showDialog = true
      this.dialogMessage = "Hang on, signing you out ..."
      const userState = JSON.parse(this.userState)
      await signOutUser(userState.uid).then((result) => {
        if(result.success){
          this.$store.dispatch("uState/clearUserState")
          this.$store.dispatch("uCart/clearCart")
          this.$router.push("/signup")
          this.showDialog = false
        }else{
          this.showDialog = false
          console.log(result.message)
        }
      })
    },
    changeRoute(route){
      this.$router.push(route)
    }
  }
}
</script>