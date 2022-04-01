<template>
  <v-container>
    <page-header :title="headerTitle" :description="headerDesc" />

    <template v-if="!pageLoading">
      <v-row class="mx-2 align-center-top">
        <cart-items />
        <cart-summary />
      </v-row>
    </template>
    
    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {onMounted, ref} from '@vue/composition-api'
import cartSummary from '@/components/Cart/cartSummary.vue'
import cartItems from "../components/Cart/cartItems.vue"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    cartItems, cartSummary, loadingDialog, pageHeader
  },
  setup(){
    const headerTitle = ref("Carts")
    const headerDesc = ref("All of your shopping items will display here here.")
    const pageLoading = ref(true)
    const loadingDialog = ref(true)
    const loadingMessage = ref("Hang on, fetching data ...")

    onMounted(() => {
      setTimeout(() => {
        pageLoading.value = false
        loadingDialog.value = false
      }, 500)
    })

    return {headerTitle, headerDesc, pageLoading, loadingDialog, loadingMessage}
  }
}
</script>