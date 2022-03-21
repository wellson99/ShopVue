export default {
  namespaced: true,
  state: {
    // cartItem: {},
    cart: []
  },
  mutations: {
    addProductToCart(state, payload){
      state.cart.push(payload)
    },
    deleteProductFromCart(state, payload){
      state.cart.splice(payload, 1)
    },
    updateCartItemQuantity(state, payload){
      state.cart[payload.index].product.itemQuantity = payload.updatedQuantity
    },
    duplicateCartItem(state, payload){
      state.cart[payload.index].product.itemQuantity = payload.quantity
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
    duplicateCartItem(state, param){
      state.commit("duplicateCartItem", param)
    },
  },
  getters: {
    getUserCart: state => state.cart,
    getUserCartLength: state => state.cart.length,
  }
}