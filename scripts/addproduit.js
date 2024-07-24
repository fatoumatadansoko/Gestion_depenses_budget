import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// Configuration Firebase
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
const db = getDatabase(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-product-form');
    let currentUser = null;

    const validateField = (input, errorElement, minLength, pattern) => {
        let isValid = true;
        errorElement.innerHTML = "";
        if (input.value.trim() === "" || (minLength && input.value.length < minLength) || (pattern && !pattern.test(input.value))) {
            errorElement.innerHTML = "Ce champ est requis et doit respecter les contraintes.";
            isValid = false;
        }
        return isValid;
    };

    const validateForm = () => {
        let isValid = true;
        isValid = validateField(document.getElementById('product-date'), document.getElementById('errorDate')) && isValid;
        isValid = validateField(document.getElementById('product-name'), document.getElementById('errorName'), 3) && isValid;
        isValid = validateField(document.getElementById('product-quantity'), document.getElementById('errorQuantity'), 1) && isValid;
        isValid = validateField(document.getElementById('product-price'), document.getElementById('errorPrice'), 1) && isValid;
        document.getElementById('submitBtn').disabled = !isValid;
    };

    const formInputs = document.querySelectorAll('#add-product-form input');
    formInputs.forEach(input => input.addEventListener('input', validateForm));

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
        } else {
            currentUser = null;
            // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
            window.location.href = 'auth.html?action=login';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        if (!currentUser) {
            alert("Vous devez être connecté pour ajouter un produit.");
            return;
        }

        const date = document.getElementById('product-date').value;
        const name = document.getElementById('product-name').value;
        const quantity = document.getElementById('product-quantity').value;
        const price = document.getElementById('product-price').value;

        const newProduct = {
            date: date,
            name: name,
            quantity: quantity,
            price: price,
            userId: currentUser.uid // Associer la dépense à l'utilisateur connecté
        };

        try {
            const productRef = push(ref(db, `users/${currentUser.uid}/products`));
            await set(productRef, newProduct);
            
            // Afficher une notification SweetAlert2
            Swal.fire({
                title: 'Bon travail!',
                text: 'Produit ajouté avec succès!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'produits.html'; // Redirection vers la liste des produits
            });
            
            form.reset();
            validateForm(); // Ensure the submit button is disabled
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            alert('Erreur lors de l\'ajout du produit: ' + error.message);
        }
    });
});
