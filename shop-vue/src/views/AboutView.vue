<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="space-around">
      <v-col cols="7" align="center">
        <v-img :src="require('../assets/illustration.svg')" class="my-3" contain width="65%" height="65%"/>
        <p class="text-h2 mb-1 primary--text font-weight-medium">shopVue</p>
        <p class="text-h5 primary--text">Shop, buy and sale now.</p>
      </v-col>

      <v-col cols="4" align="center">
        <v-card elevation="4" outlined class="rounded-lg">
          <v-row lign="center" justify="center">
            <v-col class="pa-10">
              <v-slide-x-transition hide-on-leave>
                <sign-in-form v-show="!isSignUp" :signUpCheckProp="isSignUp" :dialogProp="dialog" v-on:toggle="changeForm($event)"
                   v-on:loginInUser="toggleDialog($event)" />
              </v-slide-x-transition>
              
              <v-slide-x-reverse-transition hide-on-leave>
                <sign-up-form v-show="isSignUp" :signUpCheckProp="isSignUp" :dialogProp="dialog" v-on:toggle="changeForm($event)" 
                    v-on:signUpUser="toggleDialog($event)" />
              </v-slide-x-reverse-transition>

            </v-col>
          </v-row>  
        </v-card>
      </v-col>
    </v-row>

    <loading-dialog :show.sync="dialog.show" :message.sync="dialog.message" />
  </v-container>
</template>

<script>
import signInForm from "../components/Authentication/signIn.vue"
import signUpForm from "../components/Authentication/signUp.vue"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"

export default {
  components:{
    loadingDialog, signInForm, signUpForm
  },
  data(){
    return{
      isSignUp: false,
      dialog: {
        show: false,
        message: null,
      },
    }
  },
  mounted(){
    console.log("store ",this.$store.getters["uState/getUserState"])
  },
  methods: {
    changeForm(value){
      this.isSignUp = value
    },
    toggleDialog(dialog){
      this.dialog = dialog
    },
  }
}
</script>
