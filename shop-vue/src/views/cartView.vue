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
                <v-img :src="item.product.imgURL"/>
              </v-avatar>
            </div>
            <div class="my-4">
              <v-card-text>
                <v-row align="center">
                  <span class="text-h5 font-weight-medium">{{item.product.name}}</span>
                </v-row>
                <v-row align="center">
                  <span class="text-body-1 font-weight-medium">RM {{item.product.price}}</span>
                  <span class="text-body-1 font-weight-normal">&nbsp;per piece</span>
                </v-row>
                <v-row align="center">
                  <span class="text-body-1 font-weight-normal">Quantity:&nbsp;</span>
                  <span class="text-body-1 font-weight-medium">{{item.product.itemQuantity}}</span>
                </v-row>
                <v-row align="center" class="mt-4">
                  <span class="text-h6 font-weight-medium">Total: RM {{item.product.price * item.product.itemQuantity}}</span>
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
    </v-row>
  </v-container>
</template>

<script>
export default {
  data(){
    return{
      cartItems: [],
      newItemQuantity: 1,
    }
  },
  mounted() {
    this.cartItems = this.$store.getters["uCart/getUserCart"]
    console.log("cartView", this.cartItems)
  },
  methods: {
    updateMode(index, item){
      // console.log("test", JSON.stringify(this.cartItems[index].product))
      // this.cartItems[index].product.itemQuantity = 
      item.show = true
      this.newItemQuantity = this.cartItems[index].product.itemQuantity
    },
    cancelUpdate(item){
      item.show = false
      this.newItemQuantity = 1
    },

    
    deleteCartItem(index){
      this.$store.dispatch("uCart/deleteProductFromCart", {index: index})
      console.log("deleted\n",this.$store.getters["uCart/getUserCart"])
      // this.cartItems.splice(index, 1)
      // console.log("after del ", JSON.stringify(this.cartItems))
      // console.log("cartStore ", this.$store.getters["uCart/getUserCart"])
    },

    quantityIncrement(){
      this.newItemQuantity++
    },
    quantityDecrement(){
      
      this.newItemQuantity--
      
    },

    updateCart(index, item){
      this.$store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: this.newItemQuantity})
      item.show = false
      this.newItemQuantity = 1
      console.log("item quantity\n",this.newItemQuantity)
      console.log("update\n",JSON.stringify(this.$store.getters["uCart/getUserCart"]))
    },

  }
}
</script>