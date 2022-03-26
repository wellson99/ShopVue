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

async function getSingleProduct(productID){
  const documentReference = doc(db, "Products", productID)
  let product = []
  await getDoc(documentReference).then((doc) => {
    product.push({id: doc.id, ...doc.data()})
  })

  return product
}

export {getProducts, getSingleProduct}