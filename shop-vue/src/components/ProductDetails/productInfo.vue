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
/* eslint-disable */
import {wishlistProduct, removeWishlist} from "../../../firebase/functions/product"
export default {
  name: "productInfo",
  props: {
    productInfo: {type: Array, required: true}, 
    productWishlist: {type: Array, required: true}, 
    snackBarProp: {type: Object, required: true}
  },
  data(){
    return{
      cartItems: [],
      isWishlist: null,
      wishlistID: null,
      product: {
        sellerID: "",
        productID: "",
        name: "",
        category: "",
        description: "",
        imgURL: "",
        price: 0,
        quantity: 0,
        sold: 0,
        reviews: 0,
        rating: 0,
        itemQuantity: 1,
      },
      snackBar: {
        show: this.snackBarProp.show,
        timeout: this.snackBarProp.timeout,
        color: this.snackBarProp.color,
        message: this.snackBarProp.message
      }
    }
  },
  mounted(){
    this.productInfo.map((info) => {
      this.product.sellerID = info.sID
      this.product.productID = info.id
      this.product.name = info.prodName
      this.product.category = info.prodCategory
      this.product.imgURL = info.prodImgURL
      this.product.description = info.prodDescription
      this.product.price = info.prodPrice
      this.product.quantity = info.prodQuantity
      this.product.sold = info.prodSold
      this.product.reviews = info.prodReviews
      this.product.rating = info.prodRating
    })

    if(this.productWishlist.length === 1){
      this.isWishlist = true
      this.wishlistID = this.productWishlist[0].id
    }else{
      this.isWishlist = false
    }
  },
  methods:{
    itemCountIncrement(){
      this.product.itemQuantity++
    },
    itemCountDecrement(){
      this.product.itemQuantity--
    },
    async addToWishlists(){
      const userState = JSON.parse(this.$store.getters["uState/getUserState"])
      await wishlistProduct(this.product.productID, userState.uid).then((result) => {
        if(result.success){
          this.wishlistID = result.id
          this.isWishlist = true
          this.snackBar.show = true
          this.snackBar.timeout = 1000
          this.snackBar.color = "primary"
          this.snackBar.message = "Item added into your wishlist."
          this.$emit("addToWishlists", this.snackBar)
        }else{
          console.log(result.message)
        }
      })
    },
    async removeFromWishlists(){
      const userState = JSON.parse(this.$store.getters["uState/getUserState"])
      await removeWishlist(this.wishlistID, userState.uid).then((result) => {
        if(result.success){
          this.wishlistID = null
          this.isWishlist = false
          this.snackBar.show = true
          this.snackBar.timeout = 1000
          this.snackBar.color = "red"
          this.snackBar.message = "Item removed into your wishlist."
          this.$emit("removeFromWishlists", this.snackBar)
        }else{
          console.log(result.message)
        }
      })
    },
    addToCart(){
      this.snackBar.show = true
      this.snackBar.timeout = 1000
      this.snackBar.color = "primary"
      this.snackBar.message = "Item successfully added into your shopping cart."
      this.$emit("addToWishlists", this.snackBar)
      let newnum = this.product.itemQuantity
      this.cartItems = this.$store.getters["uCart/getUserCart"]
      let index = this.cartItems.findIndex( el => el.productID === this.product.productID )
      if(index !== -1){
        let updatedQuantity = this.cartItems[index].itemQuantity += newnum
        this.$store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: updatedQuantity})
      }else{
        console.log("else ",this.product.itemQuantity)
        this.$store.dispatch("uCart/addProductToCart", {product: {
          sellerID: this.product.sellerID,
          productID: this.product.productID,
          name: this.product.name,
          category: this.product.category,
          imgURL: this.product.imgURL,
          price: this.product.price,
          itemQuantity: newnum
        }})
      }
      this.product.itemQuantity = 1
      this.$emit("addToCart", this.snackBar)
    },
  }
}
</script>