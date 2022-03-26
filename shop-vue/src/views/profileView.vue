<template>
  <v-container>
    <v-row class="mx-2 align-center">
      <v-col >
        <span class="text-h5 font-weight-medium">Profile</span>
        <br class="mb-1">
        <span class="text-body-1 grey--text text--darken-2">All of your profile info will display here here.</span>
        <v-divider class="mt-3"/>
      </v-col>
    </v-row>

    <v-row class="mx-2 align-center-top justify-center">
      <v-col sm="12" md="6" lg="6" class="">
        <v-card rounded="lg" color="" elevation="5" class="mx-3">
          <v-card-text>
            <v-row>
              <div class="pa-5">
                <template v-if="profile.imgURL !== null">
                  <v-avatar size="180" color="background">
                    <img :src="profile.imgURL" :alt="userFullName">
                  </v-avatar>
                </template>

                <template v-if="profile.imgURL === null">
                  <v-avatar size="180" color="background">
                    <span class="primary--text text-h3 font-weight-medium">{{userInitials}}</span>
                  </v-avatar>
                </template>
              </div>

              <div class="pa-5">
                <div>User Email</div>
                <p class="text-h6 text--primary">{{profile.email}}</p>

                <div>Username</div>
                <p class="text-h6 text--primary">{{userFullName}}</p>

                <div>Account Created At</div>
                <p class="text-h6 text--primary">{{profile.createdAt}}</p>
              </div>
            </v-row>

            <v-col class="text-center">
              <v-btn color="primary" large width="50%" @click.prevent="dialog = true">
                <v-icon left>mdi-file-edit</v-icon>
                Edit Profile
              </v-btn>
            </v-col>
              
            <v-dialog v-model="dialog" scrollable width="50%">
              <v-card>
                <v-card-title class="primary">
                  <span class="white--text">Edit Profile</span>
                  <v-spacer></v-spacer>
                  
                  <v-btn dark icon @click.stop="dialog = false">
                    <v-icon large>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
               

                <v-card-text class="background pt-5">
                  <!-- <div>Purchase Date</div>
                  <p class="text-h6 text--primary">ssss</p> -->
                  
                  <v-row>
                    <v-col cols="8">
                      <div>User Email</div>
                      <v-text-field solo label="Solo" v-model="profile.email" disabled placeholder="Pick an avatar" clearable hide-details/>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <div>First Name</div>
                      <v-text-field solo label="Solo" v-model="profile.firstName" placeholder="Pick an avatar" clearable hide-details/>
                    </v-col>

                    <v-col cols="6">
                      <div>Last Name</div>
                      <v-text-field solo label="Solo" v-model="profile.lastName" placeholder="Pick an avatar" clearable hide-details/>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="8">
                      <div>Upload Profile Picture</div>
                      <v-file-input solo accept="image/png, image/jpeg, image/bmp" placeholder="Pick an avatar"
                        prepend-icon="mdi-camera" label="Avatar" v-model="file" hide-details/>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col class="text-center mt-5">
                      <v-btn color="primary" large width="50%" @click.prevent="updateProfile()">
                        <v-icon left>mdi-file-edit</v-icon>
                        Update Profile
                      </v-btn>
                    </v-col>
                  </v-row>

                </v-card-text>
              </v-card>
            </v-dialog>

          </v-card-text>
        </v-card>

        <v-snackbar v-model="showSnackbar" :timeout="2000" elevation="24" multi-line bottom text color="primary">
          Profile info updated successfully
          <template v-slot:action="{ attrs }">
            <v-btn icon color="primary" v-bind="attrs" @click="showSnackbar = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable */
import {getProfile} from "../../firebase/functions/profile"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage"
import { doc, updateDoc } from "firebase/firestore"; 
import {db} from "../../firebase/firebaseConfig"

export default {
  data(){
    return{
      showSnackbar: false,
      profileInfo: [],
      dialog: false,
      file: null,
      profile:{
        id: null,
        email: null,
        firstName: null,
        lastName: null,
        createdAt: null,
        imgURL: null
      }
    }
  },
  async mounted(){
    const userState = JSON.parse(this.$store.getters["uState/getUserState"])
    this.profileInfo = await getProfile(userState.uid)
    // console.log(JSON.stringify(this.profileInfo))
    this.profileInfo.map(profile => {
      this.profile.id = profile.id
      this.profile.email = profile.userEmail,
      this.profile.firstName = profile.firstName,
      this.profile.lastName = profile.lastName
      this.profile.createdAt = profile.createdAt
      this.profile.imgURL = profile.imgURL
    })

  },
  computed:{
    userState(){
      return JSON.parse(this.$store.getters["uState/getUserState"])
    },
    userFullName(){
      return `${this.profile.firstName} ${this.profile.lastName}`
    },
    userInitials(){
      return `${String(this.profile.firstName).charAt(0)}${String(this.profile.lastName).charAt(0)}`
    }
  },
  methods:{
    // onFileChange(files){
    //   this.file = files;
    //   console.log(files);
    // },
    async updateProfile(){
      const userState = this.userState
      // const docRef = doc(db, "Users", userState.uid)
      const docRef = doc(db, "Users", this.profile.id)

      if(this.file !== null){
        const imageType = this.file.type.split("/")[1]
        const imageMetadata = {contentType: this.file.type}
        const storageRef = ref(getStorage(), `profileImages/${this.profile.id}.${imageType}`)

        await uploadBytes(storageRef, this.file, imageMetadata).then(async (snapshot) => {
          this.profile.imgURL = await getDownloadURL(snapshot.ref)
          await updateDoc(docRef, {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            imgURL: this.profile.imgURL
          }).then(async () => {
            this.dialog = false 
            this.showSnackbar = true
            this.file = null
            localStorage.setItem("uState", JSON.stringify({
              uid: this.profile.id,
              email: this.profile.email,
              imgURL: this.profile.imgURL,
              fName: this.profile.firstName,
              lName: this.profile.lastName
            }))
            this.$store.dispatch("uState/setUserState")
          }).catch((error) => {
            console.log(error.message)
          })
        }).catch((error) => {
          console.log(error.message)
        })
      }else{
        console.log(" null ", this.file)
        await updateDoc(docRef, {
          firstName: this.profile.firstName,
          lastName: this.profile.lastName,
        }).then(async () => {
          this.dialog = false 
          this.showSnackbar = true
          localStorage.setItem("uState", JSON.stringify({
              uid: this.profile.id,
              email: this.profile.email,
              imgURL: this.profile.imgURL,
              fName: this.profile.firstName,
              lName: this.profile.lastName
            }))
            this.$store.dispatch("uState/setUserState")
        }).catch((error) => {
          console.log(error.message)
        })
      }
    }
  }
}
</script>