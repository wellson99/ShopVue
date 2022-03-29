<template>
  <v-container>
    <v-row class="mx-2 align-center">
      <v-col >
        <span class="text-h5 font-weight-medium">Product Details</span>
        <br class="mb-1">
        <span class="text-body-1 grey--text text--darken-2">Find all the products here.</span>
        <v-divider class="mt-3"/>
      </v-col>
    </v-row>

    <template v-if="!pageLoading">
      <v-row class="mx-2 align-center-top">
        <v-col sm="12" md="7">
          <v-card rounded="lg" color="" elevation="1"  class="my-2 mx-5">
            <v-img contain height="600" :src="product.imgURL"/>
          </v-card>
        </v-col>

        <v-col sm="12" md="5">
          <v-card rounded="lg" color="" elevation="10" class="my-2 mx-5">
            <!-- <v-card-title class="text-h4 font-weight-medium">{{productData.prodName}}</v-card-title> -->
            <v-card-title class="text-h4 font-weight-medium">{{product.name}}</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0 mb-1">
                <!-- <span class="text-h5 font-weight-medium">RM {{productData.prodPrice}}</span> -->
                <span class="text-h5 font-weight-medium">RM {{product.price}}</span>
              </v-row>

              <v-row align="center" class="mx-0  mb-1">
                <!-- <span class="text-subtitle-1 font-weight-regular">{{productData.prodDescription}}</span> -->
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
                <!-- <v-btn x-large color="primary" width="65%" @click.prevent="wishlistProduct()"> -->
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

      <v-row class="mx-2 align-center-top">
        <v-col sm="12" md="7">
          <v-card rounded="lg" color="" elevation="10"  class="my-0 mx-5">
            <v-card-title class="text-h5 font-weight-medium">Reviews</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0 d-flex justify-space-between">
                <span class="text-body-1 grey--text text--darken-2">This section display all the users' reiviews.</span>
                <v-menu rounded="lg" offset-y bottom transition="slide-y-transition">
                  <template v-slot:activator="{on, attrs}">
                    <v-btn v-bind="attrs" v-on="on" color="primary" class="ml-1">
                      <span class="text-capitalize text-body-1">Sort By</span> 
                      <v-icon right>mdi-sort</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item :disabled="sortType === 'DateDesc'" @click.prevent="sortReviews('DateDesc')">               
                      <strong>Date</strong> &nbsp;(Latest to Oldest)
                    </v-list-item>

                    <v-list-item :disabled="sortType === 'DateAsc'" @click.prevent="sortReviews('DateAsc')">
                      <strong>Date</strong> &nbsp;(Oldest to Latest)
                    </v-list-item>

                    <v-list-item :disabled="sortType === 'ReviewDesc'" @click.prevent="sortReviews('ReviewDesc')">
                      <strong>Review</strong> &nbsp;(Best to Worst)
                    </v-list-item>

                    <v-list-item :disabled="sortType === 'ReviewAsc'" @click.prevent="sortReviews('ReviewAsc')">
                      <strong>Review</strong> &nbsp;(Worst to Best)
                    </v-list-item>
                  </v-list>
                </v-menu>
                
              </v-row>
              <v-divider class="my-5" />

              <div>
                <div v-for="review in paginatedReviewsList" :key="review.id">
                  <v-row align="center" class="mx-0 mt-2 d-flex justify-space-between">
                    <span class="text-body-1 font-weight-medium black--text">{{review.userName}}</span>
                    <span class="text-body-2 grey--text text--darken-2 mr-3">
                      {{reviewDateTime(review.date)}}
                    </span>
                  </v-row>

                  <v-row align="center" class="mx-0">
                    <v-rating :value="review.rating" color="primary" background-color="primary" dense half-increments readonly size="18" />
                    <span class="ms-2 mt-1">{{review.rating}}</span>
                  </v-row>

                  <v-row align="center" class="mx-0 mt-3">
                    <span class="text-body-1 grey--text text--darken-2">
                      {{review.review}}
                    </span>
                  </v-row>
                  <v-divider class="my-5" />
                </div>
                <v-pagination
                  v-model="page" :length="pages" @input="updatePage"
                ></v-pagination>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
    <snack-bar :show.sync="showSnackbar" :timeout.sync="snackbarTimeout" :color.sync="snackbarColor" :message.sync="snackbarMessage" />    
  </v-container>
</template>

<script>
import {getSingleProduct, wishlistProduct, getWishlists, removeWishlist} from "../../firebase/functions/product"
import {getProductReviews} from "../../firebase/functions/review"
import snackBar from "../components/snackbar.vue"
import loadingDialog from "../components/loadingDialog.vue"

export default {
  components:{
    snackBar, loadingDialog
  },
  data(){
    return{
      pageLoading: false,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",
      isWishlist: null,
      wishlistID: null,
      cartItems: [],

      page: 1,
      pageSize: 4,
      listCount: 0,
      paginatedReviewsList: [],
      productReviews: [],
      sortType: "DateDesc",

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

      showSnackbar: false,
      snackbarColor: "",
      snackbarMessage: "",
      snackbarTimeout: null,
    }
  },
  // props:[
  //   'productData',
  // ],
  computed: {
    
    pages () {
      if(this.pageSize == null || this.listCount == null){
        return 0
      }
      return Math.ceil(this.listCount / this.pageSize)
    }
  },
  async mounted(){
    let self = this
    this.pageLoading = true

    let product = await getSingleProduct(this.$route.params.productID)
    product.map((prod) => {
      this.product.sellerID = prod.sID
      this.product.productID = prod.id
      this.product.name = prod.prodName
      this.product.category = prod.prodCategory
      this.product.imgURL = prod.prodImgURL
      this.product.description = prod.prodDescription
      this.product.price = prod.prodPrice
      this.product.quantity = prod.prodQuantity
      this.product.sold = prod.prodSold
      this.product.reviews = prod.prodReviews
      this.product.rating = prod.prodRating
    })

    const userState = JSON.parse(this.$store.getters["uState/getUserState"])
    let wishlist = await getWishlists(userState.uid, this.$route.params.productID)
    if(wishlist.length === 1){
      this.isWishlist = true
      this.wishlistID = wishlist[0].id
    }else{
      this.isWishlist = false
    }

    this.productReviews = await getProductReviews(this.$route.params.productID)
    this.productReviews.sort((a, b) => b.date - a.date)
    this.initPage(this.productReviews)
    this.updatePage(this.page)

    setTimeout(function(){
      self.pageLoading = false
    }, 1250)
  },
  methods: {
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
          // console.log(result.id)
          this.wishlistID = result.id
          this.isWishlist = true
          this.showSnackbar = true
          this.snackbarTimeout = 1000
          this.snackbarColor = "primary"
          this.snackbarMessage = "Item added into your wishlist."
          console.log(this.wishlistID)
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
          this.showSnackbar = true
          this.snackbarTimeout = 1000
          this.snackbarColor = "red"
          this.snackbarMessage = "Item removed into your wishlist."
        }else{
          console.log(result.message)
        }
      })
    },
    addToCart(){
      this.showSnackbar = true
      this.snackbarTimeout = 1000
      this.snackbarColor = "primary"
      this.snackbarMessage = "Item successfully added into your shopping cart."
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
    },

    display(){
      console.log("display", JSON.stringify(this.$store.getters["uCart/getUserCart"]))
    },

    initPage(list){
      this.listCount = list.length
      if(this.listCount < this.pageSize){
        this.paginatedReviewsList = list
      }else{
        this.paginatedReviewsList = list.slice(0, this.pageSize)
      }
    },

    updatePage(index){
      let start = (index - 1) * this.pageSize
      let end = index * this.pageSize
      this.paginatedReviewsList = this.productReviews.slice(start, end)
      this.page = index
    },

    reviewDateTime(timestampObj){  
      let dateObj = new Date(timestampObj.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:false, hour:"numeric", minute:"numeric"})
      return `${date} at ${time}`
    },

    sortReviews(sortBy){
      switch(sortBy){
        case "DateDesc":
          this.productReviews.sort((a, b) => b.date.toDate() - a.date.toDate())
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.productReviews)
          break
        case "DateAsc":
          this.productReviews.sort((a, b) => a.date.toDate() - b.date.toDate())
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.productReviews)
          break
        case "ReviewDesc":
          this.productReviews.sort((a, b) => b.rating - a.rating)
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.productReviews)
          break
        case "ReviewAsc":
          this.productReviews.sort((a, b) => a.rating - b.rating)
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.productReviews)
          break
      }
    }
    
  }
}
</script>