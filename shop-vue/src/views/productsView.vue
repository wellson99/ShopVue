<template>
  <v-container>
    <page-header :title="headerTitle" :description="headerDesc" />

    <template v-if="!pageLoading">
      <products-wrapper :productsProp="products" />
    </template>

    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {onMounted, ref} from '@vue/composition-api'
import {getProducts} from "../../firebase/functions/product"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import productsWrapper from "../components/Products/productsWrapper.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    loadingDialog, productsWrapper, pageHeader
  },
  setup(){
    const headerTitle = ref("Products")
    const headerDesc = ref("Find all the products here.")
    const pageLoading = ref(true)
    const loadingDialog = ref(true)
    const loadingMessage = ref("Hang on, fetching data ...")
    const products = ref([])

    onMounted(async () => {
      products.value = await getProducts()
      headerDesc.value = `Find all the products here. There are a total of ${products.value.length} products.`
      setTimeout(() => {
        pageLoading.value = false
        loadingDialog.value = false
      }, 750)
    })

    return {headerTitle, headerDesc, pageLoading, loadingDialog, loadingMessage, products}
  }
}
</script>