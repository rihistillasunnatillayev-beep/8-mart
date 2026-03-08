// GitHub Gist ID - o'z Gistingizni kiriting
const GIST_ID = 'YOUR_GIST_ID';
const GIST_FILENAME = 'greetings.json';

// GitHub Gist API
const GIST_API = `https://api.github.com/gists/${GIST_ID}`;

// Load greetings from GitHub Gist
async function loadGreetings() {
    try {
        const response = await fetch(GIST_API);
        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }
        
        const gist = await response.json();
        const content = gist.files[GIST_FILENAME]?.content || '[]';
        const greetings = JSON.parse(content);
        
        console.log('Loaded greetings from GitHub Gist:', greetings);
        displayGreetings(greetings);
    } catch (error) {
        console.error('Error loading greetings:', error);
        showNotification('GitHub Gist dan yuklashda xatolik. Iltimos, GIST_ID ni tekshiring.', 'error');
        displayGreetings([]);
    }
}

// Save greetings to GitHub Gist
async function saveGreetings(greetings) {
    // GitHub Gist faqat o'qish uchun (GitHub Pages da token ishlamaydi)
    // Shu sababli localStorage dan foydalanamiz
    localStorage.setItem('8mart_greetings', JSON.stringify(greetings));
    console.log('Saved to localStorage as fallback');
}

// Wish Form Submission
async function submitWish() {
    const nameInput = document.getElementById('wish-name');
    const messageInput = document.getElementById('wish-message');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    console.log('Submitting wish:', { name, message });

    if (!name || !message) {
        showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
        return;
    }

    try {
        // GitHub Pages da server yo'q, shu sababli localStorage ga saqlaymiz
        const greetings = JSON.parse(localStorage.getItem('8mart_greetings') || '[]');
        
        const newGreeting = {
            id: Date.now(),
            name: name,
            message: message,
            timestamp: new Date().toISOString()
        };

        greetings.unshift(newGreeting);
        
        // Keep only last 50 greetings
        if (greetings.length > 50) {
            greetings.splice(50);
        }

        // Save to localStorage
        saveGreetings(greetings);

        // Clear form
        nameInput.value = '';
        messageInput.value = '';

        // Show success notification
        showNotification('Tabrikingiz saqlandi! (GitHub Pages - localStorage)', 'success');

        // Add confetti effect
        createConfetti();

        // Reload greetings
        displayGreetings(greetings);
        
    } catch (error) {
        console.error('Error submitting wish:', error);
        showNotification('Tabrikni saqlashda xatolik yuz berdi', 'error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGreetings();
});

// GitHub Pages uchun konfiguratsiya
if (window.location.hostname.includes('github.io')) {
    console.log('Running on GitHub Pages - using localStorage for persistence');
}
