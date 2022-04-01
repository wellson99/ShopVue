<template>
  <div>
    <p class="text-h4 text-center pb-5">Sign Up</p>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" class="ma-0" v-if="signup.error">
          <v-alert dense prominent text color="primary" icon="mdi-alert">
            <span class="text-body-2">{{signup.message}}</span>
          </v-alert>
        </v-col>
        <v-col cols="6" class="ma-0">
          <v-text-field v-model="fName" label="Firstname" outlined required hide-details />
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="lName" label="Lastname" outlined required hide-details />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="email" label="Email" outlined required hide-details />
        </v-col>      
        <v-col cols="12">
          <v-text-field v-model="password" :counter="10"  label="Password" outlined required hide-details />
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn elevation="6" large  color="primary" class="mr-4" @click.prevent="signUp" 
            :disabled="(email === '') || (password === '') || (fName === '') || (lName === '')" >
            Sign Up
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn text color="primary" @click.prevent="toggle">Already have an account? Log in now!</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import store from "@/store/index"
import router from "@/router/index"
import {ref} from '@vue/composition-api'
import {signUpUser} from "../../../firebase/functions/authentication"

export default {
  name: "signUpForm",
  props: {
    signUpCheckProp: {type: Boolean, required: true},
    dialogProp: {type: Object, required: true},
  },
  setup(props, {emit}){
    const signUpCheck = ref(props.signUpCheckProp)
    const fName = ref("")
    const lName = ref("")
    const email = ref("")
    const password = ref("")
    const dialog = ref({show: props.dialogProp.show, message: props.dialogProp.message})
    const signup = ref({error: false, message: null})

    const toggle = () => {
      signUpCheck.value = false
      emit("toggle", signUpCheck.value)
    }

    const signUp = async () => {
      dialog.value.show = true
      dialog.value.message = "Hang on, creating your account ..."
      emit("signUpUser", dialog.value)

      let signupDetails = {email: email.value, pwd: password.value, fName: fName.value, lName: lName.value}
      await signUpUser(signupDetails).then((result) => {
        if(result.success){
          localStorage.setItem("uState", JSON.stringify({
            uid: result.uid,
            email: result.userDetails[0].userEmail,
            imgURL: result.userDetails[0].imgURL,
            fName: result.userDetails[0].firstName,
            lName: result.userDetails[0].lastName,
          }))
          store.dispatch("uState/setUserState")
          router.push("/")
          dialog.value.show = false
          emit("signUpUser", dialog.value)
        }else{
          signup.value.error = true
          signup.value.message = result.display
          dialog.value.show = false
          emit("signUpUser", dialog.value)
        }
      })
    }

    return {signUpCheck, fName, lName, email, password, signup, toggle, signUp}
  }
}
</script>