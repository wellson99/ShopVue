<template>
  <v-container>
    <v-row class="mx-2 align-center">
      <v-col >
        <span class="text-h5 font-weight-medium">Products</span>
        <br class="mb-1">
        <span class="text-body-1 grey--text text--darken-2">Find all the products here.</span>
        <v-divider class="mt-3"/>
      </v-col>
    </v-row>

    <v-row class="mx-8 align-center">
      <v-col >
        <span class="text-h6 font-weight-medium">Displaying 23 of {{products.length}} products</span>
      </v-col>

      

      <v-col class="float-right text-right">
        <v-btn large color="primary" class="mx-2" @click.prevent="">
          <span class="text-capitalize text-body-1">20 Items per page</span> 
          <v-icon large right>mdi-menu-down</v-icon>
        </v-btn>

        <v-btn large color="primary" class="ml-1" @click.prevent="">
          <span class="text-capitalize text-body-1">Sort</span> 
          <v-icon right>mdi-sort</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    
    <v-row class="mx-2 align-center">
      <v-col sm="12" md="6" lg="3" class="" v-for="product in products" :key="product.id">
        <v-card rounded="lg" color="" elevation="10" width="88%" class="my-2 mx-auto" @click.prevent="changeRoute('productDetails', product)">
        <!-- <v-card rounded="lg" color="" elevation="10" width="88%" class="my-2 mx-auto" @click.prevent="testID(product.id)"> -->
          <v-img height="250" :src="product.prodImgURL"/>
          <v-divider class="mx-4"/>
          <v-card-title>{{product.prodName}}</v-card-title>
          
          <v-card-text>
            <v-row align="center" class="mx-0">
              <span class="text-body-1 font-weight-medium">RM {{product.prodPrice}}</span>
            </v-row>

            <v-row align="center" class="mx-0 mb-1">
              <v-rating :value="product.prodRating" color="amber" dense half-increments readonly size="18" />
              <span class="grey--text ms-2 mt-1">{{product.prodRating}} ({{product.prodReviews}})</span>
            </v-row>
            
            <div class="my-1 mb-3">
              <span>{{product.prodDescription}}</span>
            </div>

            <v-divider/>
            <div class="mx-0 my-1 mt-5">
              <v-btn block large color="primary" @click.prevent="">
                <v-icon class="mr-4">mdi-cart-plus</v-icon>
                <span>Add To Cart</span> 
              </v-btn>
            </div>
            
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
import {getProducts} from "../../firebase/functions/product"

export default {
  data(){
    return{
      products: [],
    }
  },
  created(){

  },
  computed: {
    pages () {
      if(this.pageSize == null || this.products.length == null){
        return 0
      }
      return Math.ceil(this.products.length / this.pageSize)
    }
  },
  async mounted(){
    this.products = getProducts()
    // console.log("hello", this.products)

  },
  methods: {
    changeRoute(route, product){
      this.$router.push({
        name: route,
        params: {productData: product}
      })
    },
    
  }
}
</script>

<style scoped>
.prodCardDesc{
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}
</style>