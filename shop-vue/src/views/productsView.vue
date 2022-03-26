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
        <v-card rounded="lg" color="" elevation="10" width="88%" class="my-2 mx-auto pointer">
        <!-- <v-card rounded="lg" color="" elevation="10" width="88%" class="my-2 mx-auto" @click.prevent="changeRoute('productDetails', product)"> -->
          <div @click.prevent="changeRoute('productDetails', product)">
            <v-img height="250" :src="product.prodImgURL"/>
            <v-divider class="mx-4"/>
            <v-card-title>{{product.prodName}}</v-card-title>
            
            <v-card-text>
              <v-row align="center" class="mx-0">
                <span class="text-body-1 font-weight-medium">RM {{product.prodPrice}}</span>
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

      <v-snackbar v-model="showSnackbar" :timeout="1000" elevation="24" multi-line bottom text color="primary">
        Item successfully added into your shopping cart
        <template v-slot:action="{ attrs }">
          <v-btn icon color="primary" v-bind="attrs" @click="showSnackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
    
  </v-container>
</template>

<script>
import {getProducts} from "../../firebase/functions/product"

export default {
  data(){
    return{
      products: [],
      showSnackbar: false
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
  mounted(){
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
    // eslint-disable-next-line
    // addToCart(product){
    //   this.showSnackbar = true
    //   // console.log("tapped ", JSON.stringify(product.id))
    //   let cartItems = this.$store.getters["uCart/getUserCart"]
    //   let index = cartItems.findIndex(element => element.product.productID === product.id)
    //   if(index !== -1){
    //     let updatedQuantity = cartItems[index].product.itemQuantity += 1
    //     this.$store.dispatch("uCart/updateCartItemQuantity", {index: index, updatedQuantity: updatedQuantity})
    //   }else{
    //     // console.log("else ",this.product.itemQuantity)
    //     this.$store.dispatch("uCart/addProductToCart", {product: {
    //       sellerID: product.sID,
    //       productID: product.id,
    //       name: product.prodName,
    //       category: product.prodCategory,
    //       imgURL: product.prodImgURL,
    //       price: product.prodPrice,
    //       itemQuantity: 1
    //     }})
    //   }

      addToCart(product){
      this.showSnackbar = true
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


    }
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