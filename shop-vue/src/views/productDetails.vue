<template>
  <v-container>
    <v-row class="mx-2 align-center">
      <v-col >
        <span class="text-h5 font-weight-medium">Product Details</span>
        <br class="mb-1">
        <span class="text-body-1 grey--text text--darken-2">Find all the products here.</span>
        <v-divider class="mt-3"/>
      </v-col>
    </v-row>

    <v-row class="mx-2 align-center-top">
      <v-col sm="12" md="7">
        <v-card rounded="lg" color="" elevation="1"  class="my-2 mx-5">
          <v-img contain height="600" :src="product.imgURL"/>
        </v-card>
      </v-col>

      <v-col sm="12" md="5">
        <v-card rounded="lg" color="" elevation="10" class="my-2 mx-5">
          <!-- <v-card-title class="text-h4 font-weight-medium">{{productData.prodName}}</v-card-title> -->
          <v-card-title class="text-h4 font-weight-medium">{{product.name}}</v-card-title>

          <v-card-text>
            <v-row align="center" class="mx-0 mb-1">
              <!-- <span class="text-h5 font-weight-medium">RM {{productData.prodPrice}}</span> -->
              <span class="text-h5 font-weight-medium">RM {{product.price}}</span>
            </v-row>

            <v-row align="center" class="mx-0  mb-1">
              <!-- <span class="text-subtitle-1 font-weight-regular">{{productData.prodDescription}}</span> -->
              <span class="text-subtitle-1 font-weight-regular">{{product.description}}</span>
            </v-row>
            
            <v-divider class="my-4"/>

            <v-row align="center" class="mx-0">
              <v-col class="text-center">
                <v-rating :value="product.rating" color="primary" background-color="primary" dense half-increments readonly size="24" />
                <p class="text-h6 font-weight-regular primary--text">Ratings</p>
              </v-col>

              <v-col class="text-center">
                <span class="text-h6 font-weight-bold primary--text">{{product.reviews}}</span>
                <p class="text-h6 font-weight-regular primary--text">Reviews</p>
              </v-col>

              <v-col class="text-center">
                <span class="text-h6 font-weight-bold primary--text">{{product.sold}}+</span>
                <p class="text-h6 font-weight-regular primary--text">Sold</p>
              </v-col>
            </v-row>

            <v-divider/>
            <v-row align="center" class="mx-0 my-3">
              <v-col class="mx-0">
                <span class="text-h5 font-weight-medium">{{product.quantity}} </span>
                <span class="text-h6 font-weight-regular">&nbsp;Pieces available</span>
              </v-col>
              
              <v-col class="d-flex justify-center">
                <v-btn fab small :disabled="this.product.itemQuantity <= 1" color="primary mx-2" @click.prevent="itemCountDecrement"> 
                  <v-icon dark>mdi-minus</v-icon>
                </v-btn>

                <span class="mx-10 text-h4 font-weight-medium primary--text">{{this.product.itemQuantity}}</span>

                <v-btn fab small :disabled="this.product.itemQuantity === 10" color="primary mx-2" @click.prevent="itemCountIncrement"> 
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row align="center" justify="center" class="mx-0 my-5">
              <!-- <v-btn x-large color="primary" width="65%" @click.prevent="wishlistProduct()"> -->
              <v-btn x-large color="primary" width="65%" @click.prevent="display()">
                <v-icon v-show="!addToWishlist" class="mr-4">mdi-cards-heart-outline</v-icon>
                <span v-show="!addToWishlist">Add to Wishlist</span> 
                <v-icon v-show="addToWishlist" class="mr-4">mdi-cards-heart</v-icon>
                <span v-show="addToWishlist">In your Wishlist</span> 
              </v-btn>
            </v-row>

            <v-row align="center" justify="center" class="mx-0 mb-2">
              <v-btn x-large color="primary" width="65%" @click.prevent="addToCart()">
                <v-icon class="mr-4">mdi-cart-plus</v-icon>
                <span>Add To Cart</span> 
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mx-2 align-center-top">
      <v-col sm="12" md="7">
        <v-card rounded="lg" color="" elevation="10"  class="my-0 mx-5">
          <v-card-title class="text-h5 font-weight-medium">Reviews</v-card-title>

          <v-card-text>
            <v-row align="center" class="mx-0 d-flex justify-space-between">
              <span class="text-body-1 grey--text text--darken-2">This section display all the users' reiviews.</span>
              <v-btn color="primary" class="ml-1" @click.prevent="">
                <span class="text-capitalize text-body-1">Sort By</span> 
                <v-icon right>mdi-sort</v-icon>
              </v-btn>
            </v-row>
            <v-divider class="my-5" />

            <div>
              <div v-for="(item, index) in historyList" :key="index">
                <v-row align="center" class="mx-0 mt-2 d-flex justify-space-between">
                  <span class="text-body-1 font-weight-medium black--text">Username</span>
                  <!-- <span class="text-body-2 grey--text text--darken-2">18 March 2022</span> -->
                  <span class="text-body-2 grey--text text--darken-2">{{item.i}}</span>
                </v-row>

                <v-row align="center" class="mx-0">
                  <v-rating :value="3.5" color="primary" background-color="primary" dense half-increments readonly size="18" />
                  <span class="ms-2 mt-1">4.5</span>
                </v-row>

                <v-row align="center" class="mx-0 mt-3">
                  <span class="text-body-1 grey--text text--darken-2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo maiores minus est, inventore consequuntur laboriosam voluptate at nesciunt recusandae enim quae expedita beatae repudiandae? Eum vitae nisi consequuntur nemo quaerat!
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                  </span>
                </v-row>
                <v-divider class="my-5" />
              </div>
              <v-pagination
                v-model="page" :length="pages" @input="updatePage"
              ></v-pagination>
            </div>

            

            
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {onSnapshot, doc} from "firebase/firestore"
import {db} from "../../firebase/firebaseConfig"

export default {
  data(){
    return{
      items:[
        {i: "a"}, {i: "b"}, {i: "c"}, {i: "d"},{i: "e"},{i: "f"},{i: "g"},{i: "h"},{i: "i"},{i: "j"},{i: "k"},{i: "l"},{i: "m"},{i: "n"},{i: "o"},
      ],
      // itemQuantity: 1,
      addToWishlist: false,
      cartItems: [],
      
      page: 1,
      pageSize: 2,
      listCount: 0,
      historyList: [],

      test: [],

      product: {
        sellerID: "",
        productID: "",
        name: "",
        category: "",
        description: "",
        imgURL: "",
        price: 0,
        quantity: 0,
        sold: 0,
        reviews: 0,
        rating: 0,
        itemQuantity: 1,
      }
    }
  },
  props:[
    'productData',
  ],
  computed: {
    pages () {
      if(this.pageSize == null || this.listCount == null){
        return 0
      }
      return Math.ceil(this.listCount / this.pageSize)
    }
  },
  created(){
    this.initPage()
    this.updatePage(this.page)
  },
  mounted(){
    const documentReference = doc(db, "Products", this.productData.id)
    onSnapshot(documentReference, (doc) => {
      this.product.sellerID = doc.data().sID
      this.product.productID = doc.id
      this.product.name = doc.data().prodName
      this.product.category = doc.data().prodCategory
      this.product.imgURL = doc.data().prodImgURL
      this.product.description = doc.data().prodDescription
      this.product.price = doc.data().prodPrice
      this.product.quantity = doc.data().prodQuantity
      this.product.sold = doc.data().prodSold
      this.product.reviews = doc.data().prodReviews
      this.product.rating = doc.data().prodRating
    })


  },
  methods: {
    itemCountIncrement(){
      this.product.itemQuantity++
    },
    itemCountDecrement(){
      this.product.itemQuantity--
    },
    wishlistProduct(){
      this.addToWishlist = !this.addToWishlist
    },
     addToCart(){
      let newnum = this.product.itemQuantity
      this.cartItems = this.$store.getters["uCart/getUserCart"]
      let index = this.cartItems.findIndex( el => el.product.productID === this.product.productID )
      if(index !== -1){
        let updatedQuantity = this.cartItems[index].product.itemQuantity += newnum
        this.$store.dispatch("uCart/duplicateCartItem", {index: index, quantity: updatedQuantity})
      }else{
        console.log("else ",this.product.itemQuantity)
        this.$store.dispatch("uCart/addProductToCart", {product: {
          sellerID: this.product.sellerID,
          productID: this.product.productID,
          name: this.product.name,
          category: this.product.category,
          imgURL: this.product.imgURL,
          price: this.product.price,
          itemQuantity: newnum
        }})
      }
      this.product.itemQuantity = 1
    },

    display(){
      console.log("display", JSON.stringify(this.$store.getters["uCart/getUserCart"]))
    },

    initPage(){
      this.listCount = this.items.length
      if(this.listCount < this.pageSize){
        this.historyList = this.items
      }else{
        this.historyList = this.items.slice(0, this.pageSize)
      }
    },

    updatePage(index){
      let start = (index - 1) * this.pageSize
      let end = index * this.pageSize
      this.historyList = this.items.slice(start, end)
      this.page = index
    },

    reset(){
      this.product.itemQuantity = 1
    }
    
  }
}
</script>