/* eslint-disable */
import { async } from "@firebase/util"
import {collection, getDocs, getDoc, doc, addDoc, query, where, deleteDoc, Timestamp} from "firebase/firestore"
import {db} from "../firebaseConfig"

async function getProducts(){
  const collectionReference = collection(db, "Products")
  let products = []
  await getDocs(collectionReference).then(snapshot => {
    snapshot.docs.forEach(doc => {
      products.push({id: doc.id, ...doc.data()})
    })
  })

  return products
}

async function getSingleProduct(productID){
  const documentReference = doc(db, "Products", productID)
  let product = []
  await getDoc(documentReference).then((doc) => {
    product.push({id: doc.id, ...doc.data()})
  })

  return product
}

async function getWishlists(userID, productID){
  const collectionReference = collection(db, "Users", userID, "Wishlists")
  const queryReference = query(collectionReference, where("productID", "==", productID))
  let wishlists = []
  await getDocs(queryReference).then(snapshot => {
    snapshot.docs.forEach(doc => {
      wishlists.push({id: doc.id, ...doc.data()})
    })
  })

  return wishlists
}

async function wishlistProduct(productID, userID){
  const collectionReference = collection(db, "Users", userID, "Wishlists")
  var result
  await addDoc(collectionReference, {
    productID: productID
  })
  .then((doc) => result = {success: true, id: doc.id})
  .catch((error) => result = {success: false, message: error.message})

  return result 
}

async function removeWishlist(wishlistID, userID){
  const documentReference = doc(db, "Users", userID, "Wishlists", wishlistID)
  var result
  await deleteDoc(documentReference).then(() => {
    result = {success: true}
  }).catch((error) => result = {success: false, message: error.message})

  return result 
}

async function populateProductsTable(product){
  const collectionReference = collection(db, "Products")
  await addDoc(collectionReference, {
    createdAt: Timestamp.now(),
    prodCategory: product.prodCategory,
    prodDescription: product.prodDescription,
    prodImgURL: product.prodImgURL,
    prodName: product.prodName,
    prodPrice: product.prodPrice,
    prodQuantity: product.prodQuantity,
    prodRating: product.prodRating,
    prodReview: product.prodReview,
    prodSold: product.prodSold,
    sID: product.sID
  })
}

export {getProducts, getSingleProduct, wishlistProduct, getWishlists, removeWishlist, populateProductsTable}