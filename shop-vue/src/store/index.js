import Vue from 'vue'
import Vuex from 'vuex'
// import {userState} from "../../firebase/firebaseConfig"

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    userState : null
  },
  getters: {
    getUserState: state => state.userState
  },
  mutations: {
    mutateUserState(state, payload){
      state.userState = payload
    }
  },
  actions: {
    setUserState(state){
      const uState = localStorage.getItem('uState')
      state.commit("mutateUserState", uState)
    },
    clearUserState(state){
      localStorage.removeItem("uState")
      state.commit("mutateUserState", null)
    }
  },
  modules: {
  }
})
