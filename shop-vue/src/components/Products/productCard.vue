<template>
  <div>
    <v-row class="mx-2 align-center">
      <v-col sm="12" md="6" lg="3" class="" v-for="product in products" :key="product.id">
        <v-card rounded="lg" color="" elevation="10" width="88%" class="my-2 mx-auto pointer">
          <!-- <div @click.prevent="changeRoute('productDetails', product.id)"> -->
          <!-- <router-link :to="`product/${product.id}`" style="text-decoration: none; color: black;"> -->
          <router-link :to="{name: 'productDetails', params: {productID: product.id}}" style="text-decoration: none; color: black;">
            <v-img height="250" class="mx-3 mb-2" :src="product.prodImgURL" />
            <v-divider class="mx-4"/>
            <v-card-title>{{product.prodName}}</v-card-title>
            
            <v-card-text>
              <v-row align="center" class="mx-0">
                <span class="text-body-1 font-weight-medium">RM {{parseFloat(product.prodPrice).toFixed(2)}}</span>
              </v-row>
              <v-row align="center" class="mx-0 mb-1">
                <v-rating :value="product.prodRating" color="primary" background-color="primary" dense half-increments readonly size="18" />
                <span class="grey--text ms-2 mt-1">{{product.prodRating}} ({{product.prodReviews}})</span>
              </v-row>
              <div class="my-1 mb-3">
                <span class="prodCardDesc">{{product.prodDescription}}</span>
              </div>
              <v-divider/>
            </v-card-text>
          </router-link>
        
          <div class="mx-4 pb-4">
            <v-btn block large color="primary" @click.prevent="addToCart(product)">
              <v-icon class="mr-4">mdi-cart-plus</v-icon>
              <span>Add To Cart</span> 
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import store from "@/store/index"
import {ref} from '@vue/composition-api'

export default {
  name: "productCard",
  props: {
    products: {type: Array, required: true},
    snackbarProp: {type: Object, required: true}
  },
  setup(props, {emit}){
    const snackBar = ref(props.snackbarProp)

    const addToCart = (product) => {
      snackBar.value.show = true
      snackBar.value.timeout = 1000
      snackBar.value.color = "primary"
      snackBar.value.message = "Item successfully added into your shopping cart."
      let cartItems = store.getters["uCart/getUserCart"]
      let index = cartItems.findIndex(element => element.productID === product.id)
      if(index !== -1){
        let updatedQuantity = cartItems[index].itemQuantity += 1
        store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: updatedQuantity})
      }else{
        store.dispatch("uCart/addProductToCart", {product: {
          sellerID: product.sID,
          productID: product.id,
          name: product.prodName,
          category: product.prodCategory,
          imgURL: product.prodImgURL,
          price: product.prodPrice,
          itemQuantity: 1
        }})
      }
      emit("addToCart", snackBar.value)
    }

    return {snackBar, addToCart}
  }
}
</script>

<style scoped>
.prodCardDesc{
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

router-link{
  text-decoration-line: none;
}

.pointer{
  cursor: pointer;
}
</style>