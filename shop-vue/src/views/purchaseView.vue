<template>
  <v-container>
    <v-row class="mx-2 align-center">
      <v-col >
        <span class="text-h5 font-weight-medium">Purchases</span>
        <br class="mb-1">
        <span class="text-body-1 grey--text text--darken-2">All of your purchased items will display here here.</span>
        <v-divider class="mt-3"/>
      </v-col>
    </v-row>

    <template v-if="!pageLoading">
      <v-row class="mx-2 align-center-top">
        <v-col sm="12" md="6" lg="6" class="" v-for="item in purchasedItems" :key="item.id">
          <v-card rounded="lg" color="" elevation="5" class="mx-3">
            <v-card-text>
              <div>Purchase ID</div>
              <p class="text-h6 text--primary">{{item.id}}</p>

              <div>Purchase Date</div>
              <p class="text-h6 text--primary">{{purchaseDateTime(item.time)}}</p>

              <v-row>
                <v-col>
                  <div>Total Price</div>
                  <p class="text-h6 text--primary">RM {{item.total}}</p>
                </v-col>

                <v-col class="ma-4 ml-auto my-auto">
                  <div>Total items purchased</div>
                  <p class="text-h6 text--primary">{{item.items.length}}</p>
                </v-col>

                <v-col class="ma-4 ml-auto my-auto">
                  <div>Delivery Type</div>
                  <p class="text-h6 text--primary">{{item.delivery.show}}</p>
                </v-col>
              </v-row>

              <v-col class="text-center">
                    <v-btn color="primary" large width="50%" @click.stop="openDialog(item)">
                      <v-icon left>mdi-file-edit</v-icon>
                      Show More
                    </v-btn>
                  </v-col>
                
              <v-dialog v-model="item.dialog" scrollable width="50%">
                <!-- <template v-slot:activator="{ on, attrs }">
                  <v-col class="text-center">
                    <v-btn color="primary" large width="50%" @click.prevent="" v-bind="attrs" v-on="on">
                      <v-icon left>mdi-file-edit</v-icon>
                      Show More
                    </v-btn>
                  </v-col>
                </template> -->

                <!-- <template> -->
                  
                <!-- </template> -->

                <v-card>
                  <v-card-title class="primary">
                    <span class="white--text">Purchase - {{item.id}}</span>
                    <v-spacer></v-spacer>
                    <!-- <v-btn dark icon @click.prevent="idx.dialog = false"> -->
                    <v-btn dark icon @click.stop="closeDialog(item)">
                      <v-icon large>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                

                  <v-card-text class="background pt-5">
                    <div>Purchase Date</div>
                    <p class="text-h6 text--primary">{{purchaseDateTime(item.time)}}</p>
                    
                    <v-row>
                      <v-col>
                        <div>Total Price</div>
                        <p class="text-h6 text--primary">RM {{item.total}}</p>
                      </v-col>

                      <v-col class="ma-4 ml-auto my-auto">
                        <div>Total items purchased</div>
                        <p class="text-h6 text--primary">{{item.items.length}}</p>
                      </v-col>

                      <v-col class="ma-4 ml-auto my-auto">
                        <div>Delivery Type</div>
                        <p class="text-h6 text--primary">{{item.delivery.show}}</p>
                      </v-col>
                    </v-row>

                    <div class="mb-3">Purchased items</div>
                    <v-expansion-panels class="mx">
                      <v-expansion-panel v-for="(product, index) in item.items" :key="product.productID">
                        <v-expansion-panel-header class="text-body-1 text--primary">
                          <strong>{{product.name}}</strong>
                        </v-expansion-panel-header>
                        
                        <v-expansion-panel-content>
                          <v-row>
                            <v-avatar size="120" tile class="mx-2 mr-4">
                              <v-img :src="product.imgURL"/>
                            </v-avatar>
                            
                            <v-col sm="12" md="3" class="mx-2">
                              <v-row align="center" class="my-1">
                                <span class="text-body-1 grey--text text--darken-2">Price per item:&nbsp;</span>
                                <span class="text-body-1 text--primary"><strong>RM {{product.price}}</strong></span>
                              </v-row>
                              <v-row align="center" class="my-1">
                                <span class="text-body-1 grey--text text--darken-2">Quantity:&nbsp;</span>
                                <span class="text-body-1 text--primary"><strong>{{product.itemQuantity}}</strong></span>
                              </v-row>
                              <v-row align="center" class="my-1">
                                <span class="text-body-1 text--primary"><strong>Total: RM{{product.price * product.itemQuantity}}</strong></span>
                              </v-row>
                            </v-col>

                            <template v-if="(product.rating !== null) && (product.review !== null)">
                              <v-col sm="12" md="6" class="mx-2">
                                <v-row align="center" class="my-1">
                                  <span class="text-body-1 text--primary"><strong>Rating &amp; Review</strong></span>
                                </v-row>
                                <v-row align="center" class="my-1">
                                  <v-rating :value="product.rating" color="primary" background-color="primary" dense half-increments readonly size="18" class="mb-1"/>
                                  <span class="text-body-2 grey--text text--darken-2">&nbsp;({{product.rating}})</span>
                                </v-row>
                                <v-row align="center" class="my-1">
                                  <span class="text-body-2 grey--text text--darken-2 reviewText">
                                    {{product.review}}
                                  </span>
                                </v-row>
                              </v-col>
                            </template>

                            <template v-if="(product.rating === null) || (product.review === null)">
                              <v-col sm="12" md="6" class="mx-2">
                                <v-row align="center" class="my-1">
                                  <span class="text-body-1 text--primary"><strong>Rating &amp; Review</strong></span>
                                </v-row>
                                <v-row align="center" class="my-1">
                                  <v-alert dense text outlined color="primary">
                                    <span class="text-body-2">Looks like you still haven't review this product. <strong>Review it now!</strong></span>
                                  </v-alert>
                                </v-row>
                                <v-row align="center" class="my-1">
                                  <v-btn color="primary" width="50%" @click.prevent="reviewProduct(item.id, index)">
                                    <v-icon left>mdi-file-edit</v-icon>
                                    Review Product
                                  </v-btn>
                                </v-row>
                              </v-col>
                            </template>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>

                  </v-card-text>
                </v-card>
              </v-dialog>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {getPurchases} from "../../firebase/functions/purchased"
import loadingDialog from "../components/loadingDialog.vue"

export default {
  components:{
    loadingDialog,
  },
  data(){
    return{
      pageLoading: false,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",
      purchasedItems: [],
      dialog: false
    }
  },
  async mounted() {
    let self = this
    this.pageLoading = true
    const userState = JSON.parse(this.$store.getters["uState/getUserState"])
    this.purchasedItems = await getPurchases(userState.uid)
    this.purchasedItems.sort((a, b) => b.time.toDate() - a.time.toDate())
    // this.purchasedItems.sort((a, b) => (a.time < b.time)? 1 : (a.time === b.time)? ((a.time < b.time)? 1 : -1) : -1)
    // console.log(JSON.stringify(this.purchasedItems))
    setTimeout(function(){
      self.pageLoading = false
    }, 2000)
  },
  methods:{
    openDialog(item){
      this.$set(item, "dialog", true)
    },
    closeDialog(item){
      this.$set(item, "dialog", false)
    },
    purchaseDateTime(timestampObj){  
      let dateObj = new Date(timestampObj.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
      return `${date} - ${time}`
    },
    // eslint-disable-next-line
    reviewProduct(purchaseID, index){
      // console.log(index) console.log(purchaseID)
      this.$router.push({
        name: "review",
        params: {purchaseID: purchaseID, index: index}
      })
    }
  }
}
</script>

<style scoped>
.reviewText{
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
</style>