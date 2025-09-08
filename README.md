# 🚀 Futuristic Profile Website

A stunning, modern portfolio website with animated backgrounds, futuristic design elements, and smooth interactions. Perfect for developers, designers, and creative professionals looking to showcase their work with a cutting-edge aesthetic.

## ✨ Features

### 🎨 Visual Design
- **Animated Background**: Multi-layered animated background with stars, twinkling effects, floating clouds, and grid overlay
- **Futuristic Color Scheme**: Cyan, magenta, and gradient combinations for a sci-fi aesthetic
- **Typography**: Orbitron (for headings) and Rajdhani (for body text) fonts for a modern look
- **Responsive Design**: Fully responsive across all devices and screen sizes

### 🎭 Animations & Effects
- **Gradient Shifts**: Dynamic background gradients that continuously shift
- **Parallax Scrolling**: Background elements move at different speeds for depth
- **Skill Bar Animations**: Animated progress bars that fill when scrolled into view
- **Number Counters**: Animated statistics with smooth counting effects
- **Typing Effect**: Hero title animates with a typewriter effect
- **Hover Effects**: Interactive hover states for all clickable elements
- **Particle System**: Floating particles in the background for extra atmosphere

### 📱 Interactive Elements
- **Smooth Scrolling**: Navigation links smoothly scroll to sections
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Form Validation**: Contact form with validation and success notifications
- **Scroll Progress**: Visual progress bar showing scroll position
- **Button Ripple Effects**: Material design-inspired ripple effects on button clicks

### 🏗️ Sections Included
1. **Hero Section**: Eye-catching introduction with animated profile image
2. **About Section**: Personal information with animated statistics
3. **Skills Section**: Interactive skill bars with progress animations
4. **Projects Section**: Project showcase with hover effects
5. **Discord Profile Section**: Live Discord integration with real-time status updates
6. **Footer**: Social links and copyright information

### 🔗 Discord Integration
The template includes live Discord profile integration using the Lanyard API:
- **Real-time Status**: Shows current Discord status (online, idle, dnd, offline)
- **Live Activities**: Displays what you're currently playing, listening to, or streaming
- **Profile Information**: Username, Discord ID, member since date, and avatar
- **WebSocket Updates**: Automatically updates when your Discord status changes
- **Copy Discord Tag**: One-click copy of your Discord username to clipboard

## 🚀 Quick Start

### Prerequisites
- A modern web browser
- Basic knowledge of HTML, CSS, and JavaScript (for customization)

### Installation
1. Download or clone this repository
2. Open `index.html` in your web browser
3. That's it! The website should load with all animations and effects

### Local Development
If you want to modify the template:
1. Use a local server (like Live Server in VS Code)
2. Open the project folder in your code editor
3. Make changes to the files and see them update in real-time

## 🎨 Customization Guide

### Personal Information
Edit the following in `index.html`:

```html
<!-- Update your name -->
<span class="title-name">Your Name</span>

<!-- Update your role -->
<span class="title-role">Full Stack Developer</span>

<!-- Update description -->
<p class="hero-description">
    Your custom description here...
</p>

<!-- Update statistics -->
<div class="stat-item">
    <span class="stat-number">5+</span>
    <span class="stat-label">Years Experience</span>
</div>
```

### Skills
Modify the skills section by updating the data-percent attributes:

```html
<div class="skill-progress" data-percent="95"></div>
```

### Projects
Replace the project cards with your own:

```html
<div class="project-card">
    <div class="project-image">
        <!-- Add your project image here -->
    </div>
    <div class="project-content">
        <h3>Your Project Name</h3>
        <p>Project description...</p>
        <div class="project-tech">
            <span class="tech-tag">Technology</span>
        </div>
    </div>
</div>
```

### Discord Integration
To customize the Discord integration, edit the Discord ID in `script.js`:

```javascript
// Change this to your Discord ID
const discordId = '454345966821048362';
```

The integration will automatically:
- Fetch your Discord profile data
- Display your current status and activities
- Update in real-time when your status changes
- Show your Discord avatar (if available)

### Contact Information
Update the contact details:

```html
<div class="contact-item">
    <i class="fas fa-envelope"></i>
    <div>
        <h4>Email</h4>
        <p>your.email@example.com</p>
    </div>
</div>
```

### Colors
The main color scheme uses CSS custom properties. You can modify them in `styles.css`:

```css
:root {
    --primary-color: #00ffff;
    --secondary-color: #ff00ff;
    --accent-color: #ffff00;
    --background-dark: #0a0a0a;
    --text-light: #ffffff;
    --text-muted: #888888;
}
```

### Background Animation
Customize the background animations by modifying the keyframes in `styles.css`:

```css
@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## 🎯 Performance Tips

1. **Optimize Images**: Use compressed images for project screenshots
2. **Reduce Particles**: Modify the particle count in `script.js` if performance is an issue
3. **Disable Effects**: Comment out the cursor trail effect for better performance on slower devices
4. **Lazy Loading**: Consider implementing lazy loading for images if you have many projects

## 🔧 Advanced Customization

### Adding New Sections
1. Create a new section in `index.html`
2. Add corresponding styles in `styles.css`
3. Update navigation menu if needed

### Custom Animations
Add new keyframe animations in `styles.css`:

```css
@keyframes yourAnimation {
    0% { /* initial state */ }
    50% { /* middle state */ }
    100% { /* final state */ }
}
```

### JavaScript Enhancements
Add new interactive features in `script.js`:

```javascript
// Example: Add a new animation
function yourCustomAnimation() {
    // Your animation logic here
}
```

## 📄 License

This template is free to use for personal and commercial projects. Attribution is appreciated but not required.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this template.

## 📞 Support

If you need help customizing this template or have questions, feel free to reach out!

---


**Made with ❤️ for the developer community** 
