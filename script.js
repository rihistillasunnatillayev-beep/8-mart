// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.transition = 'all 0.8s ease';
        observer.observe(title);
    });

    // Animate features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(30px)';
        feature.style.transition = `all 0.8s ease ${index * 0.2}s`;
        observer.observe(feature);
    });

    // Animate gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.8s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Animate wish items
    const wishItems = document.querySelectorAll('.wish-item');
    wishItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.8s ease ${index * 0.2}s`;
        observer.observe(item);
    });
});

// Load greetings from localStorage
function loadGreetings() {
    try {
        const greetings = JSON.parse(localStorage.getItem('8mart_greetings') || '[]');
        displayGreetings(greetings);
    } catch (error) {
        console.error('Error loading greetings:', error);
        showNotification('Tabriklarni yuklashda xatolik yuz berdi', 'error');
    }
}

// Save greetings to localStorage
function saveGreetings(greetings) {
    try {
        localStorage.setItem('8mart_greetings', JSON.stringify(greetings));
    } catch (error) {
        console.error('Error saving greetings:', error);
    }
}

// Display greetings
function displayGreetings(greetings) {
    const wishesList = document.getElementById('wishes-list');
    wishesList.innerHTML = '';

    if (greetings.length === 0) {
        wishesList.innerHTML = '<p class="no-greetings">Hozircha tabriklar yo\'q. Birinchi bo\'lib tabrik yuboring!</p>';
        return;
    }

    greetings.forEach(greeting => {
        const wishItem = document.createElement('div');
        wishItem.className = 'wish-item';
        
        const date = new Date(greeting.timestamp);
        const timeString = date.toLocaleString('uz-UZ', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });

        wishItem.innerHTML = `
            <div class="wish-header">
                <span class="wish-author">${escapeHtml(greeting.name)}</span>
                <span class="wish-time">${timeString}</span>
            </div>
            <p class="wish-message">${escapeHtml(greeting.message)}</p>
        `;

        wishesList.appendChild(wishItem);
    });
}

// Wish Form Submission
function submitWish() {
    const nameInput = document.getElementById('wish-name');
    const messageInput = document.getElementById('wish-message');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
        return;
    }

    try {
        // Get existing greetings
        const greetings = JSON.parse(localStorage.getItem('8mart_greetings') || '[]');
        
        // Create new greeting
        const newGreeting = {
            id: Date.now(),
            name: name,
            message: message,
            timestamp: new Date().toISOString()
        };

        // Add to beginning
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
        showNotification('Tabrikingiz muvaffaqiyatli yuborildi!', 'success');

        // Add confetti effect
        createConfetti();

        // Reload greetings
        loadGreetings();
    } catch (error) {
        console.error('Error submitting wish:', error);
        showNotification('Tabrikni saqlashda xatolik yuz berdi', 'error');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Confetti Effect
function createConfetti() {
    const confettiCount = 50;
    const confettiColors = ['#e91e63', '#f06292', '#fce4ec', '#f8bbd0', '#f48fb1'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: 0.8;
            z-index: 9999;
            pointer-events: none;
            animation: confettiFall 3s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;

        // Add animation keyframes if not already added
        if (!document.querySelector('#confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        top: 100%;
                        transform: rotate(${Math.random() * 720}deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 3000);
    }
}

// Gallery Lightbox Effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
        `;

        const content = this.querySelector('.gallery-image').cloneNode(true);
        content.style.cssText = `
            transform: scale(0.8);
            transition: transform 0.3s ease;
            max-width: 90%;
            max-height: 90%;
        `;

        lightbox.appendChild(content);
        document.body.appendChild(lightbox);

        // Animate in
        setTimeout(() => {
            lightbox.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 10);

        // Close on click
        lightbox.addEventListener('click', () => {
            lightbox.style.opacity = '0';
            content.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(lightbox);
            }, 300);
        });
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 800;
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGreetings();
});

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form validation
document.getElementById('wish-name')?.addEventListener('input', function() {
    if (this.value.length > 0) {
        this.style.borderColor = '#4caf50';
    } else {
        this.style.borderColor = 'transparent';
    }
});

document.getElementById('wish-message')?.addEventListener('input', function() {
    if (this.value.length > 0) {
        this.style.borderColor = '#4caf50';
    } else {
        this.style.borderColor = 'transparent';
    }
});

// Add smooth reveal animation for footer
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.footer-section').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = `all 0.8s ease ${index * 0.2}s`;
    footerObserver.observe(section);
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
window.addEventListener('scroll', debounce(() => {
    // Parallax and navbar effects are already debounced by being in separate handlers
}, 10));

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open lightbox
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.click();
        }
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            this.removeChild(ripple);
        }, 600);
    });
});

// Add ripple animation keyframes
if (!document.querySelector('#ripple-styles')) {
    const rippleStyle = document.createElement('style');
    rippleStyle.id = 'ripple-styles';
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}
