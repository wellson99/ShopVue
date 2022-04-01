<template>
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
            <purchase-dialog :purchaseProp="item" :dialogProp="item.dialog" v-on:closeDialog="closeDialog($event, item)" />
          </v-dialog> 
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {ref, set} from '@vue/composition-api'
import PurchaseDialog from './purchaseDialog.vue'

export default {
  name: "purchaseCard",
  components: {
    PurchaseDialog,
  },
  props: {
    purchaseProp: {type: Array, required: true}
  },
  setup(props){
    const purchasedItems = ref(props.purchaseProp)

    const openDialog = (item) => set(item, "dialog", true)
    const closeDialog = (eventVal, item) => set(item, "dialog", eventVal.dialog)
    const purchaseDateTime = (timestampObj) => {
      let dateObj = new Date(timestampObj.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
      return `${date} - ${time}`
    }

    return {purchasedItems, openDialog, closeDialog, purchaseDateTime}
  }
  // data(){
  //   return{
  //     purchasedItems: this.purchaseProp,
  //     purchase: {},
  //   }
  // },
  // methods:{
  //   openDialog(item){
  //     this.$set(item, "dialog", true)
  //     this.purchase = item
  //   },
  //   closeDialog(item){
  //     // this.$set(item, "dialog", false)
  //     this.purchase.dialog = item.dialog
  //   },
  //   purchaseDateTime(timestampObj){  
  //     let dateObj = new Date(timestampObj.seconds * 1000) 
  //     var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
  //     var time = dateObj.toLocaleString(undefined, {hour12:true, hour:"numeric", minute:"numeric"})
  //     return `${date} - ${time}`
  //   },
  // }
}
</script>