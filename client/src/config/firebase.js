import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJh1Mqj90Kcjf1OHZuRqw3PsXPgX0f_Fo",
  authDomain: "social-media-100.firebaseapp.com",
  projectId: "social-media-100",
  storageBucket: "social-media-100.appspot.com",
  messagingSenderId: "639281413828",
  appId: "1:639281413828:web:7c1e5a44854bab36d7d391",
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storageRef = firebase.storage().ref();

export const getImageUrl = async (filename) => {
  try {
    const url = await storageRef.child("User DP/" + filename).getDownloadURL();
    return url;
  } catch (error) {
    return null;
  }
};

export const getPostImageUrl = async (filename, userId = 0) => {
  try {
    const url = await storageRef
      .child(`User posts/${userId}/${filename}`)
      .getDownloadURL();
    return url;
  } catch (error) {
    return null;
  }
};
