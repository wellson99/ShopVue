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
      <v-pagination v-model="page" :length="pages" @input="updatePage"/>
    </v-row>

    <snack-bar :show.sync="snackBar.show" :timeout.sync="snackBar.timeout" :color.sync="snackBar.color" :message.sync="snackBar.message" />
  </div>
</template>

<script>
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
  data(){
    return{
      products: [],
      page: 1,
      itemsPerPage: 8,
      listCount: 0,
      paginatedProductsList: [],
      pageFirstProduct: 0,
      pageLastProduct: 0,
      sortType: null,
      itemsCount: [4, 8 ,16],
      sortOptions: [
        {type: "PriceDesc", title: "Price", description: "(Highest to Lowest)"},
        {type: "PriceAsc", title: "Price", description: "(Lowest to Highest)"},
        {type: "ReviewDesc", title: "Review", description: "(Best to Worst)"},
        {type: "ReviewAsc", title: "Review", description: "(Worst to Best)"}
      ],
      snackBar: {
        show: false,
        color: "",
        message: "",
        timeout: null,
      },
    }
  },
  mounted(){
    this.products = this.productsProp
    this.initPage(this.products)
    this.updatePage(this.page)
  },
  computed: {
    pages(){
      if(this.listCount == null)  return 0
      return Math.ceil(this.listCount / this.itemsPerPage)
    }
  },
  methods:{
    initPage(list){
      this.listCount = list.length
      if(this.listCount < this.itemsPerPage){
        this.paginatedProductsList = list
      }else{
        this.paginatedProductsList = list.slice(0, this.itemsPerPage)
      }
    },
    updatePage(index){
      let start = (index - 1) * this.itemsPerPage
      let end = index * this.itemsPerPage
      this.pageFirstProduct = start + 1
      index === (Math.floor(this.listCount/this.itemsPerPage) + 1)
        ?this.pageLastProduct = end - (this.products.length % this.itemsPerPage)
        :this.pageLastProduct = end
      this.paginatedProductsList = this.products.slice(start, end)
      this.page = index
      window.scrollTo(0,0);
    },
    setItemsPerPage(itemsCount){
      this.itemsPerPage = itemsCount
      this.page = 1
      this.initPage(this.products)
      this.updatePage(this.page)
    },
    sortReviews(sortBy){
      switch(sortBy){
        case "PriceDesc":
          this.products.sort((a, b) => b.prodPrice - a.prodPrice)
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.products)
          break
        case "PriceAsc":
          this.products.sort((a, b) => a.prodPrice - b.prodPrice)
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.products)
          break
        case "ReviewDesc":
          this.products.sort((a, b) => b.prodRating - a.prodRating)
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.products)
          break
        case "ReviewAsc":
          this.products.sort((a, b) => a.prodRating - b.prodRating)
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.products)
          break
      }
    },
    toogleSnackbar(snackBar){
      this.snackBar = snackBar
    },
  }
}
</script>