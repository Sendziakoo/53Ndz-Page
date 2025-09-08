// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.85)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 255, 255, 0.15)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.75)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate skill bars when they come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent + '%';
            });
        }
    });
}, observerOptions);

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const finalValue = stat.getAttribute('data-final-value');
                const isPercentage = finalValue.includes('%');
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                
                // Random delay between 0 and 800ms for each stat
                const randomDelay = Math.random() * 400;
                
                setTimeout(() => {
                    animateNumber(stat, 0, numericValue, 2000 + randomDelay*4, isPercentage);
                }, randomDelay);
            });
        }
    });
}, observerOptions);

// Observe stats section
const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Number animation function
function animateNumber(element, start, end, duration, isPercentage) {
    const startTime = performance.now();
    const suffix = isPercentage ? '%' : '';
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Parallax effect for background elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.stars, .twinkling');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.25 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed - 200}px)`;
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Continuous typing effect that deletes and rewrites
function continuousTypeWriter(element, text, typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000) {
    let isTyping = true;
    let currentIndex = 0;
    
    function type() {
        if (currentIndex < text.length) {
            element.innerHTML = text.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(type, typeSpeed);
        } else {
            // Pause before deleting
            setTimeout(deleteText, pauseTime);
        }
    }
    
    function deleteText() {
        if (currentIndex > 0) {
            element.innerHTML = text.substring(0, currentIndex - 1);
            currentIndex--;
            setTimeout(deleteText, deleteSpeed);
        } else {
            // Pause before typing again
            setTimeout(type, pauseTime);
        }
    }
    
    // Start the cycle
    type();
}

// Initialize continuous typing effect when page loads
window.addEventListener('load', () => {
    const titleName = document.querySelector('.title-name');
    if (titleName) {
        const originalText = titleName.textContent;
        setTimeout(() => {
            continuousTypeWriter(titleName, originalText, 150, 75, 2000);
        }, 1000);
    }
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? 'linear-gradient(45deg, #00ff88, #00cc6a)' : 
                    type === 'error' ? 'linear-gradient(45deg, #ff4444, #cc0000)' : 
                    'linear-gradient(45deg, #00ffff, #0088ff)'};
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Particle system for additional background effects
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.init();
    }
    
    init() {
        // Create canvas for particles
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system
window.addEventListener('load', () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    new Particle(canvas);
});

// Cursor trail effect
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.trail.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        });
        
        this.animate();
    }
    
    animate() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.trail.forEach((point, index) => {
                const age = Date.now() - point.timestamp;
                const opacity = Math.max(0, 1 - age / 1000);
                const size = Math.max(0, 5 - age / 200);
                
                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Initialize cursor trail (optional - can be disabled for performance)
// new CursorTrail();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(45deg, #00ffff, #ff00ff);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Add hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects for buttons
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
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lanyard WebSocket integration
let lanyardSocket = null;
let discordData = null;

function initLanyardConnection() {
    const discordId = '454345966821048362';
    
    // Add loading state
    const discordCard = document.querySelector('.discord-card');
    if (discordCard) {
        discordCard.classList.add('loading');
    }
    
    // First, get initial data via REST API
    fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                discordData = data.data;
                updateDiscordProfile();
            }
        })
        .catch(error => {
            console.error('Error fetching Discord data:', error);
            showNotification('Failed to load Discord profile. Using fallback data.', 'warning');
            
            // Remove loading state
            const discordCard = document.querySelector('.discord-card');
            if (discordCard) {
                discordCard.classList.remove('loading');
            }
        });

    // Then establish WebSocket connection for real-time updates
    try {
        lanyardSocket = new WebSocket('wss://api.lanyard.rest/socket');
        
        lanyardSocket.onopen = function() {
            console.log('Lanyard WebSocket connected');
            // Subscribe to updates for the Discord ID
            lanyardSocket.send(JSON.stringify({
                op: 2,
                d: {
                    subscribe_to_id: discordId
                }
            }));
        };
        
        lanyardSocket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            
            if (data.t === 'INIT_STATE') {
                // Initial state received
                if (data.d && data.d[discordId]) {
                    discordData = data.d[discordId];
                    updateDiscordProfile();
                }
            } else if (data.t === 'PRESENCE_UPDATE') {
                // Real-time update received
                discordData = data.d;
                updateDiscordProfile();
            }
        };
        
        lanyardSocket.onerror = function(error) {
            console.error('Lanyard WebSocket error:', error);
        };
        
        lanyardSocket.onclose = function() {
            console.log('Lanyard WebSocket disconnected');
            // Attempt to reconnect after 5 seconds
            setTimeout(initLanyardConnection, 5000);
        };
    } catch (error) {
        console.error('Failed to establish Lanyard WebSocket connection:', error);
    }
}

function updateDiscordProfile() {
    if (!discordData) return;
    
    // Add loading state
    const discordCard = document.querySelector('.discord-card');
    if (discordCard) {
        discordCard.classList.remove('loading');
    }
    
    // Update username
    const usernameElement = document.querySelector('.discord-username');
    if (usernameElement) {
        const username = discordData.discord_user?.global_name || 
                        discordData.discord_user?.username ||
                        'Unknown User';
        usernameElement.textContent = username + ' #' + discordData.discord_user?.primary_guild?.tag;
    }
    
    // Update status
    const statusElement = document.querySelector('.discord-status');
    if (statusElement) {
        const status = discordData.discord_status || 'offline';
        let statusText = status.charAt(0).toUpperCase() + status.slice(1);
        
        // Special handling for "dnd" status
        if (status === 'dnd') {
            statusText = 'Do Not Disturb';
        }
        
        // Update the text content while preserving the status indicator
        const statusIndicator = statusElement.querySelector('.status-indicator');
        if (statusIndicator) {
            statusElement.innerHTML = `<span class="status-indicator ${status}"></span> ${statusText}`;
        } else {
            statusElement.textContent = statusText;
        }
    }
    
    // Update Discord ID
    const idElement = document.querySelector('.discord-id');
    if (idElement && discordData.discord_user?.id) {
        idElement.textContent = `Discord ID: ${discordData.discord_user.id}`;
    }
    
    // Update member since date
    const memberSinceElement = document.querySelector('.member-since');
    if (memberSinceElement && discordData.discord_user?.id) {
        const timestamp = parseInt(discordData.discord_user.id) / 4194304 + 1420070400000;
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long' };
        const memberSince = date.toLocaleDateString('en-US', options);
        memberSinceElement.textContent = `Member since: ${memberSince}`;
    }
    
    // Update playing status
    const playingElement = document.querySelector('.playing-status');
    if (playingElement) {
        let playingText = 'Not playing anything';
        if (discordData.activities && discordData.activities.length > 0) {
            const activity = discordData.activities[0];
            const activitydetails = discordData.activities[1];

            if (activitydetails.type === 0) { // Custom
                playingText = "Playing " + activitydetails.name;
            }else if (activitydetails.type === 2) { // Custom
                playingText = "Listening to " + activitydetails.name + " - "  + activitydetails.details;
            }   
        }
        playingElement.textContent = playingText;
    }

    // Update custom status with emoji
    const customStatusElement = document.querySelector('.custom-status');
    if (customStatusElement) {
        let customStatusText = 'No custom status';
        let emojiHtml = '';
        
        // Look for custom status activity (type 4)
        if (discordData.activities && discordData.activities.length > 0) {
            const customActivity = discordData.activities.find(activity => activity.type === 4);
            if (customActivity) {
                // Handle emoji if present
                if (customActivity.emoji && customActivity.emoji.id) {
                    const emojiUrl = `https://cdn.discordapp.com/emojis/${customActivity.emoji.id}`;
                    const emojiExtension = customActivity.emoji.animated ? '.gif' : '.png';
                    emojiHtml = `<img src="${emojiUrl}${emojiExtension}" alt="Custom Emoji" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px;">`;
                } else if (customActivity.emoji && customActivity.emoji.name) {
                    // Unicode emoji
                    emojiHtml = `<span style="margin-right: 5px;">${customActivity.emoji.name}</span>`;
                }
                
                // Set custom status text
                if (customActivity.state) {
                    customStatusText = customActivity.state;
                }
            }
        }
        
        // Update the element with emoji and status
        customStatusElement.innerHTML = emojiHtml + customStatusText;
    }
    
    // Update avatar if available
    const avatarElement = document.querySelector('.discord-avatar');
    if (avatarElement && discordData.discord_user?.avatar) {
        const avatarUrl = `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png`;
        avatarElement.innerHTML = `<img src="${avatarUrl}" alt="Discord Avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                   <i class="fab fa-discord" style="display: none;"></i>`;
    }
}

// Discord functionality
function copyDiscordTag() {
    let discordTag = 'Sendziak'; // Fallback
    
    if (discordData && discordData.discord_user) {
        const username = discordData.discord_user.username;
        const discriminator = discordData.discord_user.discriminator;
        if (discriminator && discriminator !== '0') {
            discordTag = `${username}#${discriminator}`;
        } else {
            discordTag = username;
        }
    }
    
    navigator.clipboard.writeText(discordTag).then(() => {
        showNotification('Discord tag copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = discordTag;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Discord tag copied to clipboard!', 'success');
    });
} 

// Simple Audio System using MP3 files
class SimpleAudioManager {
    constructor() {
        this.backgroundMusic = null;
        this.clickSound = null;
        this.isAudioEnabled = true;
        this.backgroundVolume = 0.3;
        this.clickVolume = 0.5;
        this.init();
    }

    init() {
        this.createAudioElements();
        this.setupAudioControls();
        this.setupClickListeners();
    }

    createAudioElements() {
        // Create background music element
        this.backgroundMusic = document.createElement('audio');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.backgroundVolume;
        this.backgroundMusic.preload = 'auto';
        
        // Create click sound element
        this.clickSound = document.createElement('audio');
        this.clickSound.volume = this.clickVolume;
        this.clickSound.preload = 'auto';
        
        // Set source files (you'll need to add these MP3 files to your project)
        this.backgroundMusic.src = 'ambient-background.mp3'; // Add your background music file
        this.clickSound.src = 'click-sound.mp3'; // Add your click sound file
        
        // Add error handling
        this.backgroundMusic.onerror = () => {
            console.log('Background music file not found. Please add ambient-background.mp3 to your project.');
        };
        
        this.clickSound.onerror = () => {
            console.log('Click sound file not found. Please add click-sound.mp3 to your project.');
        };
        
        // Add to document
        document.body.appendChild(this.backgroundMusic);
        document.body.appendChild(this.clickSound);
    }

    setupAudioControls() {
        // Create audio control button
        const audioControl = document.createElement('div');
        audioControl.className = 'audio-control';
        audioControl.innerHTML = `
            <button id="audio-toggle" class="audio-btn">
                <i class="fas fa-volume-up"></i>
            </button>
            <div class="audio-slider">
                <input type="range" id="background-volume" min="0" max="100" value="30">
                <label>Music</label>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .audio-control {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                background: rgba(0, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                transition: all 0.3s ease;
                align-items: center;
            }
            
            .audio-control:hover {
                background: rgba(0, 255, 255, 0.2);
                transform: translateY(-2px);
            }
            
            .audio-btn {
                background: linear-gradient(45deg, #00ffff, #ff00ff);
                border: none;
                color: #000;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .audio-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
            }
            
            .audio-btn.muted {
                background: linear-gradient(45deg, #666, #999);
                color: #fff;
            }
            
            .audio-slider {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.25rem;
            }
            
            .audio-slider input[type="range"] {
                width: 60px;
                height: 4px;
                background: rgba(0, 255, 255, 0.3);
                border-radius: 2px;
                outline: none;
                -webkit-appearance: none;
            }
            
            .audio-slider input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                background: #00ffff;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            
            .audio-slider label {
                font-size: 0.7rem;
                color: #00ffff;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(audioControl);

        // Setup event listeners
        const audioToggle = document.getElementById('audio-toggle');
        const backgroundVolumeSlider = document.getElementById('background-volume');

        audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });

        backgroundVolumeSlider.addEventListener('input', (e) => {
            this.setBackgroundVolume(e.target.value / 100);
        });
    }

    setupClickListeners() {
        // Add click sound to all interactive elements
        const clickableElements = document.querySelectorAll('button, .btn, .nav-link, .project-link, .social-links a, .feature-item, .discord-profile, .project-card, .stat-item, .meta-card');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', () => {
                this.playClickSound();
            });
        });

        // Also add to any dynamically created elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const newClickables = node.querySelectorAll ? node.querySelectorAll('button, .btn, .nav-link, .project-link, .social-links a, .feature-item, .discord-profile, .project-card, .stat-item, .meta-card') : [];
                        newClickables.forEach(element => {
                            element.addEventListener('click', () => {
                                this.playClickSound();
                            });
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    playClickSound() {
        if (!this.isAudioEnabled || !this.clickSound) return;
        
        // Reset the audio to the beginning and play
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(e => {
            console.log('Could not play click sound:', e);
        });
    }

    startBackgroundMusic() {
        if (!this.isAudioEnabled || !this.backgroundMusic) return;
        
        this.backgroundMusic.play().catch(e => {
            console.log('Could not play background music:', e);
        });
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    toggleAudio() {
        this.isAudioEnabled = !this.isAudioEnabled;
        const audioToggle = document.getElementById('audio-toggle');
        const icon = audioToggle.querySelector('i');

        if (this.isAudioEnabled) {
            icon.className = 'fas fa-volume-up';
            audioToggle.classList.remove('muted');
            this.startBackgroundMusic();
        } else {
            icon.className = 'fas fa-volume-mute';
            audioToggle.classList.add('muted');
            this.stopBackgroundMusic();
        }
    }

    setBackgroundVolume(volume) {
        this.backgroundVolume = volume;
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = volume;
        }
    }
}

// Initialize Audio Manager
let audioManager;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lanyard connection
    initLanyardConnection();

    // Initialize Audio Manager
    audioManager = new SimpleAudioManager();

    // Funkcja do uruchomienia muzyki
    function enableMusicOnInteraction() {
        if (audioManager) {
            audioManager.startBackgroundMusic();
            console.log("Background music started.");
        }
        // Usuwamy nasłuchiwacz po pierwszym kliknięciu
        document.removeEventListener('click', enableMusicOnInteraction);
    }

    // Czekamy na pierwszą interakcję użytkownika
    document.addEventListener('click', enableMusicOnInteraction);
});
