<template>
  <v-container>
    <page-header :title="headerTitle" :description="headerDesc" />

    <template v-if="!pageLoading">
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
                  <p class="text-h6 text--primary">{{createdAtDateTime}}</p>
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
                <loading-dialog :show.sync="showDialog" :message.sync="dialogMessage" />
              </v-dialog>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    
    <snack-bar :show.sync="showSnackbar" :timeout.sync="snackbarTimeout" :color.sync="snackbarColor" :message.sync="snackbarMessage" />
    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {getProfile, updateProfile} from "../../firebase/functions/profile"
import snackBar from "../components/Reuseable/snackbar.vue"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    snackBar, loadingDialog, pageHeader
  },
  data(){
    return{
      headerTitle: "Profile",
      headerDesc: "All of your profile info will display here here.",
      pageLoading: false,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",
      showDialog: false,
      dialogMessage: "",  
      showSnackbar: false,
      snackbarColor: "",
      snackbarMessage: "",
      snackbarTimeout: null,
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
    let self = this
    this.pageLoading = true
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

    setTimeout(function(){
      self.pageLoading = false
    }, 1500)
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
    },
    createdAtDateTime(){  
      if(this.profile.createdAt === null) return ""
      let dateObj = new Date(this.profile.createdAt.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
      return `${date} at ${time}`
    },
  },
  methods:{
    async updateProfile(){
      this.showDialog = true
      this.dialogMessage = "Hang on, updating your profile ..."
      let profileInfo = {
        id: this.profile.id,
        firstName: this.profile.firstName,
        lastName: this.profile.lastName
      }

      await updateProfile(this.file, profileInfo).then((result) => {
        let self = this
        if(result.success){
          if("imgURL" in result) this.profile.imgURL = result.imgURL
          this.profile.firstName = result.firstName
          this.profile.lastName = result.lastName
          localStorage.setItem("uState", JSON.stringify({
            uid: this.profile.id,
            email: this.profile.email,
            imgURL: this.profile.imgURL,
            fName: this.profile.firstName,
            lName: this.profile.lastName
          }))
          this.$store.dispatch("uState/setUserState")

          setTimeout(function(){
            self.showDialog = false
            self.dialog = false 
            self.showSnackbar = true
            self.snackbarTimeout = 1000
            self.snackbarColor = "primary"
            self.snackbarMessage = "Profile info updated successfully."
            self.file = null
          }, 2000)
        }else{
          setTimeout(function(){
            self.showDialog = false
            self.dialog = false 
            console.log(result.message)
            this.file = null
          }, 2000)
        }
      })
    },
  }
}
</script>