import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Initialiser Firebase Auth
const auth = getAuth();

document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('Déconnexion réussie');
        // Assurer que la redirection est effectuée après que la déconnexion soit terminée
        setTimeout(() => {
            window.location.href = 'auth.html'; // Redirection vers la page d'authentification
        }, 1000); // Délai de 1 seconde pour garantir que la déconnexion est bien terminée
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
    }
});
