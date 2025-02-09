import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD5EM-WEJI-U3yDR7fnJKiOPYNEPaRTLwk",
    authDomain: "construct2-e0892.firebaseapp.com",
    projectId: "construct2-e0892",
    storageBucket: "construct2-e0892.firebasestorage.app",
    messagingSenderId: "1007509122026",
    appId: "1:1007509122026:web:9a8050da6b00f03d68a093"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// **Sign Up**
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = { email, firstName, lastName };

            setDoc(doc(db, "users", user.uid), userData)
                .then(() => {
                    localStorage.setItem('loggedInUserId', user.uid);
                    localStorage.setItem('userName', firstName + " " + lastName);
                    localStorage.setItem('userEmail', email);
                    window.location.href = 'homepage.html';
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                });
        })
        .catch((error) => {
            showMessage('Unable to create User', 'signUpMessage');
        });
});

// **Sign In**
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            localStorage.setItem('userEmail', email);
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            showMessage('Incorrect Email or Password', 'signInMessage');
        });
});

// **Google Sign-In**
const googleBtn = document.querySelector(".fab.fa-google");
if (googleBtn) {
    googleBtn.addEventListener("click", function () {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                localStorage.setItem('loggedInUserId', user.uid);
                localStorage.setItem('userName', user.displayName);
                localStorage.setItem('userEmail', user.email);
                window.location.href = "homepage.html";
            })
            .catch((error) => {
                console.error(error.message);
            });
    });
}
