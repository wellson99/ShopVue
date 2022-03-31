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
import cartSummary from '@/components/Cart/cartSummary.vue'
import cartItems from "../components/Cart/cartItems.vue"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    cartItems, cartSummary, loadingDialog, pageHeader
  },
  data(){
    return{
      headerTitle: "Carts",
      headerDesc: "All of your shopping items will display here here.",
      pageLoading: true,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",
    }
  },
  mounted() {
    setTimeout(() => {
      this.pageLoading = false
      this.loadingDialog = false
    }, 500)
  },
}
</script>