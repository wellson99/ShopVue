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
import store from "@/store/index"
import router from "@/router/index"
import {onMounted, ref} from '@vue/composition-api'
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
  setup(){
    const headerTitle = ref("Product Details")
    const headerDesc = ref("Displaying all the details for the product.")
    const pageLoading = ref(true)
    const loadingDialog = ref(true)
    const loadingMessage = ref("Hang on, fetching data ...")
    const productInfo = ref([])
    const wishlist = ref([])
    const productReviews = ref([])
    const snackBar = ref({show: false, color: null, message: null, timeout: null})

    const toggleSnackbar = (eventVal) => {
      snackBar.value = eventVal
    }

    onMounted(async () => {
      const route = router.app.$route.params
      const userState = JSON.parse(store.getters["uState/getUserState"])
      const [prodInfo, prodReview, prodWishlist] = await Promise.all([
        getSingleProduct(route.productID),
        getProductReviews(route.productID),
        getWishlists(userState.uid, route.productID)
      ])

      productInfo.value = prodInfo
      productReviews.value = prodReview
      wishlist.value = prodWishlist
      setTimeout(() => {
        pageLoading.value = false
        loadingDialog.value = false
      }, 1000)
    })

    return {headerTitle, headerDesc, pageLoading, loadingDialog, loadingMessage, productInfo, wishlist, productReviews, snackBar, toggleSnackbar}
  }
}
</script>