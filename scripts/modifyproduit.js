import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, get, update, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDiW8qxDzIYMQmwrwjbCQwmVbdZtbojW-Y",
    authDomain: "projet-gestion-depense-budget.firebaseapp.com",
    databaseURL: "https://projet-gestion-depense-budget-default-rtdb.firebaseio.com",
    projectId: "projet-gestion-depense-budget",
    storageBucket: "projet-gestion-depense-budget.appspot.com",
    messagingSenderId: "1053261280689",
    appId: "1:1053261280689:web:2afefe516ff5e681e9f990",
    measurementId: "G-8SS2X3JYTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert("ID de produit manquant");
        window.location.href = 'produits.html';
        return;
    }

    const productNameInput = document.getElementById('product-name');
    const productQuantityInput = document.getElementById('product-quantity');
    const productPriceInput = document.getElementById('product-price');
    const productDateInput = document.getElementById('product-date');

    const dbRef = ref(db, `products/${productId}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
        const product = snapshot.val();
        productNameInput.value = product.name || '';
        productQuantityInput.value = product.quantity || '';
        productPriceInput.value = product.price || '';
        productDateInput.value = product.date || '';
    } else {
        alert("Produit introuvable");
        window.location.href = 'produits.html';
        return;
    }

    const modifyProductForm = document.getElementById('modify-product-form');
    modifyProductForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedProduct = {
            name: productNameInput.value,
            quantity: productQuantityInput.value,
            price: productPriceInput.value,
            date: productDateInput.value
        };

        await update(dbRef, updatedProduct);

        Swal.fire({
            title: "Good job!",
            text: "modifié avec succès!",
            icon: "success"
        }).then(() => {
            window.location.href = 'produits.html';
        });
    });

    const deleteButton = document.getElementById('delete-button');
    deleteButton.addEventListener('click', async () => {
        if (confirm('Es-tu sûr de vouloir supprimer ce produit?')) {
            try {
                await remove(dbRef);
                Swal.fire({
                    title: "Supprimé!",
                    text: "Le produit a été supprimé avec succès!",
                    icon: "success"
                }).then(() => {
                    window.location.href = 'produits.html';
                });
            } catch (error) {
                console.error('Erreur lors de la suppression du produit:', error);
            }
        }
    });
});
