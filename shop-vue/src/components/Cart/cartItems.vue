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
              <span class="text-h6 font-weight-medium">Total: RM {{(item.price * item.itemQuantity).toFixed(2)}}</span>
            </v-row>
          </v-card-text>
        </div>

        <div v-show="!item.show" class="ma-4 ml-auto my-auto">
          <div class="d-flex align-center my-4">
            <v-btn color="primary" width="100%" @click.prevent="updateMode(item)">
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
          <v-btn fab x-small :disabled="item.newItemQuantity <= 1" color="primary mx-2" @click.prevent="quantityDecrement(item)"> 
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
          <span class="mx-8 text-h5 font-weight-medium primary--text">{{item.newItemQuantity}}</span>
          <v-btn fab x-small color="primary mx-2" @click.prevent="quantityIncrement(item)"> 
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

    <snack-bar :show.sync="snackBar.show" :timeout.sync="snackBar.timeout" :color.sync="snackBar.color" :message.sync="snackBar.message" />
  </v-col>
</template>

<script>
import {onMounted, ref, set} from '@vue/composition-api'
import store from "@/store/index"
import snackBar from "../Reuseable/snackbar.vue"

export default {
  name: "cartItmes",
  components: {
    snackBar,
  },
  setup(){
    const cartItems = ref([])
    const snackBar = ref({show: false, color: null, message: null, timeout: null})

    const quantityIncrement = (item) => item.newItemQuantity++
    const quantityDecrement = (item) => item.newItemQuantity--
    const updateMode = (item) => {
      set(item, "show", true)
      set(item, "newItemQuantity", item.itemQuantity)
    }
    const deleteCartItem = (index) => {
      snackBar.value.show = true
      snackBar.value.timeout = 1000
      snackBar.value.color = "red"
      snackBar.value.message = "Item remove from cart."
      store.dispatch("uCart/deleteProductFromCart", {index: index})
    }
    const cancelUpdate = (item) => {
      set(item, "show", false)
    }
    const updateCart = (index, item) => {
      snackBar.value.show = true
      snackBar.value.timeout = 1000
      snackBar.value.color = "primary"
      snackBar.value.message = "Item quantity successfully updated."
      store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: item.newItemQuantity})
      set(item, "show", false)
    }

    onMounted(() => {
      cartItems.value = store.getters["uCart/getUserCart"]
    })

    return {cartItems, snackBar, quantityIncrement, quantityDecrement, updateMode, deleteCartItem, cancelUpdate, updateCart}
  }
}
</script>