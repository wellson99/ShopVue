<template>
  <v-container>
    <page-header :title="headerTitle" :description="headerDesc" />

    <template v-if="!pageLoading">
      <product-info :productInfo="productInfo" :productWishlist="wishlist" :snackBarProp="snackBar" v-on:addToCart="toggleSnackbar($event)"
          v-on:addToWishlists="toggleSnackbar($event)" v-on:removeFromWishlists="toggleSnackbar($event)" />
      <product-review :productReviews="productReviews" />
    </template>

    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
    <snack-bar :show.sync="snackBar.show" :timeout.sync="snackBar.timeout" :color.sync="snackBar.color" :message.sync="snackBar.message" />    
  </v-container>
</template>

<script>
import {getSingleProduct, getWishlists} from "../../firebase/functions/product"
import {getProductReviews} from "../../firebase/functions/review"
import snackBar from "../components/Reuseable/snackbar.vue"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import productReview from "../components/ProductDetails/productReview.vue"
import productInfo from "../components/ProductDetails/productInfo.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    snackBar, loadingDialog, productReview, productInfo, pageHeader
  },
  data(){
    return{
      headerTitle: "Product Details",
      headerDesc: "Displaying all the details for the product.",
      pageLoading: true,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",
      productInfo: [],
      wishlist: [],
      productReviews: [],
      snackBar: {
        show: false,
        color: "",
        message: "",
        timeout: null,
      }
    }
  },
  async mounted(){
    const userState = JSON.parse(this.$store.getters["uState/getUserState"])
    const [prodInfo, prodReview, prodWishlist] = await Promise.all([
      getSingleProduct(this.$route.params.productID),
      getProductReviews(this.$route.params.productID),
      getWishlists(userState.uid, this.$route.params.productID)
    ])

    this.productInfo = prodInfo
    this.productReviews = prodReview
    this.wishlist = prodWishlist
    setTimeout(() => this.pageLoading = false, 1000)
  },
  methods: {
    toggleSnackbar(snackBar){
      this.snackBar = snackBar
    },
  }
}
</script>