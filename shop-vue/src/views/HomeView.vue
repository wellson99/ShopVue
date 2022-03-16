<template>
  <hello-world />
</template>

<script>
  /* eslint-disable */ 
  import HelloWorld from '../components/HelloWorld'
  import {userState} from "../../firebase/firebaseConfig"

  export default {
    name: 'Home',
    data(){
      return{
        isAuth: null
      }
    },

    components: {
      HelloWorld,
    },
    mounted(){
      // console.log("store ",this.$store.getters.getUserState)
    },
    methods: {
      
    }
  }
</script>
