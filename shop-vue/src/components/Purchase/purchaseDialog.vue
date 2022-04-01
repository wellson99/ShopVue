<template>
  <div>
    <v-card>
      <v-card-title class="primary">
        <span class="white--text">Purchase - {{purchase.id}}</span>
        <v-spacer></v-spacer>
        <v-btn dark icon @click="closeDialog()">
          <v-icon large>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
    
      <v-card-text class="background pt-5">
        <div>Purchase Date</div>
        <p class="text-h6 text--primary">{{purchaseDateTime(purchase.time)}}</p>
        <v-row>
          <v-col>
            <div>Total Price</div>
            <p class="text-h6 text--primary">RM {{purchase.total}}</p>
          </v-col>
          <v-col class="ma-4 ml-auto my-auto">
            <div>Total items purchased</div>
            <p class="text-h6 text--primary">{{purchase.items.length}}</p>
          </v-col>
          <v-col class="ma-4 ml-auto my-auto">
            <div>Delivery Type</div>
            <p class="text-h6 text--primary">{{purchase.delivery}}</p>
          </v-col>
        </v-row>

        <div class="mb-3">Purchased items</div>
        
        <v-expansion-panels class="mx">
          <v-expansion-panel v-for="(product, index) in purchase.items" :key="product.productID">
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
                      <router-link :to="{path:`/purchase/${purchase.id}/review/${product.productID}/${index}`}" >
                        <v-btn color="primary"> 
                          <v-icon left>mdi-file-edit</v-icon>
                            Review Product
                        </v-btn>
                      </router-link>
                    </v-row>
                  </v-col>
                </template>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {ref} from '@vue/composition-api'

export default {
  name: "purchaseDialog",
  props: {
    purchaseProp: {type: Object, required: true},
  },
  setup(props, {emit}){
    const purchase = ref({
      dialog: props.purchaseProp.dialog,
      id: props.purchaseProp.id, 
      time: props.purchaseProp.time, 
      total: props.purchaseProp.total, 
      delivery: props.purchaseProp.delivery.show, 
      items: props.purchaseProp.items
    })

    const closeDialog = () => {
      purchase.value.dialog = false
      emit("closeDialog", purchase.value)
    }
    const purchaseDateTime = (timestampObj) => {
      let dateObj = new Date(timestampObj.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
      return `${date} - ${time}`
    }

    return {purchase, closeDialog, purchaseDateTime}
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