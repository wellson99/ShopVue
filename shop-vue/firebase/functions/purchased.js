import {collection, getDocs, getDoc, doc} from "firebase/firestore"
import {db} from "../firebaseConfig"

async function getPurchases(userID){
  const collectionReference = collection(db, "Users", userID, "Purchase")
  let purchasedItems = []

  await getDocs(collectionReference).then(snapshot => {
    snapshot.docs.forEach(doc => {
      purchasedItems.push({id: doc.id, ...doc.data()})
    })
  })
  // console.log("x\n", JSON.stringify(x))

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

export {
  getPurchases, getSinglePurchase
}