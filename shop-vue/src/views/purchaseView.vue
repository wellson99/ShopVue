<template>
  <v-container>
    <page-header :title="headerTitle" :description="headerDesc" /> 
    <purchase-card v-if="!pageLoading" :purchaseProp="purchasedItems" />
    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {onMounted, ref} from '@vue/composition-api'
import store from "@/store/index"
import {getPurchases} from "../../firebase/functions/purchased"
import loadingDialog from "../components/Reuseable/loadingDialog.vue"
import purchaseCard from "../components/Purchase/purchaseCard.vue"
import pageHeader from "../components/Reuseable/pageHeader.vue"

export default {
  components:{
    loadingDialog, purchaseCard, pageHeader
  },
  setup(){
    const headerTitle = ref("Purchases")
    const headerDesc = ref("All of your purchased items will display here here.")
    const pageLoading = ref(true)
    const loadingDialog = ref(true)
    const loadingMessage = ref("Hang on, fetching data ...")
    const purchasedItems = ref([])
    const userState = JSON.parse(store.getters["uState/getUserState"])

    onMounted(async () => {
      purchasedItems.value = await getPurchases(userState.uid)
      purchasedItems.value.sort((a, b) => b.time.toDate() - a.time.toDate())
      setTimeout(() => {
        pageLoading.value = false
        loadingDialog.value = false
      }, 1000)
    })

    return {headerTitle, headerDesc, pageLoading, loadingDialog, loadingMessage, purchasedItems}
  }
  // data(){
  //   return{
  //     headerTitle: "Purchases",
  //     headerDesc: "All of your purchased items will display here here.",
  //     pageLoading: true,
  //     loadingDialog: true,
  //     loadingMessage: "Hang on, fetching data ...",
  //     purchasedItems: [],
  //   }
  // },
  // async mounted() {
  //   const userState = JSON.parse(this.$store.getters["uState/getUserState"])
  //   this.purchasedItems = await getPurchases(userState.uid)
  //   this.purchasedItems.sort((a, b) => b.time.toDate() - a.time.toDate())
  //   setTimeout(() => this.pageLoading = false, 1000)
  // },
}
</script>