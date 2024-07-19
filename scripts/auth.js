$(document).ready(function() {
    $('#login-section').hide(); // Masquer la section de connexion au chargement

    $('#register').click(function() {
        // Masquer la section de connexion
        $('#login-section').hide();

        // Simuler l'inscription et afficher la section de connexion après l'inscription
        setTimeout(function() {
            alert("Inscription réussie. Veuillez vous connecter.");
            $('#registration-section').hide();
            $('#login-section').show();
        }, 1000); // Temps d'attente simulé pour l'inscription
    });

    $('#login').click(function() {
        // Gestion de la connexion ici
        alert("Connexion réussie.");
        $('#login-section').hide();
        $('#logout').show();
    });

    $('#logout').click(function() {
        // Gestion de la déconnexion ici
        alert("Déconnexion réussie.");
        $('#registration-section').hide();
        $('#login-section').show();
        $('#logout').hide();
    });
});
