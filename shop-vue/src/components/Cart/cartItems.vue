<template>
  <v-col sm="12" md="7">
    <v-card rounded="lg" color="" elevation="5" class="d-flex mb-5 mx-5" v-for="(item, index) in cartItems" :key="index">
        <div class="ma-4">
          <v-avatar size="120" tile>
            <v-img :src="item.imgURL"/>
          </v-avatar>
        </div>

        <div class="my-4">
          <v-card-text>
            <v-row align="center">
              <span class="text-h5 font-weight-medium">{{item.name}}</span>
            </v-row>
            <v-row align="center">
              <span class="text-body-1 font-weight-medium">RM {{item.price}}</span>
              <span class="text-body-1 font-weight-normal">&nbsp;per piece</span>
            </v-row>
            <v-row align="center">
              <span class="text-body-1 font-weight-normal">Quantity:&nbsp;</span>
              <span class="text-body-1 font-weight-medium">{{item.itemQuantity}}</span>
            </v-row>
            <v-row align="center" class="mt-4">
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

    <snack-bar :show.sync="showSnackbar" :timeout.sync="snackbarTimeout" :color.sync="snackbarColor" :message.sync="snackbarMessage" />
  </v-col>
</template>

<script>
import snackBar from "../Reuseable/snackbar.vue"

export default {
  name: "cartItmes",
  components: {
    snackBar,
  },
  data(){
    return{
      cartItems: [],
      newItemQuantity: 1,
      showSnackbar: false,
      snackbarColor: "",
      snackbarMessage: "",
      snackbarTimeout: null,
    }
  },
  mounted(){
    this.cartItems = this.$store.getters["uCart/getUserCart"]
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
  }
}
</script>