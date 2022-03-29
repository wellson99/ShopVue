import {doc, updateDoc, collection, addDoc, getDocs, Timestamp} from "firebase/firestore";
import {db} from "../firebaseConfig"

async function uploadReview(review){
  var result
  const documentReference = doc(db, "Users", review.userID, "Purchase", review.purchaseID)
  await updateDoc(documentReference, {
    items: review.updatedItemsList
  }).then(async () => {
    // result = true
    const collectionReference = collection(db, "Products", review.productID, "Reviews")
    await addDoc(collectionReference, {
      userID: review.userID,
      userName: review.userName,
      purchaseID: review.purchaseID,
      productID: review.productID,
      rating: review.userRating,
      review: review.userReview,
      date: Timestamp.now()
    }).then(() => {
      result = true
    }).catch(error => result = error.message)
  }).catch(error => result = error.message)

  return result
}

async function getProductReviews(productID){
  const collectionReference = collection(db, "Products", productID, "Reviews")
  let userReviews = []
  await getDocs(collectionReference).then(snapshot => {
    snapshot.docs.forEach(doc => {
      userReviews.push({id: doc.id, ...doc.data()})
    })
  })

  return userReviews
}

export {
  uploadReview, getProductReviews
}