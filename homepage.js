import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
  import {getFirestore,getDoc,doc} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD5EM-WEJI-U3yDR7fnJKiOPYNEPaRTLwk",
    authDomain: "construct2-e0892.firebaseapp.com",
    projectId: "construct2-e0892",
    storageBucket: "construct2-e0892.firebasestorage.app",
    messagingSenderId: "1007509122026",
    appId: "1:1007509122026:web:9a8050da6b00f03d68a093"
  };
const app = initializeApp(firebaseConfig);

const auth=getAuth();
const db=getFirestore();

onAuthStateChanged(auth, (user)=>{
  const loggedInUserId=localStorage.getItem('loggedInUserId');
  if(loggedInUserId){
      console.log(user);
      const docRef = doc(db, "users", loggedInUserId);
      getDoc(docRef)
      .then((docSnap)=>{
          if(docSnap.exists()){
              const userData=docSnap.data();
              document.getElementById('user').innerText=userData.firstName+userData.lastName;
              document.getElementById('email').innerText=userData.email;
          }
          else{
              console.log("no document found matching id")
          }
      })
      .catch((error)=>{
          console.log("Error getting document");
      })
  }
  else{
      console.log("User Id not Found in Local storage")
  }
})

const logoutButton=document.getElementById('logout');

logoutButton.addEventListener('click',()=>{
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
  .then(()=>{
      window.location.href='index.html';
  })
  .catch((error)=>{
      console.error('Error Signing out:', error);
  })
})