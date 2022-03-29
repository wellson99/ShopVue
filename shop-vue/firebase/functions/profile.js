/* eslint-disable */
import {getDoc, doc, updateDoc} from "firebase/firestore"
import {getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes} from "firebase/storage"
import {db} from "../firebaseConfig"

async function getProfile(userID){
  let profileInfo = []
  const documentReference = doc(db, "Users", userID)
  await getDoc(documentReference).then((doc) => {
    profileInfo.push({id: doc.id, ...doc.data()})
  })

  return profileInfo
}

async function updateProfile(image, profileInfo){
  const docRef = doc(db, "Users", profileInfo.id)
  var result

  if(image !== null){
    const imageType = image.type.split("/")[1]
    const imageMetadata = {contentType: image.type}
    const storageRef = ref(getStorage(), `profileImages/${profileInfo.id}.${imageType}`)

    await uploadBytes(storageRef, image, imageMetadata).then(async (snapshot) => {
      let imageURL = await getDownloadURL(snapshot.ref)
      await updateDoc(docRef, {
        firstName: profileInfo.firstName,
        lastName: profileInfo.lastName,
        imgURL: imageURL
      }).then(() => {
        result = {
          success: true, 
          firstName: profileInfo.firstName, 
          lastName: profileInfo.lastName,
          imgURL: imageURL
        }
      }).catch((error) => result = {success: false, message: error.message})
    }).catch((error) => result = {success: false, message: error.message})
  }else{
    await updateDoc(docRef, {
      firstName: profileInfo.firstName,
      lastName: profileInfo.lastName,
    }).then(() => {
      result = {
        success: true, 
        firstName: profileInfo.firstName, 
        lastName: profileInfo.lastName,
      }
    }).catch((error) => result = {success: false, message: error.message})
  }

  return result
}

export {getProfile, updateProfile}