<template>
  <v-container>
    <v-row class="mx-2 align-center">
      <v-col >
        <span class="text-h5 font-weight-medium">Carts</span>
        <br class="mb-1">
        <span class="text-body-1 grey--text text--darken-2">All of your shopping items will display here here.</span>
        <v-divider class="mt-3"/>
      </v-col>
    </v-row>
    <template v-if="!pageLoading">
      <v-row class="mx-2 align-center-top">
        <v-col sm="12" md="7">
          <v-card rounded="lg" color="" elevation="5" class="d-flex mb-5 mx-5" v-for="(item, index) in cartItems" :key="index">
              <div class="ma-4">
                <v-avatar size="120" tile>
                  <!-- <v-img :src="item.product.imgURL"/> -->
                  <v-img :src="item.imgURL"/>
                </v-avatar>
              </div>
              <div class="my-4">
                <v-card-text>
                  <v-row align="center">
                    <!-- <span class="text-h5 font-weight-medium">{{item.product.name}}</span> -->
                    <span class="text-h5 font-weight-medium">{{item.name}}</span>
                  </v-row>
                  <v-row align="center">
                    <!-- <span class="text-body-1 font-weight-medium">RM {{item.product.price}}</span> -->
                    <span class="text-body-1 font-weight-medium">RM {{item.price}}</span>
                    <span class="text-body-1 font-weight-normal">&nbsp;per piece</span>
                  </v-row>
                  <v-row align="center">
                    <span class="text-body-1 font-weight-normal">Quantity:&nbsp;</span>
                    <!-- <span class="text-body-1 font-weight-medium">{{item.product.itemQuantity}}</span> -->
                    <span class="text-body-1 font-weight-medium">{{item.itemQuantity}}</span>
                  </v-row>
                  <v-row align="center" class="mt-4">
                    <!-- <span class="text-h6 font-weight-medium">Total: RM {{item.product.price * item.product.itemQuantity}}</span> -->
                    <span class="text-h6 font-weight-medium">Total: RM {{item.price * item.itemQuantity}}</span>
                  </v-row>
                </v-card-text>
              </div>

              <div v-show="!item.show" class="ma-4 ml-auto my-auto">
                <div class="d-flex align-center my-4">
                  <v-btn color="primary" width="100%" @click.prevent="updateMode(index, item)">
                    <v-icon left>mdi-file-edit</v-icon>
                    Update
                  </v-btn>
                </div>
                <div class="d-flex align-center my-4">
                  <v-btn text color="red" width="100%" @click.prevent="deleteCartItem(index)">
                    <v-icon left>mdi-delete</v-icon>
                    Remove
                  </v-btn>
                </div>
              </div>   

              
              <div v-show="item.show" class="ma-4 ml-auto my-auto">
                <v-btn fab x-small :disabled="newItemQuantity <= 1" color="primary mx-2" @click.prevent="quantityDecrement(index)"> 
                  <v-icon dark>mdi-minus</v-icon>
                </v-btn>
                <span class="mx-8 text-h5 font-weight-medium primary--text">{{newItemQuantity}}</span>
                <v-btn fab x-small color="primary mx-2" @click.prevent="quantityIncrement(index)"> 
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>  
              </div>  
              <div v-show="item.show" class="ma-4 my-auto">
                <div class="d-flex align-center  my-4">
                  <v-btn color="primary" width="100%" @click.prevent="updateCart(index, item)">
                    <v-icon left>mdi-file-edit</v-icon>
                    Update
                  </v-btn>
                </div>
                <div class="d-flex align-center  my-4">
                  <v-btn text color="red" width="100%" @click.prevent="cancelUpdate(item)">
                    <v-icon left>mdi-close</v-icon>
                    Cancel
                  </v-btn>
                </div>
              </div>  
          </v-card>
        </v-col>

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
        </v-col>
      </v-row>
    </template>

    <snack-bar :show.sync="showSnackbar" :timeout.sync="snackbarTimeout" :color.sync="snackbarColor" :message.sync="snackbarMessage" />
    <loading-dialog :show.sync="showDialog" :message.sync="dialogMessage" />
    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {purchase} from "../../firebase/functions/purchased"
import snackBar from "../components/snackbar.vue"
import loadingDialog from "../components/loadingDialog.vue"

export default {
  components:{
    snackBar,
    loadingDialog,
  },
  data(){
    return{
      pageLoading: false,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",
      cartItems: [],
      newItemQuantity: 1,
      showSnackbar: false,
      snackbarColor: "",
      snackbarMessage: "",
      snackbarTimeout: null,
      showDialog: false,
      dialogMessage: "",
      selectedDeliveryType: {type: "Standard Delivery", price: 0, show: "Standard Delivery - Free"},
      deliveryType: [
        {type: "Standard Delivery", price: 0, show: "Standard Delivery - Free"},
        {type: "Premium Delivery", price: 9, show: "Premium Delivery - RM 9"},
      ],
    }
  },
  mounted() {
    let self = this
    this.pageLoading = true
    this.cartItems = this.$store.getters["uCart/getUserCart"]
    setTimeout(function(){
      self.pageLoading = false
    }, 750)
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
    quantityIncrement(){
      this.newItemQuantity++
    },
    quantityDecrement(){
      this.newItemQuantity--
    },
    updateMode(index, item){
      console.log("test", JSON.stringify(item))
      this.$set(item, "show", true)
      this.newItemQuantity = this.cartItems[index].itemQuantity
    },
    deleteCartItem(index){
      this.showSnackbar = true
      this.snackbarTimeout = 1000
      this.snackbarColor = "red"
      this.snackbarMessage = "Item remove from cart."
      this.$store.dispatch("uCart/deleteProductFromCart", {index: index})
    },
    cancelUpdate(item){
      this.$set(item, "show", false)
      this.newItemQuantity = 1
    },
    updateCart(index, item){
      this.showSnackbar = true
      this.snackbarTimeout = 1000
      this.snackbarColor = "primary"
      this.snackbarMessage = "Item quantity successfully updated."
      this.$store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: this.newItemQuantity})
      this.$set(item, "show", false)
      this.newItemQuantity = 1
    },
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