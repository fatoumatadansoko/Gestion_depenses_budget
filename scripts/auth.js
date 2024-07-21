import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// Votre configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDiW8qxDzIYMQmwrwjbCQwmVbdZtbojW-Y",
    authDomain: "projet-gestion-depense-budget.firebaseapp.com",
    projectId: "projet-gestion-depense-budget",
    storageBucket: "projet-gestion-depense-budget.appspot.com",
    messagingSenderId: "1053261280689",
    appId: "1:1053261280689:web:2afefe516ff5e681e9f990",
    measurementId: "G-8SS2X3JYTM"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", function() {
    const registrationSection = document.getElementById("registration-section");
    const loginSection = document.getElementById("login-section");
    const logoutButton = document.getElementById("logout");
    const showRegistrationLink = document.getElementById("show-registration");
    const showLoginLink = document.getElementById("show-login");

    // Afficher la section d'inscription et masquer la section de connexion
    showRegistrationLink.addEventListener("click", function(event) {
        event.preventDefault();
        registrationSection.style.display = 'block';
        loginSection.style.display = 'none';
    });

    // Afficher la section de connexion et masquer la section d'inscription
    showLoginLink.addEventListener("click", function(event) {
        event.preventDefault();
        registrationSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    document.getElementById("register").addEventListener("click", function() {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;

        if (!validateEmail(email)) {
            alert("Veuillez entrer un email valide.");
            return;
        }

        if (password.length < 8) {
            alert("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Inscription réussie
                console.log('Inscription réussie:', userCredential.user);
                registrationSection.style.display = 'none';
                loginSection.style.display = 'block';
            })
            .catch((error) => {
                console.log('Erreur lors de l\'inscription:', error.message);
            });
    });

    document.getElementById("login").addEventListener("click", function() {
        var email = document.getElementById("login_email").value;
        var password = document.getElementById("login_password").value;

        if (!validateEmail(email)) {
            alert("Veuillez entrer un email valide.");
            return;
        }

        if (password.length < 8) {
            alert("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Connexion réussie
                console.log('Connexion réussie:', userCredential.user);
                logoutButton.style.display = 'block';
                window.location.href = 'produits.html'; // Redirection vers la page des produits
            })
            .catch((error) => {
                console.log('Erreur lors de la connexion:', error.message);
            });
    });

   

    // Configuration initiale de l'affichage en fonction de l'état d'authentification
    auth.onAuthStateChanged((user) => {
        if (user) {
            // L'utilisateur est connecté
            logoutButton.style.display = 'block';
            if (window.location.pathname !== '/produits.html') {
                window.location.href = 'produits.html'; // Redirection vers la page des produits si ce n'est pas déjà sur cette page
            }
        } else {
            // Aucun utilisateur n'est connecté
            registrationSection.style.display = 'block';
            loginSection.style.display = 'none';
        }
    });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
