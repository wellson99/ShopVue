<template>
  <div>
    <p class="text-h4 text-center pb-5">Log In</p>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" class="ma-0" v-if="login.error">
          <v-alert dense prominent text color="primary" icon="mdi-alert">
            <span class="text-body-2">{{login.message}}</span>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="email"  label="Email" outlined hide-details />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="pwd" :counter="10"  label="Password" outlined hide-details />
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn elevation="6" large  color="primary" class="mr-4" :disabled="(email === '') || (pwd === '')"
            @click.prevent="loginInUser" >
            Log In
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn text color="primary" @click.prevent="toggle">Don't have an account? Sign up now!</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import store from "@/store/index"
import router from "@/router/index"
import {ref} from '@vue/composition-api'
import {signInUser} from "../../../firebase/functions/authentication"

export default {
  name: "signInForm",
  props: {
    signUpCheckProp: {type: Boolean, required: true},
    dialogProp: {type: Object, required: true},
  },
  setup(props, {emit}){
    const signUpCheck = ref(props.signUpCheckProp)
    const email = ref("")
    const pwd = ref("")
    const dialog = ref({show: props.dialogProp.show, message: props.dialogProp.message})
    const login = ref({error: false, message: null})
    
    const toggle = () => {
      signUpCheck.value = true
      emit("toggle", signUpCheck.value)
    }
    const loginInUser = async () => {
      dialog.value.show = true
      dialog.value.message = "Hang on, signing you in ..."
      emit("loginInUser", dialog.value)

      let signinDetails = {email: email.value, pwd: pwd.value}
      await signInUser(signinDetails).then((result) => {
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
          emit("signInUser", dialog.value)
        }else{
          console.log(JSON.stringify(result.message))
          login.value.error = true
          login.value.message = result.display
          dialog.value.show = false
          emit("signInUser", dialog.value)
        }
      })
    }

    return {signUpCheck, email, pwd, dialog, login, toggle, loginInUser}
  },
}
</script>