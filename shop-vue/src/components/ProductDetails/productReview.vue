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
                v-model="currentPage" :length="pages" @input="updatePage"
              ></v-pagination>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {computed, onMounted, ref} from '@vue/composition-api'

export default {
  name: "productReview",
  props:{
    productReviews: {type: Array, required: true}
  },
  setup(props){
    const currentPage = ref(1) 
    const itemsPerPage = ref(4) 
    const listCount = ref(0) 
    const paginatedReviewsList = ref([]) 
    const reviews = ref([]) 
    const sortType = ref("DateDesc") 

    const pages = computed(() => {
      if(listCount.value === null) return 0
      return Math.ceil(listCount.value / itemsPerPage.value)
    })

    const initPage = (list) => {
      listCount.value = list.length
      listCount.value < itemsPerPage.value
        ?paginatedReviewsList.value = list
        :paginatedReviewsList.value = list.slice(0, itemsPerPage.value)
    }
    const updatePage = (index) => {
      let start = (index - 1) * itemsPerPage.value
      let end = index * itemsPerPage.value
      paginatedReviewsList.value = reviews.value.slice(start, end)
      currentPage.value = index
    }
    const reviewDateTime = (timestampObj) => {
      let dateObj = new Date(timestampObj.seconds * 1000) 
      var date = dateObj.toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})
      var time = dateObj.toLocaleString(undefined, {hour12:false, hour:"numeric", minute:"numeric"})
      return `${date} at ${time}`
    }
    const sortReviews = (sortBy) => {
      switch(sortBy){
        case "DateDesc":
          reviews.value.sort((a, b) => b.date.toDate() - a.date.toDate())
          sortType.value = sortBy
          currentPage.value = 1
          initPage(reviews.value)
          break
        case "DateAsc":
          reviews.value.sort((a, b) => a.date.toDate() - b.date.toDate())
          sortType.value = sortBy
          currentPage.value = 1
          initPage(reviews.value)
          break
        case "ReviewDesc":
          reviews.value.sort((a, b) => b.rating - a.rating)
          sortType.value = sortBy
          currentPage.value = 1
          initPage(reviews.value)
          break
        case "ReviewAsc":
          reviews.value.sort((a, b) => a.rating - b.rating)
          sortType.value = sortBy
          currentPage.value = 1
          initPage(reviews.value)
          break
      }
    }

    onMounted(() => {
      reviews.value = props.productReviews
      reviews.value.sort((a, b) => b.date - a.date)
      initPage(reviews.value)
      updatePage(currentPage.value)
    })

    return {currentPage, paginatedReviewsList, sortType, pages, reviewDateTime, updatePage, sortReviews}
  }
}
</script>