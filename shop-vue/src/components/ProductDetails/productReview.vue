<template>
  <div>
    <v-row class="mx-2 align-center-top">
      <v-col sm="12" md="7">
        <v-card rounded="lg" color="" elevation="10"  class="my-0 mx-5">
          <v-card-title class="text-h5 font-weight-medium">Reviews</v-card-title>

          <v-card-text>
            <v-row align="center" class="mx-0 d-flex justify-space-between">
              <span class="text-body-1 grey--text text--darken-2">This section display all the users' reiviews.</span>
              <v-menu rounded="lg" offset-y bottom transition="slide-y-transition">
                <template v-slot:activator="{on, attrs}">
                  <v-btn v-bind="attrs" v-on="on" color="primary" class="ml-1">
                    <span class="text-capitalize text-body-1">Sort By</span> 
                    <v-icon right>mdi-sort</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item :disabled="sortType === 'DateDesc'" @click.prevent="sortReviews('DateDesc')">               
                    <strong>Date</strong> &nbsp;(Latest to Oldest)
                  </v-list-item>

                  <v-list-item :disabled="sortType === 'DateAsc'" @click.prevent="sortReviews('DateAsc')">
                    <strong>Date</strong> &nbsp;(Oldest to Latest)
                  </v-list-item>

                  <v-list-item :disabled="sortType === 'ReviewDesc'" @click.prevent="sortReviews('ReviewDesc')">
                    <strong>Review</strong> &nbsp;(Best to Worst)
                  </v-list-item>

                  <v-list-item :disabled="sortType === 'ReviewAsc'" @click.prevent="sortReviews('ReviewAsc')">
                    <strong>Review</strong> &nbsp;(Worst to Best)
                  </v-list-item>
                </v-list>
              </v-menu>
              
            </v-row>
            <v-divider class="my-5" />

            <div>
              <div v-for="review in paginatedReviewsList" :key="review.id">
                <v-row align="center" class="mx-0 mt-2 d-flex justify-space-between">
                  <span class="text-body-1 font-weight-medium black--text">{{review.userName}}</span>
                  <span class="text-body-2 grey--text text--darken-2 mr-3">
                    {{reviewDateTime(review.date)}}
                  </span>
                </v-row>

                <v-row align="center" class="mx-0">
                  <v-rating :value="review.rating" color="primary" background-color="primary" dense half-increments readonly size="18" />
                  <span class="ms-2 mt-1">{{review.rating}}</span>
                </v-row>

                <v-row align="center" class="mx-0 mt-3">
                  <span class="text-body-1 grey--text text--darken-2">
                    {{review.review}}
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
  </div>
</template>

<script>
export default {
  name: "productReview",
  props:{
    productReviews: {type: Array, required: true}
  },
  data(){
    return{
      page: 1,
      pageSize: 4,
      listCount: 0,
      paginatedReviewsList: [],
      reviews: [],
      sortType: "DateDesc",
    }
  },
  mounted(){
    this.reviews = this.productReviews
    this.reviews.sort((a, b) => b.date - a.date)
    this.initPage(this.reviews)
    this.updatePage(this.page)
  },
  computed:{
    pages(){
      if(this.listCount === null) return 0
      return Math.ceil(this.listCount / this.pageSize)
    }
  },
  methods:{
    initPage(list){
      this.listCount = list.length
      if(this.listCount < this.pageSize){
        this.paginatedReviewsList = list
      }else{
        this.paginatedReviewsList = list.slice(0, this.pageSize)
      }
    },
    updatePage(index){
      let start = (index - 1) * this.pageSize
      let end = index * this.pageSize
      this.paginatedReviewsList = this.reviews.slice(start, end)
      this.page = index
    },
    reviewDateTime(timestampObj){  
      let dateObj = new Date(timestampObj.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:false, hour:"numeric", minute:"numeric"})
      return `${date} at ${time}`
    },
    sortReviews(sortBy){
      switch(sortBy){
        case "DateDesc":
          this.reviews.sort((a, b) => b.date.toDate() - a.date.toDate())
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.reviews)
          break
        case "DateAsc":
          this.reviews.sort((a, b) => a.date.toDate() - b.date.toDate())
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.reviews)
          break
        case "ReviewDesc":
          this.reviews.sort((a, b) => b.rating - a.rating)
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.reviews)
          break
        case "ReviewAsc":
          this.reviews.sort((a, b) => a.rating - b.rating)
          this.sortType = sortBy
          this.page = 1
          this.initPage(this.reviews)
          break
      }
    },
  }
}
</script>