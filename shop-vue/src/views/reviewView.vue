<template>
  <v-container>
    <page-header :title="headerTitle" :description="headerDesc" />

    <v-row class="mx-2 align-center-top justify-center">
      <v-col sm="12" md="7" lg="7" class="">
        <v-card rounded="lg" color="" elevation="5" class="mx-3">
          <v-card-text>
            <v-row>
              <v-col sm="12" md="3" class="py-0">
                <div class="pa-5">
                  <v-avatar size="170" tile class="">
                    <img :src="itemDetails.imgURL" alt="John">
                  </v-avatar>
                </div>
              </v-col>

              <v-col sm="12" md="9" class="mt-3 pb-0">
                <v-row>
                  <v-col cols="6" class="py-1">
                    Purchase ID<br/>
                    <span class="text-h6 text--primary">{{itemDetails.purcID}}</span>
                  </v-col>

                  <v-col cols="6" class="py-1">
                    Purchase Date
                    <br/>
                    <span class="text-h6 text--primary">{{purchaseDateTime}}</span>
                  </v-col>
                <!-- </v-row> -->

                <!-- <v-row> -->
                  <v-col cols="4" class="py-1">
                    Product Name
                    <br/>
                    <span class="text-h6 text--primary">{{itemDetails.name}}</span>
                  </v-col>

                  <v-col cols="4" class="py-1">
                    Price per Item
                    <br/>
                    <span class="text-h6 text--primary">RM {{itemDetails.price}}</span>
                  </v-col>

                  <v-col cols="4" class="py-1">
                    Purchased Quantity
                    <br/>
                    <span class="text-h6 text--primary">{{itemDetails.itemQuantity}}</span>
                  </v-col>
                <!-- </v-row> -->

                <!-- <v-row> -->
                  <v-col cols="12" class="py-1">
                    Total
                    <br/>
                    <span class="text-h6 text--primary">RM {{itemDetails.price * itemDetails.itemQuantity}}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row class="mx-2">
              <v-col cols="12" class="py-1">
                <span class="text-h6 text--primary">Rating &amp; Review</span>
                <br/><v-divider class="my-1"/>
                <span class="text-body-1 text--primary pb-3">product Rating</span>
                <br/>
                <v-rating half-increments hover class="pl-0" clearable color="primary" background-color="primary"
                  :value="rating" length="5" size="25" @input="updateInput($event)"/>
              </v-col>

              <v-col cols="12" class="py-1">
                <span class="text-body-1 text--primary pb-3">Product Review</span> 
                <v-textarea solo hide-details v-model="review" placeholder="Write your review here"
                  auto-grow background-color="grey lighten-4" clearable/>
              </v-col>
            </v-row>

            <v-row class="py-4">
              <v-col class="text-center">
                <v-btn color="primary" large width="50%" @click.prevent="uploadUserReview()">
                  <v-icon left>mdi-file-edit</v-icon>
                  Post Review
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <loading-dialog :show.sync="showDialog" :message.sync="dialogMessage" />
  </v-container>
</template>

<script>
/* eslint-disable */ 
import store from "@/store/index"
import router from "@/router/index"
import {computed, onMounted, ref} from '@vue/composition-api'
import {getSinglePurchase} from "../../firebase/functions/purchased"
import {uploadReview} from "../../firebase/functions/review"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    loadingDialog, pageHeader
  },
  setup(){
    const headerTitle = ref("Profile")
    const headerDesc = ref("All of your profile info will display here here.")
    const showDialog = ref(false)
    const dialogMessage = ref(null)
    const rating = ref(0)
    const review = ref(null)
    const purchaseItems = ref([])
    const itemDetails = ref({
      purcID: null, purcTime: null, name: null, imgURL: null, price: 0, itemQuantity: 0
    })
    const route = router.app.$route.params

    const purchaseDateTime = computed(() => {
      if(itemDetails.value.purcTime === null) return ""
      let dateObj = new Date(itemDetails.value.purcTime.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
      return `${date} - ${time}`
    })

    const updateInput = (eventVal) => {
      rating.value = eventVal
    }
    const uploadUserReview = async () => {
      showDialog.value = true
      dialogMessage.value = "Hang on, uploading your review ..."
      const userState = JSON.parse(store.getters["uState/getUserState"])
      let itemsList = purchaseItems.value[0].items
      itemsList[route.index].rating = rating.value
      itemsList[route.index].review = review.value

      let userReview = {
        userID: userState.uid,
        userName: `${userState.fName} ${userState.lName}`,
        purcID: route.purcID,
        updatedItemsList: itemsList,
        productID: itemsList[route.index].productID,
        userRating: rating.value,
        userReview: review.value
      }
      await uploadReview(userReview).then((result) => {
        if(result){
          setTimeout(() => {
            router.push({path: "/purchase", replace: true})
            showDialog.value = false
          }, 1500)
        }else{
          console.log(result.message)
        }
      })
    }

    onMounted(async () => {
      const userState = JSON.parse(store.getters["uState/getUserState"])
      purchaseItems.value = await getSinglePurchase(userState.uid, route.purcID)
      purchaseItems.value.map((purc) => {
        itemDetails.value.purcID = purc.id
        itemDetails.value.purcTime = purc.time
        itemDetails.value.name = purc.items[route.index].name
        itemDetails.value.imgURL = purc.items[route.index].imgURL
        itemDetails.value.price = purc.items[route.index].price
        itemDetails.value.itemQuantity = purc.items[route.index].itemQuantity
      })
    })

    return {headerTitle, headerDesc, showDialog, dialogMessage, rating, review, purchaseItems, itemDetails, purchaseDateTime, updateInput, uploadUserReview}
  }
}
</script>