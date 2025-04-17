document.addEventListener('DOMContentLoaded', function() {
    // Create background container
    const bgContainer = document.createElement('div');
    bgContainer.className = 'interactive-bg';
    document.body.appendChild(bgContainer);
    
    // Create cursor follower
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);
    
    // Software logos (you can add more)
    const softwareLogos = [
        'https://cdn-icons-png.flaticon.com/512/732/732221.png', // Adobe
        'https://cdn-icons-png.flaticon.com/512/5968/5968705.png', // Figma
        'https://cdn-icons-png.flaticon.com/512/5968/5968523.png', // VS Code
        'https://cdn-icons-png.flaticon.com/512/5968/5968313.png', // Slack
        'https://cdn-icons-png.flaticon.com/512/732/732220.png', // Microsoft
        'https://cdn-icons-png.flaticon.com/512/5968/5968672.png', // Bootstrap
        'https://cdn-icons-png.flaticon.com/512/5968/5968381.png', // Chrome
        'https://cdn-icons-png.flaticon.com/512/5968/5968242.png'  // Photoshop
    ];
    
    // Create floating software logos
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'software-particle';
        
        // Random properties
        const size = 30 + Math.random() * 30;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const logo = softwareLogos[Math.floor(Math.random() * softwareLogos.length)];
        const rotation = Math.random() * 360;
        const opacity = 0.3 + Math.random() * 0.5;
        
        // Apply properties
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.backgroundImage = `url(${logo})`;
        particle.style.transform = `rotate(${rotation}deg)`;
        particle.style.opacity = opacity;
        
        // Add animation
        animateParticle(particle);
        
        bgContainer.appendChild(particle);
    }
    
    // Mouse move effects
    document.addEventListener('mousemove', function(e) {
        // Update cursor follower position
        cursorFollower.style.left = `${e.clientX}px`;
        cursorFollower.style.top = `${e.clientY}px`;
        
        // Create ripple effect when mouse moves quickly
        if (Math.random() > 0.7) {
            createRipple(e.clientX, e.clientY);
        }
        
        // Move particles away from cursor
        const particles = document.querySelectorAll('.software-particle');
        particles.forEach(particle => {
            const particleRect = particle.getBoundingClientRect();
            const particleX = particleRect.left + particleRect.width / 2;
            const particleY = particleRect.top + particleRect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(e.clientX - particleX, 2) + 
                Math.pow(e.clientY - particleY, 2)
            );
            
            if (distance < 150) {
                const angle = Math.atan2(
                    particleY - e.clientY, 
                    particleX - e.clientX
                );
                
                const force = (150 - distance) / 10;
                const newX = parseFloat(particle.style.left) + Math.cos(angle) * force;
                const newY = parseFloat(particle.style.top) + Math.sin(angle) * force;
                
                particle.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px) rotate(${particle.style.transform.split('rotate(')[1]}`;
            } else {
                particle.style.transform = `rotate(${particle.style.transform.split('rotate(')[1]}`;
            }
        });
    });
    
    // Mouse click effect
    document.addEventListener('mousedown', function(e) {
        cursorFollower.classList.add('active');
        createRipple(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', function() {
        cursorFollower.classList.remove('active');
    });
    
    // Create ripple effect
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        bgContainer.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1500);
    }
    
    // Animate particles with random floating motion
    function animateParticle(particle) {
        const startX = parseFloat(particle.style.left);
        const startY = parseFloat(particle.style.top);
        let angle = Math.random() * Math.PI * 2;
        let speed = 0.1 + Math.random() * 0.2;
        let range = 2 + Math.random() * 3;
        
        function float() {
            const now = Date.now() / 1000;
            const x = startX + Math.cos(angle + now * speed) * range;
            const y = startY + Math.sin(angle + now * speed) * range;
            
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            
            requestAnimationFrame(float);
        }
        
        float();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Create background container if not exists
    let bgContainer = document.querySelector('.interactive-bg');
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.className = 'interactive-bg';
        document.body.appendChild(bgContainer);
    }

    // Holi color palette
    const holiColors = [
        '#FF5252', // Red
        '#FF4081', // Pink
        '#E040FB', // Purple
        '#7C4DFF', // Deep Purple
        '#536DFE', // Indigo
        '#448AFF', // Blue
        '#40C4FF', // Light Blue
        '#18FFFF', // Cyan
        '#64FFDA', // Teal
        '#69F0AE', // Green
        '#B2FF59', // Light Green
        '#EEFF41', // Lime
        '#FFFF00', // Yellow
        '#FFD740', // Amber
        '#FFAB40', // Orange
        '#FF6E40'  // Deep Orange
    ];

    // Create initial smoke cursor
    const smokeCursor = document.createElement('div');
    smokeCursor.className = 'color-smoke';
    document.body.appendChild(smokeCursor);

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let velocity = 0;
    let angle = 0;
    let lastTime = 0;
    let particles = [];

    // Mouse move event
    document.addEventListener('mousemove', function(e) {
        // Update mouse position
        lastX = mouseX;
        lastY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Calculate velocity and angle
        const now = Date.now();
        const deltaTime = now - lastTime;
        lastTime = now;

        if (deltaTime > 0) {
            const dx = mouseX - lastX;
            const dy = mouseY - lastY;
            velocity = Math.sqrt(dx * dx + dy * dy) / deltaTime * 0.5;
            angle = Math.atan2(dy, dx);
        }

        // Update main smoke cursor
        smokeCursor.style.left = `${mouseX}px`;
        smokeCursor.style.top = `${mouseY}px`;
        
        // Change color based on movement
        const colorIndex = Math.floor(Math.abs(angle) * 3 % holiColors.length);
        smokeCursor.style.backgroundColor = holiColors[colorIndex];

        // Create smoke particles
        createSmokeParticles(mouseX, mouseY, velocity, angle);
    });

    // Create smoke particles
    function createSmokeParticles(x, y, velocity, angle) {
        const particleCount = Math.floor(velocity * 0.5) + 1;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'smoke-particle';
            
            // Random size and position
            const size = 5 + Math.random() * 15;
            const color = holiColors[Math.floor(Math.random() * holiColors.length)];
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            const lifetime = 800 + Math.random() * 700;
            
            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x + offsetX}px`;
            particle.style.top = `${y + offsetY}px`;
            particle.style.backgroundColor = color;
            particle.style.animationDuration = `${lifetime}ms`;
            
            // Add to DOM
            document.body.appendChild(particle);
            
            // Remove after animation completes
            setTimeout(() => {
                particle.remove();
            }, lifetime);
        }
    }

    // Animate function
    function animate() {
        // Continue creating particles even when mouse isn't moving
        if (velocity > 0.1) {
            createSmokeParticles(mouseX, mouseY, velocity * 0.7, angle);
            velocity *= 0.95; // Gradually reduce velocity
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();

    // Keep the software logo particles from previous code if you want
    // ... (keep the existing software particle code if you want both effects)
});

document.addEventListener('DOMContentLoaded', function() {
    // Create space container
    const spaceContainer = document.createElement('div');
    spaceContainer.className = 'space-container';
    document.body.appendChild(spaceContainer);

    // Create astronaut cursor
    const astronautCursor = document.createElement('div');
    astronautCursor.className = 'astronaut-cursor';
    astronautCursor.innerHTML = '<i class="fas fa-user-astronaut"></i>';
    document.body.appendChild(astronautCursor);

    // Create stars
    createStars(200);

    // Three.js 3D Space Scene
    initThreeJSScene();

    // Mouse movement for astronaut cursor
    document.addEventListener('mousemove', function(e) {
        astronautCursor.style.left = `${e.clientX}px`;
        astronautCursor.style.top = `${e.clientY}px`;
        
        // Add slight rotation based on movement direction
        const dx = e.movementX;
        const dy = e.movementY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        astronautCursor.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
    });

    // Click effect
    document.addEventListener('click', function() {
        astronautCursor.style.transform = `translate(-50%, -50%) scale(1.3)`;
        setTimeout(() => {
            astronautCursor.style.transform = `translate(-50%, -50%) scale(1)`;
        }, 200);
    });

    // Create twinkling stars
    function createStars(count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random properties
            const size = Math.random() * 3;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const opacity = 0.1 + Math.random() * 0.9;
            const duration = 2 + Math.random() * 3;
            
            // Apply properties
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${posX}%`;
            star.style.top = `${posY}%`;
            star.style.opacity = opacity;
            star.style.animation = `twinkle ${duration}s infinite alternate`;
            
            spaceContainer.appendChild(star);
        }
    }

    // Three.js 3D Scene
    function initThreeJSScene() {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        spaceContainer.appendChild(renderer.domElement);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Create planets
        createPlanet(scene, 2, 0x3498db, 0, 0, -10, 1); // Blue planet
        createPlanet(scene, 1.5, 0xe74c3c, 5, 3, -15, 0.7); // Red planet
        createPlanet(scene, 3, 0x2ecc71, -6, -2, -20, 0.5); // Green planet

        // Add stars in 3D
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Camera position
        camera.position.z = 5;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate planets
            scene.children.forEach(child => {
                if (child.userData.isPlanet) {
                    child.rotation.y += child.userData.rotationSpeed * 0.01;
                }
            });
            
            renderer.render(scene, camera);
        }
        
        animate();

        // Handle window resize
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Helper function to create planets
    function createPlanet(scene, size, color, x, y, z, rotationSpeed) {
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: color,
            specular: 0x111111,
            shininess: 30
        });
        const planet = new THREE.Mesh(geometry, material);
        planet.position.set(x, y, z);
        planet.userData = { isPlanet: true, rotationSpeed: rotationSpeed };
        scene.add(planet);
        
        // Add ring for some planets
        if (Math.random() > 0.5) {
            const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 1.5, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xaaaaaa,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.set(x, y, z);
            scene.add(ring);
        }
    }
});

// Add twinkle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0% { opacity: 0.2; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);
