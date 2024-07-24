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
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function() {
    const registrationSection = document.getElementById("registration-section");
    const loginSection = document.getElementById("login-section");
    const logoutButton = document.getElementById("logout");

    // Fonction pour obtenir les paramètres d'URL
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Afficher la section appropriée en fonction du paramètre d'URL
    const action = getUrlParameter('action');
    if (action === 'register') {
        registrationSection.style.display = 'block';
        loginSection.style.display = 'none';
    } else if (action === 'login') {
        registrationSection.style.display = 'none';
        loginSection.style.display = 'block';
    }

    // Event listener pour le bouton d'inscription
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
                console.log('Inscription réussie:', userCredential.user);
                registrationSection.style.display = 'none';
                loginSection.style.display = 'block';
            })
            .catch((error) => {
                console.error('Erreur lors de l\'inscription:', error.message);
                alert('Erreur lors de l\'inscription: ' + error.message);
            });
    });

    // Event listener pour le bouton de connexion
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
                console.log('Connexion réussie:', userCredential.user);
                logoutButton.style.display = 'block';
                window.location.href = 'produits.html'; // Redirection vers la page des produits
            })
            .catch((error) => {
                console.error('Erreur lors de la connexion:', error.message);
                alert('Erreur lors de la connexion: ' + error.message);
            });
    });

    // Gestion de l'état d'authentification
    auth.onAuthStateChanged((user) => {
        if (user) {
            logoutButton.style.display = 'block';
            if (window.location.pathname !== '/produits.html') {
                window.location.href = 'produits.html'; // Redirection vers la page des produits si ce n'est pas déjà sur cette page
            }
        } else {
            if (action === 'register') {
                registrationSection.style.display = 'block';
                loginSection.style.display = 'none';
            } else {
                registrationSection.style.display = 'none';
                loginSection.style.display = 'block';
            }
        }
    });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
