<template>
  <div>
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
</template>

<script>
import {signUpUser} from "../../../firebase/functions/authentication"

export default {
  name: "signUpForm",
  props: {
    signUpCheckProp: {type: Boolean, required: true},
    dialogProp: {type: Object, required: true},
  },
  data(){
    return{
      signUpCheck: this.signUpCheckProp,
      fName: "",
      lName: "",
      email: "",
      password: "",
      dialog: {
        show: this.dialogProp.show,
        message: this.dialogProp.message,
      },
    }
  },
  methods:{
    toggle(){
      this.signUpCheck = false
      this.$emit("toggle", this.signUpCheck)
    },
    async signUpUser(){
      this.dialog.show = true
      this.dialog.message = "Hang on, creating your account ..."
      this.$emit("signUpUser", this.dialog)
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
          this.dialog.show = false
          this.$emit("signUpUser", this.dialog)
        }else{
          console.log(JSON.stringify(result.message))
          this.dialog.show = false
          this.$emit("signUpUser", this.dialog)
        }
      })
    },
  }
}
</script>