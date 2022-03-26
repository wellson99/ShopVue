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

        <v-snackbar v-model="showSnackbarUpdate" :timeout="1000" elevation="24" multi-line bottom text color="primary">
          Item quantity successfully aupdated
          <template v-slot:action="{ attrs }">
            <v-btn icon color="primary" v-bind="attrs" @click="showSnackbar = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>

        <v-snackbar v-model="showSnackbarDelete" :timeout="1000" elevation="24" multi-line bottom text color="red">
          Item remove from cart
          <template v-slot:action="{ attrs }">
            <v-btn icon color="red" v-bind="attrs" @click="showSnackbar = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
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
                  item-value="price" :menu-props="{ bottom: true, offsetY: false }"/>
              </v-row>
            </div>
            
            <div class="mb-6">
              <v-row align="center">
                <span class="text-h5 font-weight-medium">Total: RM{{calculateGrandTotal}}</span>
              </v-row>
            </div>
           
            <v-divider class="mb-5"/>
            

            

            <v-row align="center" justify="center" class="mt-6 mb-3">
              <v-btn large color="primary" width="45%" :disabled="!cartItems.length" @click.prevent="purchasrItems()">
                <v-icon class="mr-4">mdi-cash-register</v-icon>
                <span>Purchase</span> 
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable */
import { collection, addDoc, Timestamp } from "firebase/firestore"; 
import {db} from "../../firebase/firebaseConfig"

export default {
  data(){
    return{
      cartItems: [],
      newItemQuantity: 1,
      showSnackbarUpdate: false,
      showSnackbarDelete: false,
      selectedDeliveryType: {type: "Standard Delivery", price: 0, show: "Standard Delivery - Free"},
      deliveryType: [
        {type: "Standard Delivery", price: 0, show: "Standard Delivery - Free"},
        {type: "Premium Delivery", price: 9, show: "Premium Delivery - RM 9"},
      ],

      purchase: []
    }
  },
  mounted() {
    // localStorage.clear("uCart")
    this.cartItems = this.$store.getters["uCart/getUserCart"]
    // console.log("cartView", this.cartItems)
  },
  computed:{
    cartTotalPrice(){
      // let cart = this.$store.getters["uCart/getUserCart"]
      // let cartTotalPrice = 0
      // for(let index = 0; index < cart.length; index++){
      //   var itemTotalPrice = cart[index].product.price * cart[index].product.itemQuantity
      //   cartTotalPrice += itemTotalPrice
      // }
      let cart = this.$store.getters["uCart/getUserCart"]
      let cartTotalPrice = 0
      for(let index = 0; index < cart.length; index++){
        var itemTotalPrice = cart[index].price * cart[index].itemQuantity
        cartTotalPrice += itemTotalPrice
      }
      return cartTotalPrice.toFixed(2)
    },
    calculateGrandTotal(){
      // let cartTotalPrice = this.cartTotalPrice
      // let deliveryFee = this.selectedDeliveryType.price
      let grandTotal = 0
      grandTotal = parseFloat(this.cartTotalPrice) + parseFloat(this.selectedDeliveryType.price)
      return grandTotal.toFixed(2)
    },
    
  },
  methods: {
    updateMode(index, item){
      console.log("test", JSON.stringify(item))
      // item.show = true
      this.$set(item, "show", true)
      // this.newItemQuantity = this.cartItems[index].product.itemQuantity
      this.newItemQuantity = this.cartItems[index].itemQuantity
    },
    cancelUpdate(item){
      this.$set(item, "show", false)
      this.newItemQuantity = 1
    },

    
    deleteCartItem(index){
      this.showSnackbarDelete = true
      this.$store.dispatch("uCart/deleteProductFromCart", {index: index})
    },

    quantityIncrement(){
      this.newItemQuantity++
    },
    quantityDecrement(){
      
      this.newItemQuantity--
      
    },

    updateCart(index, item){
      this.showSnackbarUpdate = true
      this.$store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: this.newItemQuantity})
      // item.show = false
      this.$set(item, "show", false)
      this.newItemQuantity = 1
    },

    async purchasrItems(){
      // this.purchase.push({items: this.cartItems}, {total: this.calculateGrandTotal}, 
      //   {time: new Date().toLocaleDateString("en-MY", {hour12: false, hour: "numeric", minute:"numeric"})}, {delivery: this.selectedDeliveryType}
      // )
      this.cartItems = this.cartItems.map(item => ({...item, rating: null, review: null}))

      const userState = JSON.parse(this.$store.getters["uState/getUserState"])
      // console.log(userState.uid)
      await addDoc(collection(db, "Users", userState.uid, "Purchase"), {
        items: this.cartItems,
        total: this.calculateGrandTotal,
        time: Timestamp.now(),
        // time: new Date().toLocaleDateString("en-MY", {hour12: false, hour: "numeric", minute:"numeric"}),
        delivery: this.selectedDeliveryType
      }).then(async () => {
        await this.$store.dispatch("uCart/clearCart")
        this.cartItems = []
        console.log("success")
        this.$router.push("/purchase")
      }).catch(
        (e) => console.log(e.message)
      )

      // this.purchase.push({items: this.cartItems})
      // console.log(JSON.stringify(this.selectedDeliveryType))
      // console.log(JSON.stringify(this.purchase[0].items[1].product))

      // this.purchase.push(this.cartItems)
      // console.log(JSON.stringify(this.purchase[0][0].product))
      // console.log(JSON.stringify(this.purchase[0][0]))
    }

  }
}
</script>