export default {
  namespaced: true,
  state: {
    // cartItem: {},
    cart: []
  },
  mutations: {
    addProductToCart(state, payload){
      state.cart.push(payload.product)
      // localStorage.setItem("uCart", state.cart)
    },
    deleteProductFromCart(state, payload){
      // console.log("stpre ", payload)
      state.cart.splice(payload.index, 1)
      // localStorage.setItem("uCart", state.cart)
    },
    updateCartItemQuantity(state, payload){
      state.cart[payload.index].itemQuantity = payload.updatedQuantity
      // state.cart[payload.index].product.itemQuantity = payload.updatedQuantity
      // localStorage.setItem("uCart", state.cart)
    },
    clearCart(state){
      // let x = []
      state.cart = []
    }
  },
  actions: {
    addProductToCart(state, cartItem){
      state.commit("addProductToCart", cartItem)
    },
    deleteProductFromCart(state, index){
      state.commit("deleteProductFromCart", index)
    },
    updateCartItemQuantity(state, param){
      state.commit("updateCartItemQuantity", param)
    },
    clearCart(state){
      state.commit("clearCart")
    },
  },
  getters: {
    getUserCart: state => state.cart,
    getUserCartLength: state => state.cart.length,
  }
}