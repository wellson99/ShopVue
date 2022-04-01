// eslint-disable-next-line
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth"
import {doc, Timestamp, setDoc, updateDoc} from "firebase/firestore"
import {db} from "../firebaseConfig"
import { getProfile } from "./profile"

const auth = getAuth()

async function signUpUser(signupDetails){
  var result
  await createUserWithEmailAndPassword(auth, signupDetails.email, signupDetails.pwd).then(async (cred) => {
    const documentReference = doc(db, "Users", cred.user.uid) 
    await setDoc(documentReference, {
      userEmail: cred.user.email,
      firstName: signupDetails.fName,
      lastName: signupDetails.lName,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      imgURL: null,
      lastLogout: null
    }).then(async () => {
      let userDetails = await getProfile(cred.user.uid)
      result = {success: true, uid: cred.user.uid, userDetails: userDetails}
    }).catch((error) => result =  {success: false, message: error.message})
  }).catch((error) => {
    result =  {
      success: false, 
      message: error.message, 
      display: "Failed to sign up account. Make sure you don't leave any section emptu and entered valid Email and Password."}
  })

  return result
}

async function signInUser(signinDetails){
  var result
  await signInWithEmailAndPassword(auth, signinDetails.email, signinDetails.pwd).then(async (cred) => {
    const documentReference = doc(db, "Users", cred.user.uid)
    await updateDoc(documentReference, {
      lastLogin: Timestamp.now()
    }).then(async () => {
      let userDetails = await getProfile(cred.user.uid)
      result = {success: true, uid: cred.user.uid, userDetails: userDetails}
    }).catch((error) => result =  {success: false, message: error.message})
  }).catch((error) => {
    result =  {success: false, message: error.message, display: "Failed to sign in to the account. Make sure you entered the correct Email and Password."}
  })

  return result
}

async function signOutUser(userID){
  var result
  await signOut(auth).then(async () => {
    const documentReference = doc(db, "Users", userID)
    await updateDoc(documentReference, {
      lastLogout: Timestamp.now()
    })
    .then(() => {
      result = {success: true}
    }).catch((error) => {
      result = {success: false, message: error.message}
    })
  }).catch((error) => result =  {success: false, message: error.message})

  return result
}

export {signInUser, signUpUser, signOutUser}