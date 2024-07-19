import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDiW8qxDzIYMQmwrwjbCQwmVbdZtbojW-Y",
    authDomain: "projet-gestion-depense-budget.firebaseapp.com",
    projectId: "projet-gestion-depense-budget",
    storageBucket: "projet-gestion-depense-budget.appspot.com",
    messagingSenderId: "1053261280689",
    appId: "1:1053261280689:web:2afefe516ff5e681e9f990",
    measurementId: "G-8SS2X3JYTM"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-product-form');

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

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const date = document.getElementById('product-date').value;
        const name = document.getElementById('product-name').value;
        const quantity = document.getElementById('product-quantity').value;
        const price = document.getElementById('product-price').value;

        const newProduct = {
            date: date,
            name: name,
            quantity: quantity,
            price: price
        };

        try {
            const productRef = push(ref(db, 'products/'));
            await set(productRef, newProduct);
            alert('Produit ajouté avec succès !');
            form.reset();
            validateForm(); // Ensure the submit button is disabled
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            alert('Erreur lors de l\'ajout du produit: ' + error.message);
        }
    });
});
