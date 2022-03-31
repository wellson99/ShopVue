<template>
  <v-container>
    <page-header :title="headerTitle" :description="headerDesc" /> 
    <purchase-card v-if="!pageLoading" :purchaseProp="purchasedItems" />
    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {getPurchases} from "../../firebase/functions/purchased"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import purchaseCard from "../components/Purchase/purchaseCard.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    loadingDialog, purchaseCard, pageHeader
  },
  data(){
    return{
      headerTitle: "Purchases",
      headerDesc: "All of your purchased items will display here here.",
      pageLoading: true,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",
      purchasedItems: [],
    }
  },
  async mounted() {
    const userState = JSON.parse(this.$store.getters["uState/getUserState"])
    this.purchasedItems = await getPurchases(userState.uid)
    this.purchasedItems.sort((a, b) => b.time.toDate() - a.time.toDate())
    setTimeout(() => this.pageLoading = false, 1000)
  },
}
</script>