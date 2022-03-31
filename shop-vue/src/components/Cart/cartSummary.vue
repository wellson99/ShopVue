<template>
  <v-col sm="12" md="12" lg="5">
    <v-card rounded="lg" color="" elevation="5" class="d-flex mx-5">
      <v-card-text class="mx-3">
        <div class="mb-3"> 
          <v-row align="center" class="my-0">
            <span class="text-h6 font-weight-medium">Items in cart ({{cartItems.length}})</span>
          </v-row>
          <v-row align="center" class="my-0">
            <span class="text-h6 font-weight-medium">RM {{cartTotalPrice}}</span>
          </v-row>
        </div>

        <div class="mt-3">
          <v-row align="center" class="my-0">
            <span class="text-h6 font-weight-medium">Delivery Method</span>
          </v-row>
          <v-row align="center" class="my-0">
            <v-select :items="deliveryType" v-model="selectedDeliveryType" solo item-text="show" return-object
              item-value="price" :menu-props="{ bottom: true, offsetY: false }" :disabled="!cartItems.length" />
          </v-row>
        </div>
        
        <div class="mb-6">
          <v-row align="center">
            <span class="text-h5 font-weight-medium">Total: RM{{calculateGrandTotal}}</span>
          </v-row>
        </div>
      
        <v-divider class="mb-5"/>

        <v-row align="center" justify="center" class="mt-6 mb-3">
          <v-btn large color="primary" width="45%" :disabled="!cartItems.length" @click.prevent="purchaseItems()">
            <v-icon class="mr-4">mdi-cash-register</v-icon>
            <span>Purchase</span> 
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>

    <loading-dialog :show.sync="showDialog" :message.sync="dialogMessage" />
  </v-col>
</template>

<script>
import {purchase} from "../../../firebase/functions/purchased"
import loadingDialog from "../../components/Reuseable/loadingDialog.vue"

export default {
  name: "cartSummary",
  components: {
    loadingDialog
  },
  data(){
    return{
      showDialog: false,
      dialogMessage: "",
      cartItems: [],
      selectedDeliveryType: {type: "Standard Delivery", price: 0, show: "Standard Delivery - Free"},
      deliveryType: [
        {type: "Standard Delivery", price: 0, show: "Standard Delivery - Free"},
        {type: "Premium Delivery", price: 9, show: "Premium Delivery - RM 9"},
      ],
    }
  },
  mounted(){
    this.cartItems = this.$store.getters["uCart/getUserCart"]
  },
  computed:{
    cartTotalPrice(){
      let cart = this.$store.getters["uCart/getUserCart"]
      let cartTotalPrice = 0
      for(let index = 0; index < cart.length; index++){
        var itemTotalPrice = cart[index].price * cart[index].itemQuantity
        cartTotalPrice += itemTotalPrice
      }
      return cartTotalPrice.toFixed(2)
    },
    calculateGrandTotal(){
      let grandTotal = 0
      grandTotal = parseFloat(this.cartTotalPrice) + parseFloat(this.selectedDeliveryType.price)
      return grandTotal.toFixed(2)
    },
  },
  methods: {
    async purchaseItems(){
      this.showDialog = true
      this.dialogMessage = "Hang on, processing your purchase ..."
      this.cartItems = this.cartItems.map(item => ({...item, rating: null, review: null}))
      const userState = JSON.parse(this.$store.getters["uState/getUserState"])
      let purchaseInfo = {
        cartItems: this.cartItems,
        grandTotal: this.calculateGrandTotal,
        deliveryType: this.selectedDeliveryType
      }

      await purchase(purchaseInfo, userState.uid).then((result) => {
        let router = this.$router
        let store = this.$store
        let self = this
        if(result.success){
          setTimeout(async function(){
            await store.dispatch("uCart/clearCart")
            self.cartItems = []
            self.showDialog = false
            router.push("/purchase")
          }, 2000)
        }else{
          console.log(result.message)
        }
      })
    },
  }
}
</script>