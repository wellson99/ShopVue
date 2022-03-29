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
              <div v-show="isSignUp">
                <p class="text-h4 text-center pb-5">Sign Up</p>
                <v-form ref="form" lazy-validation>
                  <v-row>
                    <v-col cols="6" class="ma-0">
                      <v-text-field v-model="fName"  label="Firstname" outlined required />
                    </v-col>

                    <v-col cols="6">
                      <v-text-field v-model="lName"  label="Lastname" outlined required />
                    </v-col>
                  
                    <v-col cols="12">
                      <v-text-field v-model="email"  label="Email" outlined required />
                    </v-col>
                  
                    <v-col cols="12">
                      <v-text-field v-model="password" :counter="10"  label="Password" outlined required />
                    </v-col>
                  
                    <v-col cols="12" class="text-center">
                      <v-btn elevation="6" large  color="primary" class="mr-4" @click.prevent="signUpUser" >Sign Up</v-btn>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn text color="primary" @click.prevent="toggle">Already have an account? Log in now!</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </div>

              <div v-show="!isSignUp">
                <p class="text-h4 text-center pb-5">Log In</p>
                <v-form ref="form" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="loginEmail"  label="Email" outlined required />
                    </v-col>
                  
                    <v-col cols="12">
                      <v-text-field v-model="loginPwd" :counter="10"  label="Password" outlined required />
                    </v-col>
                  
                    <v-col cols="12" class="text-center">
                      <v-btn elevation="6" large  color="primary" class="mr-4" @click.prevent="loginInUser" >Log In</v-btn>
                    </v-col>
                    <v-col cols="12" class="text-center">
                      <v-btn text color="primary" @click.prevent="toggle">Don't have an account? Sign up now!</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </v-col>
          </v-row>  
        </v-card>
      </v-col>
    </v-row>

    <loading-dialog :show.sync="showDialog" :message.sync="dialogMessage" />
  </v-container>
</template>

<script>
import {signInUser, signUpUser} from "../../firebase/functions/authentication"
import loadingDialog from "../components/loadingDialog.vue"

export default {
  components:{
    loadingDialog
  },
  data(){
    return{
      fName: "",
      lName: "",
      email: "",
      password: "",
      loginEmail: "",
      loginPwd: "",
      isSignUp: true,
      showDialog: false,
      dialogMessage: "",
    }
  },
  mounted(){
    console.log("store ",this.$store.getters["uState/getUserState"])
  },
  methods: {
    toggle(){
      this.isSignUp = !this.isSignUp
    },
    async signUpUser(){
      this.showDialog = true
      this.dialogMessage = "Hang on, creating your account ..."
      let signupDetails = {
        email: this.email,
        pwd: this.password,
        fName: this.fName,
        lName: this.lName
      }

      await signUpUser(signupDetails).then((result) => {
        if(result.success){
          localStorage.setItem("uState", JSON.stringify({
            uid: result.uid,
            email: result.userDetails[0].userEmail,
            imgURL: result.userDetails[0].imgURL,
            fName: result.userDetails[0].firstName,
            lName: result.userDetails[0].lastName,
          }))
          this.$store.dispatch("uState/setUserState")
          this.$router.push("/")
          this.showDialog = false
        }else{
          console.log(JSON.stringify(result.message))
          this.showDialog = false
        }
      })
    },
    async loginInUser(){
      this.showDialog = true
      this.dialogMessage = "Hang on, signing you in ..."
      let signinDetails = {
        email: this.loginEmail,
        pwd: this.loginPwd
      }

      await signInUser(signinDetails).then((result) => {
        if(result.success){
          localStorage.setItem("uState", JSON.stringify({
            uid: result.uid,
            email: result.userDetails[0].userEmail,
            imgURL: result.userDetails[0].imgURL,
            fName: result.userDetails[0].firstName,
            lName: result.userDetails[0].lastName,
          }))
          this.$store.dispatch("uState/setUserState")
          this.$router.push("/")
          this.showDialog = false
        }else{
          console.log(JSON.stringify(result.message))
          this.showDialog = false
        }
      })
    },
  }
}
</script>
