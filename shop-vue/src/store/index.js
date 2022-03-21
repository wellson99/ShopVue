import Vue from 'vue'
import Vuex from 'vuex'
import uStateModule from "./modules/uStateStore"
import uCartModule from "./modules/uCartStore"
// import {userState} from "../../firebase/firebaseConfig"

Vue.use(Vuex)



export default new Vuex.Store({
  modules: {
    uState: uStateModule,
    uCart: uCartModule
  }
})
