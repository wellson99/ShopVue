import {collection, getDocs, getDoc, doc, addDoc, Timestamp, updateDoc, increment} from "firebase/firestore"
import {db} from "../firebaseConfig"

async function getPurchases(userID){
  const collectionReference = collection(db, "Users", userID, "Purchase")
  let purchasedItems = []
  await getDocs(collectionReference).then(snapshot => {
    snapshot.docs.forEach(doc => {
      purchasedItems.push({id: doc.id, ...doc.data()})
    })
  })

  return purchasedItems
}

async function getSinglePurchase(userID, purchaseID){
  const documentReference = doc(db, "Users", userID, "Purchase", purchaseID)
  let purchasedItem = []
  await getDoc(documentReference).then((doc) => {
    purchasedItem.push({id: doc.id, ...doc.data()})
  });

  return purchasedItem
}

async function purchase(purchaseInfo, userID){
  const collectionReference = collection(db, "Users", userID, "Purchase")
  var result
  await addDoc(collectionReference, {
    items: purchaseInfo.cartItems,
    total: purchaseInfo.grandTotal,
    delivery: purchaseInfo.deliveryType,
    time: Timestamp.now()
  }).then(() => {
    purchaseInfo.cartItems.forEach(async (item) => {
      const docRef = doc(db, "Products", item.productID)
      await updateDoc(docRef, {
        prodQuantity: increment(-item.itemQuantity),
        prodSold: increment(item.itemQuantity)
      })
      .catch((error) => result = {success: false, message: error.message})
    })
    result = {success: true}
  }).catch((error) => result = {success: false, message: error.message})

  return result 
}

export {
  getPurchases, getSinglePurchase, purchase
}