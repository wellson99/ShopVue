<template>
  <div>
    <v-row class="mx-2 align-center-top">
      <v-col sm="12" md="7">
        <v-card rounded="lg" color="" elevation="1"  class="my-2 mx-5">
          <v-img contain height="600" :src="product.imgURL"/>
        </v-card>
      </v-col>

      <v-col sm="12" md="5">
        <v-card rounded="lg" color="" elevation="10" class="my-2 mx-5">
          <v-card-title class="text-h4 font-weight-medium">{{product.name}}</v-card-title>

          <v-card-text>
            <v-row align="center" class="mx-0 mb-1">
              <span class="text-h5 font-weight-medium">RM {{product.price}}</span>
            </v-row>

            <v-row align="center" class="mx-0  mb-1">
              <span class="text-subtitle-1 font-weight-regular">{{product.description}}</span>
            </v-row>
            
            <v-divider class="my-4"/>

            <v-row align="center" class="mx-0">
              <v-col class="text-center">
                <v-rating :value="product.rating" color="primary" background-color="primary" dense half-increments readonly size="24" />
                <p class="text-h6 font-weight-regular primary--text">Ratings</p>
              </v-col>

              <v-col class="text-center">
                <span class="text-h6 font-weight-bold primary--text">{{product.reviews}}</span>
                <p class="text-h6 font-weight-regular primary--text">Reviews</p>
              </v-col>

              <v-col class="text-center">
                <span class="text-h6 font-weight-bold primary--text">{{product.sold}}+</span>
                <p class="text-h6 font-weight-regular primary--text">Sold</p>
              </v-col>
            </v-row>

            <v-divider/>
            <v-row align="center" class="mx-0 my-3">
              <v-col class="mx-0">
                <span class="text-h5 font-weight-medium">{{product.quantity}} </span>
                <span class="text-h6 font-weight-regular">&nbsp;Pieces available</span>
              </v-col>
              
              <v-col class="d-flex justify-center">
                <v-btn fab small :disabled="this.product.itemQuantity <= 1" color="primary mx-2" @click.prevent="itemCountDecrement"> 
                  <v-icon dark>mdi-minus</v-icon>
                </v-btn>

                <span class="mx-10 text-h4 font-weight-medium primary--text">{{this.product.itemQuantity}}</span>

                <v-btn fab small :disabled="this.product.itemQuantity === 10" color="primary mx-2" @click.prevent="itemCountIncrement"> 
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row align="center" justify="center" class="mx-0 my-5">
              <v-btn v-show="!isWishlist" x-large color="primary" width="65%" @click.prevent="addToWishlists()">
                <v-icon class="mr-4">mdi-cards-heart-outline</v-icon>
                <span>Add to Wishlist</span> 
              </v-btn>

              <v-btn v-show="isWishlist" x-large color="primary" width="65%" @click.prevent="removeFromWishlists()">
                <v-icon class="mr-4">mdi-cards-heart</v-icon>
                <span>In your Wishlist</span> 
              </v-btn>
            </v-row>

            <v-row align="center" justify="center" class="mx-0 mb-2">
              <v-btn x-large color="primary" width="65%" @click.prevent="addToCart()">
                <v-icon class="mr-4">mdi-cart-plus</v-icon>
                <span>Add To Cart</span> 
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import store from "@/store/index"
import {onMounted, ref} from '@vue/composition-api'
import {wishlistProduct, removeWishlist} from "../../../firebase/functions/product"
export default {
  name: "productInfo",
  props: {
    productInfo: {type: Array, required: true}, 
    productWishlist: {type: Array, required: true}, 
    snackBarProp: {type: Object, required: true}
  },
  setup(props, {emit}){
    const cartItems = ref([])
    const isWishlist = ref(null)
    const wishlistID = ref(null)
    const product = ref({
      sellerID: null, productID: null, name: null, category: null, description: null, imgURL: null,
        price: 0, quantity: 0, sold: 0, reviews: 0, rating: 0, itemQuantity: 1
    })
    const snackBar = ref(props.snackBarProp)
    const userState = JSON.parse(store.getters["uState/getUserState"])

    const itemCountIncrement = () => product.value.itemQuantity++
    const itemCountDecrement = () => product.value.itemQuantity--
    const addToCart = () => {
      snackBar.value.show = true
      snackBar.value.timeout = 1000
      snackBar.value.color = "primary"
      snackBar.value.message = "Item successfully added into your shopping cart."
      emit("addToWishlists", snackBar.value)
      let newnum = product.value.itemQuantity
      cartItems.value = store.getters["uCart/getUserCart"]
      let index = cartItems.value.findIndex(item => item.productID === product.value.productID)
      if(index !== -1){
        let updatedQuantity = cartItems[index].value.itemQuantity += newnum
        store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: updatedQuantity})
      }else{
        console.log("else ", product.value.itemQuantity)
        store.dispatch("uCart/addProductToCart", {product: {
          sellerID: product.value.sellerID,
          productID: product.value.productID,
          name: product.value.name,
          category: product.value.category,
          imgURL: product.value.imgURL,
          price: product.value.price,
          itemQuantity: newnum
        }})
      }
      product.value.itemQuantity = 1
      emit("addToCart", snackBar.value)
    }
    const addToWishlists = async () => {
      wishlistProduct(product.value.productID, userState.uid).then((result) => {
        if(result.success){
          wishlistID.value = result.id
          isWishlist.value = true
          snackBar.value.show = true
          snackBar.value.timeout = 1000
          snackBar.value.color = "primary"
          snackBar.value.message = "Item added into your wishlist."
          emit("addToWishlists", snackBar.value)
        }else{
          console.log(result.message)
        }
      })
    }
    const removeFromWishlists = async () => {
      removeWishlist(wishlistID.value, userState.uid).then((result) => {
        if(result.success){
          wishlistID.value = null
          isWishlist.value = false
          snackBar.value.show = true
          snackBar.value.timeout = 1000
          snackBar.value.color = "red"
          snackBar.value.message = "Item removed into your wishlist."
          emit("removeFromWishlists", snackBar.value)
        }else{
          console.log(result.message)
        }
      })
    }

    onMounted(() => {
      props.productInfo.map((info) => {
        product.value.sellerID = info.sID
        product.value.productID = info.id
        product.value.name = info.prodName
        product.value.category = info.prodCategory
        product.value.imgURL = info.prodImgURL
        product.value.description = info.prodDescription
        product.value.price = info.prodPrice
        product.value.quantity = info.prodQuantity
        product.value.sold = info.prodSold
        product.value.reviews = info.prodReviews
        product.value.rating = info.prodRating
      })

      if(props.productWishlist.length === 1){
        isWishlist.value = true
        wishlistID.value = props.productWishlist[0].id
      }else{
        isWishlist.value = false
      }
    })

    return {
      cartItems, isWishlist, wishlistID, product, snackBar, addToWishlists, removeFromWishlists, itemCountIncrement, itemCountDecrement, addToCart
    }
  }
}
</script>