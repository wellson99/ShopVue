/* eslint-disable */
import {collection, onSnapshot, getDoc, doc} from "firebase/firestore"
import {db} from "../firebaseConfig"

const collectionReference = collection(db, "Products")

function getProducts(){
  let products = []
  onSnapshot(collectionReference, (snapshot) => {
    snapshot.docs.forEach(doc => {
      products.push({id: doc.id, ...doc.data()})
    });
  })

  return products
}

function getSingleProduct(productID){
  let product = []

  const documentReference = doc(db, "Products", productID)
  onSnapshot(documentReference, (doc) => {
    product.sellerID = doc.data().sID
    product.name = doc.data().prodName
    product.category = doc.data().prodCategory
    product.imgURL = doc.data().prodImgURL
    product.description = doc.data().prodDescription
    product.price = doc.data().prodPrice
    product.quantity = doc.data().prodQuantity
    product.sold = doc.data().prodSold
    product.reviews = doc.data().prodReviews
    product.rating = doc.data().prodRating
  })

  console.log("fb ", product)
  return product
}

export {getProducts, getSingleProduct}