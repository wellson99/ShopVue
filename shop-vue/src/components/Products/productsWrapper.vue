<template>
  <div>
    <v-row class="mx-8 align-center">
      <v-col >
        <span class="text-h6 font-weight-medium">
          Displaying product {{pageFirstProduct}} to {{pageLastProduct}}
        </span>
      </v-col>

      <v-col class="float-right text-right">
        <v-menu rounded="lg" offset-y bottom transition="slide-y-transition">
          <template v-slot:activator="{on, attrs}">
            <v-btn large v-bind="attrs" v-on="on" color="primary" class="ml-1">
              <span class="text-capitalize text-body-1"><strong>{{itemsPerPage}}</strong>&nbsp;Items per page</span> 
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list v-for="(item, index) in itemsCount" :key="index">
            <v-list-item :disabled="itemsPerPage === item" @click.prevent="setItemsPerPage(item)">               
              <strong>{{item}}</strong> &nbsp;items per page
            </v-list-item>
          </v-list> 
        </v-menu>

        <v-menu rounded="lg" offset-y bottom transition="slide-y-transition">
          <template v-slot:activator="{on, attrs}">
            <v-btn large v-bind="attrs" v-on="on" color="primary" class="ml-1">
              <span class="text-capitalize text-body-1">Sort</span> 
              <v-icon right>mdi-sort</v-icon>
            </v-btn>
          </template>
          <v-list v-for="(option, index) in sortOptions" :key="index">
            <v-list-item :disabled="sortType === option.type" @click.prevent="sortReviews(option.type)">               
              <strong>{{option.title}}</strong> &nbsp;{{option.description}}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    
    <product-card :products="paginatedProductsList" :snackbarProp="snackBar" v-on:addToCart="toogleSnackbar($event)" />
    <v-row class="mx-2 py-6 align-center justify-center">
      <v-pagination v-model="currentPage" :length="pages" @input="updatePage"/>
    </v-row>

    <snack-bar :show.sync="snackBar.show" :timeout.sync="snackBar.timeout" :color.sync="snackBar.color" :message.sync="snackBar.message" />
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref} from '@vue/composition-api'
import snackBar from "../Reuseable/snackbar.vue"
import productCard from "./productCard.vue"

export default {
  name: "productsWrapper",
  components:{
    snackBar, productCard
  },
  props: {
    productsProp: {type: Array, required: true},
  },
  setup(props){
    const products = ref([])
    const currentPage = ref(1)
    const itemsPerPage = ref(8)
    const listCount = ref(0)
    const paginatedProductsList = ref([])
    const pageFirstProduct = ref(8)
    const pageLastProduct = ref(8)
    const sortType = ref(null)
    const itemsCount = reactive([4, 8, 16])
    const sortOptions = reactive([
      {type: "PriceDesc", title: "Price", description: "(Highest to Lowest)"},
      {type: "PriceAsc", title: "Price", description: "(Lowest to Highest)"},
      {type: "ReviewDesc", title: "Review", description: "(Best to Worst)"},
      {type: "ReviewAsc", title: "Review", description: "(Worst to Best)"}
    ])
    const snackBar = ref({show: false, color: null, message: null, timeout: null})

    const pages = computed(() => {
      if(listCount.value == null)  return 0
      return Math.ceil(listCount.value / itemsPerPage.value)
    })

    const toogleSnackbar = (value) => {
      snackBar.value = value
    }
    const initPage = (list) => {
      listCount.value = list.length
      listCount.value < itemsPerPage.value
        ?paginatedProductsList.value = list
        :paginatedProductsList.value = list.slice(0, itemsPerPage.value)
    }
    const updatePage = (index) => {
      let start = (index - 1) * itemsPerPage.value
      let end = index * itemsPerPage.value
      pageFirstProduct.value = start + 1
      index === (Math.floor(listCount.value / itemsPerPage.value) + 1)
        ?pageLastProduct.value = end - (products.value.length % itemsPerPage.value)
        :pageLastProduct.value = end
      paginatedProductsList.value = products.value.slice(start, end)
      currentPage.value = index
      window.scrollTo(0,0);
    }
    const setItemsPerPage = (itemsCount) => {
      itemsPerPage.value = itemsCount
      currentPage.value = 1
      initPage(products.value)
      updatePage(currentPage.value)
    }
    const sortReviews = (sortBy) => {
      switch(sortBy){
        case "PriceDesc":
          products.value.sort((a, b) => b.prodPrice - a.prodPrice)
          sortType.value = sortBy
          currentPage.value = 1
          initPage(products.value)
          break
        case "PriceAsc":
          products.value.sort((a, b) => a.prodPrice - b.prodPrice)
          sortType.value = sortBy
          currentPage.value = 1
          initPage(products.value)
          break
        case "ReviewDesc":
          products.value.sort((a, b) => b.prodRating - a.prodRating)
          sortType.value = sortBy
          currentPage.value = 1
          initPage(products.value)
          break
        case "ReviewAsc":
          products.value.sort((a, b) => a.prodRating - b.prodRating)
          sortType.value = sortBy
          currentPage.value = 1
          initPage(products.value)
          break
      }
    }

    onMounted(() => {
      products.value = props.productsProp
      initPage(products.value)
      updatePage(currentPage.value)
    })

    return {products, currentPage, itemsPerPage, listCount, paginatedProductsList, pageFirstProduct, pageLastProduct,
      sortType, itemsCount, sortOptions, snackBar, pages, toogleSnackbar, initPage, updatePage, setItemsPerPage, sortReviews
    }
  }
}
</script>