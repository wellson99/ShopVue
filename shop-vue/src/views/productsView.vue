<template>
  <v-container>
    <v-row class="mx-2 align-center">
      <v-col >
        <span class="text-h5 font-weight-medium">Products</span>
        <br class="mb-1">
        <span class="text-body-1 grey--text text--darken-2">Find all the products here. </span>
        <span v-show="!pageLoading" class="text-body-1 grey--text text--darken-2">There are a total of {{products.length}} products.</span>
        <v-divider class="mt-3"/>
      </v-col>
    </v-row>

    <template v-if="!pageLoading">
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

            <v-list>
              <v-list-item :disabled="itemsPerPage === 4" @click.prevent="setItemsPerPage(4)">               
                <strong>4</strong> &nbsp;items per page
              </v-list-item>

              <v-list-item :disabled="itemsPerPage === 8" @click.prevent="setItemsPerPage(8)">
                <strong>8</strong> &nbsp;items per page
              </v-list-item>

              <v-list-item :disabled="itemsPerPage === 16" @click.prevent="setItemsPerPage(16)">
                <strong>16</strong> &nbsp;items per page
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

            <v-list>
              <v-list-item :disabled="sortType === 'PriceDesc'" @click.prevent="sortReviews('PriceDesc')">               
                <strong>Price</strong> &nbsp;(Highest to Lowest)
              </v-list-item>

              <v-list-item :disabled="sortType === 'PriceAsc'" @click.prevent="sortReviews('PriceAsc')">
                <strong>Price</strong> &nbsp;(Lowest to Highest)
              </v-list-item>

              <v-list-item :disabled="sortType === 'ReviewDesc'" @click.prevent="sortReviews('ReviewDesc')">
                <strong>Review</strong> &nbsp;(Best to Worst)
              </v-list-item>

              <v-list-item :disabled="sortType === 'ReviewAsc'" @click.prevent="sortReviews('ReviewAsc')">
                <strong>Review</strong> &nbsp;(Worst to Best)
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      
      <v-row class="mx-2 align-center">
        <v-col sm="12" md="6" lg="3" class="" v-for="product in paginatedProductsList" :key="product.id">
          <v-card rounded="lg" color="" elevation="10" width="88%" class="my-2 mx-auto pointer">
            <div @click.prevent="changeRoute('productDetails', product.id)">
              <v-img height="250" class="mx-3 mb-2" :src="product.prodImgURL">
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-divider class="mx-4"/>
              <v-card-title>{{product.prodName}}</v-card-title>
              
              <v-card-text>
                <v-row align="center" class="mx-0">
                  <span class="text-body-1 font-weight-medium">RM {{parseFloat(product.prodPrice).toFixed(2)}}</span>
                </v-row>

                <v-row align="center" class="mx-0 mb-1">
                  <v-rating :value="product.prodRating" color="primary" background-color="primary" dense half-increments readonly size="18" />
                  <span class="grey--text ms-2 mt-1">{{product.prodRating}} ({{product.prodReviews}})</span>
                </v-row>
                
                <div class="my-1 mb-3">
                  <span class="prodCardDesc">{{product.prodDescription}}</span>
                </div>

                <v-divider/>
              </v-card-text>
            </div>
          
            <div class="mx-4 pb-4">
              <v-btn block large color="primary" @click.prevent="addToCart(product)">
                <v-icon class="mr-4">mdi-cart-plus</v-icon>
                <span>Add To Cart</span> 
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mx-2 py-6 align-center justify-center">
        <v-pagination v-model="page" :length="pages" @input="updatePage"/>
      </v-row>

      
      
      <snack-bar :show.sync="showSnackbar" :timeout.sync="snackbarTimeout" :color.sync="snackbarColor" :message.sync="snackbarMessage" />
    </template>

    <loading-dialog v-if="pageLoading" :show.sync="loadingDialog" :message.sync="loadingMessage" />
  </v-container>
</template>

<script>
import {getProducts} from "../../firebase/functions/product"
import snackBar from "../components/snackbar.vue"
import loadingDialog from "../components/loadingDialog.vue"

export default {
  components:{
    snackBar,
    loadingDialog,
  },
  data(){
    return{
      pageLoading: false,
      loadingDialog: true,
      loadingMessage: "Hang on, fetching data ...",

      products: [],
      page: 1,
      itemsPerPage: 8,
      listCount: 0,
      paginatedProductsList: [],
      sortType: null,

      showSnackbar: false,
      snackbarColor: "",
      snackbarMessage: "",
      snackbarTimeout: null,

      pageFirstProduct: 0,
      pageLastProduct: 0,
    }
  },
  created(){

  },
  computed: {
    pages () {
      if(this.itemsPerPage == null || this.listCount == null){
        return 0
      }
      return Math.ceil(this.listCount / this.itemsPerPage)
    }
  },
  async mounted(){
    let self = this
    this.pageLoading = true
    this.products = await getProducts()
    this.initPage(this.products)
    this.updatePage(this.page)
    
    setTimeout(function(){
      self.pageLoading = false
    }, 750)
  },
  methods: {
    changeRoute(route, productID){
      this.$router.push({
        name: route,
        params: {productID: productID}
      })
    },
    addToCart(product){
      this.showSnackbar = true
      this.snackbarTimeout = 1000
      this.snackbarColor = "primary"
      this.snackbarMessage = "Item successfully added into your shopping cart."
      // console.log("tapped ", JSON.stringify(product.id))
      let cartItems = this.$store.getters["uCart/getUserCart"]
      let index = cartItems.findIndex(element => element.productID === product.id)
      if(index !== -1){
        let updatedQuantity = cartItems[index].itemQuantity += 1
        this.$store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: updatedQuantity})
      }else{
        // console.log("else ",this.product.itemQuantity)
        this.$store.dispatch("uCart/addProductToCart", {product: {
          sellerID: product.sID,
          productID: product.id,
          name: product.prodName,
          category: product.prodCategory,
          imgURL: product.prodImgURL,
          price: product.prodPrice,
          itemQuantity: 1
        }})
      }
    },
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
    setItemsPerPage(itemsCount){
      switch(itemsCount){
        case 4:
          this.itemsPerPage = itemsCount
          this.page = 1
          this.initPage(this.products)
          this.updatePage(this.page)
          break
        case 8:
          this.itemsPerPage = itemsCount
          this.page = 1
          this.initPage(this.products)
          this.updatePage(this.page)
          break
        case 16:
          this.itemsPerPage = itemsCount
          this.page = 1
          this.initPage(this.products)
          this.updatePage(this.page)
          break
      }
    },
  }
}
</script>

<style scoped>
.prodCardDesc{
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.pointer{
  cursor: pointer;
}
</style>