// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random animation duration and delay
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to the clicked nav item
    const navItems = document.querySelectorAll('.nav-item');
    for (let i = 0; i < navItems.length; i++) {
        if (navItems[i].getAttribute('onclick').includes(sectionId)) {
            navItems[i].classList.add('active');
            break;
        }
    }
    
    // Scroll to top of the section
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize particles when page loads
window.addEventListener('load', createParticles);

// Add some interactivity to deliverables
document.addEventListener('DOMContentLoaded', () => {
    // Make deliverables slightly interactive on hover
    const deliverables = document.querySelectorAll('.deliverable');
    deliverables.forEach(deliverable => {
        deliverable.addEventListener('mouseenter', () => {
            deliverable.style.transform = 'translateY(-5px)';
            deliverable.style.boxShadow = '0 5px 15px rgba(255, 200, 0, 0.2)';
        });
        
        deliverable.addEventListener('mouseleave', () => {
            deliverable.style.transform = 'translateY(0)';
            deliverable.style.boxShadow = 'none';
        });
    });
    
    // Set the first section as active by default if none is active
    if (!document.querySelector('.section.active')) {
        document.querySelector('.section').classList.add('active');
    }
    
    // Add active class to the first nav item by default if none is active
    if (!document.querySelector('.nav-item.active')) {
        document.querySelector('.nav-item').classList.add('active');
    }
});