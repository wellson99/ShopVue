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
                <v-btn color="primary" large width="50%" @click.prevent="updateDialog = true">
                  <v-icon left>mdi-file-edit</v-icon>
                  Edit Profile
                </v-btn>
              </v-col>
                
              <v-dialog v-model="updateDialog" scrollable width="50%">
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
                        <v-btn color="primary" large width="50%" @click.prevent="updateUserProfile()">
                          <v-icon left>mdi-file-edit</v-icon>
                          Update Profile
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <loading-dialog :show.sync="loading.dialog" :message.sync="loading.message" />
              </v-dialog>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    
    <snack-bar :show.sync="snackBar.show" :timeout.sync="snackBar.timeout" :color.sync="snackBar.color" :message.sync="snackBar.message" />
    <loading-dialog v-if="pageLoading" :show.sync="loading.dialog" :message.sync="loading.message" />
  </v-container>
</template>

<script>
import store from "@/store/index"
import {computed, onMounted, ref} from '@vue/composition-api'
import {getProfile, updateProfile} from "../../firebase/functions/profile"
import snackBar from "../components/Reuseable/snackbar.vue"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    snackBar, loadingDialog, pageHeader
  },
  setup(){
    const headerTitle = ref("Profile")
    const headerDesc = ref("All of your profile info will display here here.")
    const pageLoading = ref(true)
    const loading = ref({dialog: true, message: "Hang on, fetching data ..."})
    const snackBar = ref({show: false, color: null, message:null, timeout: null})
    const profileInfo = ref([])
    const updateDialog = ref(false)
    const file = ref(null)
    const profile = ref({id: null, email: null, firstName: null, lastName: null, createdAt: null, imgURL: null})
    const userState = JSON.parse(store.getters["uState/getUserState"])

    const userFullName = computed(() => {
      return `${profile.value.firstName} ${profile.value.lastName}`
    })
    const userInitials = computed(() => {
      return `${String(profile.value.firstName).charAt(0)}${String(profile.value.lastName).charAt(0)}`
    })
    const createdAtDateTime = computed(() => {
      if(profile.value.createdAt === null) return ""
      let dateObj = new Date(profile.value.createdAt.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
      return `${date} at ${time}`
    })

    const updateUserProfile = async () => {
      loading.value.dialog = true
      loading.value.message = "Hang on, updating your profile ..."

      let profileInfo = {
        id: profile.value.id,
        firstName: profile.value.firstName,
        lastName: profile.value.lastName
      }
      await updateProfile(file.value, profileInfo).then((result) => {
        if(result.success){
          if("imgURL" in result) profile.value.imgURL = result.imgURL
          profile.value.firstName = result.firstName
          profile.value.lastName = result.lastName
          localStorage.setItem("uState", JSON.stringify({
            uid: profile.value.id,
            email: profile.value.email,
            imgURL: profile.value.imgURL,
            fName: profile.value.firstName,
            lName: profile.value.lastName
          }))
          store.dispatch("uState/setUserState")

          setTimeout(() => {
            loading.value.dialog = false
            updateDialog.value = false 
            snackBar.value.show = true
            snackBar.value.timeout = 1000
            snackBar.value.color = "primary"
            snackBar.value.message = "Profile info updated successfully."
            file.value = null
          }, 1000)
        }else{
          setTimeout(function(){
            loading.value.dialog = false
            updateDialog.value = false 
            console.log(result.message)
            file.value = null
          }, 1000)
        }
      })
    }

    onMounted(async () => {
      pageLoading.value = true      
      profileInfo.value = await getProfile(userState.uid)
      profileInfo.value.map(info => {
        profile.value.id = info.id
        profile.value.email = info.userEmail,
        profile.value.firstName = info.firstName,
        profile.value.lastName = info.lastName
        profile.value.createdAt = info.createdAt
        profile.value.imgURL = info.imgURL
      })
      setTimeout(() => {
        pageLoading.value = false
        loading.value.dialog = false
      }, 1500)
    })

    return {headerTitle, headerDesc, pageLoading, loading, snackBar, profileInfo, updateDialog, file, profile, userState, userInitials, userFullName, createdAtDateTime, updateUserProfile}
  }
}
</script>