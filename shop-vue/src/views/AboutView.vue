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
  </v-container>
</template>

<script>
/* eslint-disable */
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, updateDoc } from "firebase/firestore"; 
import {userState, db} from "../../firebase/firebaseConfig"
import {getProfile} from "../../firebase/functions/profile"

// const auth = getAuth()
// const uState = this.getUserState()

export default {
  data(){
    return{
      fName: "",
      lName: "",
      email: "",
      password: "",
      loginEmail: "",
      loginPwd: "",
      isSignUp: true,
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
      const auth = getAuth()
      await createUserWithEmailAndPassword(auth, this.email, this.password).then(
        async (cred) =>{
          let timeNow = new Date().toLocaleDateString("en-MY", {hour12: false, hour: "numeric", minute:"numeric", second: "numeric"})
          await setDoc(doc(db, "Users", cred.user.uid), {
            userEmail: cred.user.email,
            firstName: this.fName,
            lastName: this.lName,
            createdAt: timeNow,
            lastLogin: timeNow,
            imgURL: null,
            lastLogout: null
          }).then(async () => {
            localStorage.setItem("uState", JSON.stringify({
              uid: cred.user.uid,
              email: cred.user.email,
              imgURL: null,
              fName: this.fName,
              lName: this.lName
            }))
            this.$store.dispatch("uState/setUserState")
            this.$router.push("/")
          }).catch((error) => {
            console.log(error.message)
          })


          // console.log("id: ", JSON.stringify(cred.user.uid))
          // console.log("created: ", JSON.stringify(cred.user))
          // localStorage.setItem("uState", JSON.stringify(await userState()))
          // this.$store.dispatch("uState/setUserState")
          // this.$router.push("/")
        })
        .catch(error =>{
          console.log(error.message)
        })
    },
    async loginInUser(){
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, this.loginEmail, this.loginPwd).then(
        async (cred) => {
          // localStorage.setItem("uState", JSON.stringify(await userState()))
          // this.$store.dispatch("uState/setUserState")
          // this.$router.push("/")

          let currentTime = new Date().toLocaleDateString("en-MY", {hour12: false, hour: "numeric", minute:"numeric", second: "numeric"})
          const docRef = doc(db, "Users", cred.user.uid)
          await updateDoc(docRef, {
            lastLogin: currentTime
          }).then(async () => {
            // localStorage.setItem("uState", JSON.stringify(await userState()))
            let userInfo = await getProfile(cred.user.uid)
            console.log(userInfo[0].imgURL)
            localStorage.setItem("uState", JSON.stringify({
              uid: cred.user.uid,
              email: cred.user.email,
              imgURL: userInfo[0].imgURL,
              fName: userInfo[0].firstName,
              lName: userInfo[0].lastName
            }))
            this.$store.dispatch("uState/setUserState")
            this.$router.push("/")
          }).catch((error) => {
            console.log(error.message)
          })
      })
      .catch(error =>{
        console.log(error.message)
      })
    },
    async getUserState(){
      let uState = await userState()
      return uState
    }
  }
}
</script>
