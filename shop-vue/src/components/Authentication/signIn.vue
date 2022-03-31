<template>
  <div>
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
</template>

<script>
import {signInUser} from "../../../firebase/functions/authentication"

export default {
  name: "signInForm",
  props: {
    signUpCheckProp: {type: Boolean, required: true},
    dialogProp: {type: Object, required: true},
  },
  data(){
    return{
      signUpCheck: this.signUpCheckProp,
      loginEmail: "",
      loginPwd: "",
      dialog: {
        show: this.dialogProp.show,
        message: this.dialogProp.message,
      },
    }
  },
  methods:{
    toggle(){
      this.signUpCheck = true
      this.$emit("toggle", this.signUpCheck)
    },
    async loginInUser(){
      this.dialog.show = true
      this.dialog.message = "Hang on, signing you in ..."
      this.$emit("loginInUser", this.dialog)
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
          this.dialog.show = false
          this.$emit("signInUser", this.dialog)
        }else{
          console.log(JSON.stringify(result.message))
          this.dialog.show = false
          this.$emit("signInUser", this.dialog)
        }
      })
    },
  }
}
</script>