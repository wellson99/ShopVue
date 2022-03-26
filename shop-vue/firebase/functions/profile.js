/* eslint-disable */
import {getDoc, doc} from "firebase/firestore"
import {db} from "../firebaseConfig"

async function getProfile(userID){
  let profileInfo = []
  const documentReference = doc(db, "Users", userID)
  await getDoc(documentReference).then((doc) => {
    profileInfo.push({id: doc.id, ...doc.data()})
  })

  return profileInfo
}

// async function getProfile(userID){
//   let profileInfo = []
//   const documentReference = doc(db, "Users", userID)
//   onSnapshot(documentReference, (doc) => {   
//     profileInfo.push({id: doc.id, ...doc.data()})
//   })

//   return profileInfo
// }

export {
  getProfile
}