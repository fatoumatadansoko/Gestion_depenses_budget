import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

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
    const productDetailsContainer = document.getElementById('product-details');

    // Fonction pour calculer le prix total
    const calculateTotalPrice = (products) => {
        return products.reduce((total, product) => total + (product.quantity * product.price), 0).toFixed(2);
    };

    // Fonction pour afficher les détails des produits
    const displayProductDetails = (products) => {
        productDetailsContainer.innerHTML = '';

        let totalPrice = calculateTotalPrice(products);

        let productDetailsHtml = `<h3>Détails des Produits</h3>`;
        productDetailsHtml += `<ul class="list-group">`;

        products.forEach(product => {
            productDetailsHtml += `
                <li class="list-group-item">
                    <strong>Date:</strong> ${product.date}<br>
                    <strong>Produit:</strong> ${product.name}<br>
                    <strong>Quantité:</strong> ${product.quantity}<br>
                    <strong>Prix Unitaire:</strong> ${product.price.toFixed(2)}€<br>
                    <strong>Total:</strong> ${(product.quantity * product.price).toFixed(2)}€
                </li>
            `;
        });

        productDetailsHtml += `</ul>`;
        productDetailsHtml += `<h4>Prix Total: ${totalPrice}€</h4>`;
        
        productDetailsContainer.innerHTML = productDetailsHtml;
    };

    // Fonction pour charger les produits depuis Firebase
    const loadProductsFromFirebase = async () => {
        const dbRef = ref(db, 'products/');
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : [];
    };

    try {
        const products = await loadProductsFromFirebase();
        displayProductDetails(Object.values(products));
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
    }
});

// Code pour générer le calendrier
document.addEventListener('DOMContentLoaded', function() {
    const calendarBody = document.getElementById('calendar-body');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        let calendarHtml = '<tr>';

        // Fill the initial empty cells
        for (let i = 0; i < firstDay; i++) {
            calendarHtml += '<td></td>';
        }

        // Fill the calendar with dates
        for (let day = 1; day <= lastDate; day++) {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const className = isToday ? 'today' : '';
            calendarHtml += `<td class="${className}">${day}</td>`;

            if ((day + firstDay) % 7 === 0) {
                calendarHtml += '</tr><tr>';
            }
        }

        // Close the last row if necessary
        if ((lastDate + firstDay) % 7 !== 0) {
            for (let i = (lastDate + firstDay) % 7; i < 7; i++) {
                calendarHtml += '<td></td>';
            }
            calendarHtml += '</tr>';
        }

        calendarBody.innerHTML = calendarHtml;
    }

    generateCalendar(year, month);
});
