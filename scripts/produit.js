import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const productDetailsContainer = document.getElementById('product-details');
    const filterDay = document.getElementById('filter-day');
    const calendarBody = document.getElementById('calendar-body');

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Fonction pour calculer le prix total
    const calculateTotalPrice = (products) => {
        return products.reduce((total, product) => total + (parseFloat(product.quantity) * parseFloat(product.price)), 0).toFixed(2);
    };

    // Fonction pour afficher les détails des produits
    const displayProductDetails = (products) => {
        console.log('Affichage des produits:', products); // Ajouté pour débogage
        productDetailsContainer.innerHTML = '';

        let totalPrice = calculateTotalPrice(products);

        let productDetailsHtml = `<h3>Détails des Produits</h3>`;
        productDetailsHtml += `<ul class="list-group">`;

        products.forEach(product => {
            let quantity = parseFloat(product.quantity) || 0;
            let price = parseFloat(product.price) || 0;
            const boughtClass = product.bought ? 'bought' : '';
            const checked = product.bought ? 'checked' : '';
            productDetailsHtml += `
                <li class="list-group-item ${boughtClass}" data-product-id="${product.id}">
                    <input type="checkbox" class="bought-checkbox" ${checked}> 
                    <div class="product-detail">
                        <strong>Date:</strong> ${product.date || ''}<br>
                        <strong>Produit:</strong> ${product.name || ''}<br>
                        <strong>Quantité:</strong> ${quantity}<br>
                        <strong>Prix Unitaire:</strong> ${price.toFixed(2)}CFA<br>
                        <strong>Total:</strong> ${(quantity * price).toFixed(2)}CFA
                    </div>
                </li>
            `;
        });

        productDetailsHtml += `</ul>`;
        productDetailsHtml += `<h4>Prix Total: ${totalPrice}CFA</h4>`;
        
        productDetailsContainer.innerHTML = productDetailsHtml;

        document.querySelectorAll('.bought-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async (event) => {
                const productId = event.target.closest('.list-group-item').dataset.productId;
                const isChecked = event.target.checked;
                await updateProductBoughtStatus(productId, isChecked);
            });
        });

        document.querySelectorAll('.list-group-item').forEach(item => {
            item.addEventListener('click', (event) => {
                if (!event.target.classList.contains('bought-checkbox')) {
                    const productId = event.currentTarget.dataset.productId;
                    window.location.href = `modifyproduit.html?id=${productId}`;
                }
            });
        });
    };

    // Fonction pour charger les produits depuis Firebase
    const loadProductsFromFirebase = async (userId) => {
        const dbRef = ref(db, `users/${userId}/products`);
        try {
            const snapshot = await get(dbRef);
            const products = snapshot.exists() ? Object.entries(snapshot.val()).map(([id, product]) => ({ id, ...product })) : [];
            console.log('Produits chargés:', products); // Ajouté pour débogage
            return products;
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            return [];
        }
    };

    // Fonction pour mettre à jour le statut d'achat d'un produit
    const updateProductBoughtStatus = async (productId, bought) => {
        const userId = auth.currentUser.uid;
        const dbRef = ref(db, `users/${userId}/products/${productId}`);
        await update(dbRef, { bought: bought });

        // Mettre à jour uniquement l'élément DOM correspondant
        const productItem = document.querySelector(`[data-product-id="${productId}"]`);
        if (productItem) {
            if (bought) {
                productItem.classList.add('bought');
                productItem.querySelector('.bought-checkbox').checked = true;
            } else {
                productItem.classList.remove('bought');
                productItem.querySelector('.bought-checkbox').checked = false;
            }
        }
    };

    // Fonction pour filtrer les produits par jour
    const filterProductsByDay = (products, day) => {
        if (!day) return products;
        return products.filter(product => product.date === day);
    };

    // Fonction pour charger les jours pour le filtre
    const loadFilterDays = (products) => {
        const uniqueDates = [...new Set(products.map(product => product.date))];
        filterDay.innerHTML = '<option value="">Tous les jours</option>'; // Réinitialiser les options

        uniqueDates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            filterDay.appendChild(option);
        });
    };

    // Fonction pour générer le calendrier
    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        let calendarHtml = '<tr>';

        // Remplir les cellules vides initiales
        for (let i = 0; i < firstDay; i++) {
            calendarHtml += '<td></td>';
        }

        // Remplir le calendrier avec les dates
        for (let day = 1; day <= lastDate; day++) {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const className = isToday ? 'today' : '';
            calendarHtml += `<td class="${className}">${day}</td>`;

            if ((day + firstDay) % 7 === 0) {
                calendarHtml += '</tr><tr>';
            }
        }

        // Fermer la dernière ligne si nécessaire
        if ((lastDate + firstDay) % 7 !== 0) {
            for (let i = (lastDate + firstDay) % 7; i < 7; i++) {
                calendarHtml += '<td></td>';
            }
            calendarHtml += '</tr>';
        }

        calendarBody.innerHTML = calendarHtml;
    }

    // Vérifier l'état de connexion
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Utilisateur connecté
            const userId = user.uid;

            try {
                const products = await loadProductsFromFirebase(userId);
                loadFilterDays(products); // Charger les options du filtre
                if (products.length === 0) {
                    productDetailsContainer.innerHTML = "<p>Commencez à planifier vos courses.</p>";
                } else {
                    displayProductDetails(products);
                }

                // Mettre à jour l'affichage en fonction du filtre sélectionné
                filterDay.addEventListener('change', (event) => {
                    const selectedDay = event.target.value;
                    const filteredProducts = filterProductsByDay(products, selectedDay);
                    displayProductDetails(filteredProducts);
                });

            } catch (error) {
                console.error('Erreur lors de la récupération des produits:', error);
                productDetailsContainer.innerHTML = "<p>Erreur lors de la récupération des produits.</p>";
            }
        } else {
            // Aucun utilisateur connecté
            productDetailsContainer.innerHTML = "<p>Veuillez vous connecter pour voir vos produits.</p>";
        }
    });

    // Générer le calendrier
    generateCalendar(year, month);
});
