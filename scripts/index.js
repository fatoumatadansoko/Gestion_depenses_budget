document.addEventListener('DOMContentLoaded', () => {
    const welcomeText = document.getElementById('welcome-text');
    const subText = document.getElementById('sub-text');

    const welcomeMessages = ['Bienvenue'];
    const subMessages = ['Athia gnou sakanal'];

    let welcomeIndex = 0;
    let subIndex = 0;

    function updateText() {
        welcomeText.classList.remove('animated-text');
        subText.classList.remove('animated-text');

        setTimeout(() => {
            welcomeText.textContent = welcomeMessages[welcomeIndex];
            subText.textContent = subMessages[subIndex];

            welcomeText.classList.add('animated-text');
            subText.classList.add('animated-text');

            welcomeIndex = (welcomeIndex + 1) % welcomeMessages.length;
            subIndex = (subIndex + 1) % subMessages.length;
        }, 500);
    }

    setInterval(updateText, 3000);
});
