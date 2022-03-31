<template>
  <v-container>
    <!-- <v-row class="mx-2 align-center">
      <v-col >
        <span class="text-h5 font-weight-medium">Products</span>
        <br class="mb-1">
        <span class="text-body-1 grey--text text--darken-2">Find all the products here. </span>
        <span v-show="!pageLoading" class="text-body-1 grey--text text--darken-2">There are a total of {{products.length}} products.</span>
        <v-divider class="mt-3"/>
      </v-col>
    </v-row> -->
    <page-header :title="headerTitle" :description="headerDesc" />

    <template v-if="!pageLoading">
      <products-wrapper :productsProp="products" />
    </template>

    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {getProducts} from "../../firebase/functions/product"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import productsWrapper from "../components/Products/productsWrapper.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    loadingDialog, productsWrapper, pageHeader
  },
  data(){
    return{
      headerTitle: "Products",
      headerDesc: "Find all the products here. ",
      pageLoading: true,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",
      products: [],
    }
  },
  async mounted(){
    this.products = await getProducts()
    setTimeout(() => {
      this.pageLoading = false
      this.loadingDialog = false
    }, 750)
  },
}
</script>