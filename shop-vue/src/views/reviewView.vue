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
                <v-btn color="primary" large width="50%" @click.prevent="uploadReview()">
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
import {getSinglePurchase} from "../../firebase/functions/purchased"
import {uploadReview} from "../../firebase/functions/review"
import loadingDialog from "../components/loadingDialog.vue"

export default {
  components:{
    loadingDialog,
  },
  data(){
    return{
      // uploadLoading: false,
      showDialog: false,
      dialogMessage: "",
      rating: 0,
      review: null,
      purchaseItem: [],
      itemDetails: {
        purcID: null,
        purcTime: null,
        name: null,
        imgURL: null,
        price: 0,
        itemQuantity: 0,
      }
    }
  },
  props:[
    "purchaseID",
    "index"
  ],
  async mounted(){
    const userState = JSON.parse(this.$store.getters["uState/getUserState"])
    this.purchaseItem = await getSinglePurchase(userState.uid, this.purchaseID)
    // console.log(JSON.stringify(this.purchaseItem[0].id))

    this.purchaseItem.map((obj) => {
      this.itemDetails.purcID = obj.id
      this.itemDetails.purcTime = obj.time
      this.itemDetails.name = obj.items[this.index].name
      this.itemDetails.imgURL = obj.items[this.index].imgURL
      this.itemDetails.price = obj.items[this.index].price
      this.itemDetails.itemQuantity = obj.items[this.index].itemQuantity
      // console.log(JSON.stringify(obj.items[this.index].name))
    })
  },
  computed:{
    purchaseDateTime(){  
      if(this.itemDetails.purcTime === null) return ""
      let dateObj = new Date(this.itemDetails.purcTime.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
      return `${date} - ${time}`
    },
  },
  methods:{
    async uploadReview(){
      this.showDialog = true
      this.dialogMessage = "Hang on, uploading your review ..."

      const userState = JSON.parse(this.$store.getters["uState/getUserState"])

      let itemsList = this.purchaseItem[0].items
      // console.log(JSON.stringify(itemsList[this.index]))
      itemsList[this.index].rating = this.rating
      itemsList[this.index].review = this.review
      // console.log("after\n", JSON.stringify(itemsList))

      // eslint-disable-next-line
      let review = {
        userID: userState.uid,
        userName: `${userState.fName} ${userState.lName}`,
        purchaseID: this.purchaseID,
        updatedItemsList: itemsList,
        productID: itemsList[this.index].productID,
        userRating: this.rating,
        userReview: this.review
      }

      // console.log(JSON.stringify(review.userID))

      // await uploadReview(userState.uid, this.purchaseID, itemsList).then(
      await uploadReview(review).then((result) => {
        let router = this.$router
        if(result){
          setTimeout(function(){
            router.push({path: "/purchase", replace: true})
            this.showDialog = false
          }, 3000)
        }else{
          console.log(result.message)
        }
      })
      
      
    },
    updateInput(value) {
      this.rating = value
      // console.log(this.rating);
    }
  }
}
</script>