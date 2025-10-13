 // Background Animation Mode State
        let animationMode = 'flow'; // 'flow', 'gravity', or 'off'
        let particleAmount = 10;
        let animationSpeed = 1;

        // Theme Management
        const allThemes = [
            'theme-default',
            'purpled',
            'orangeCharcoal',
            'crimsonNight',
            'goldObsidian'
        ];

        let currentThemeIndex = 0;

        function changeTheme() {
            currentThemeIndex++;
            if (currentThemeIndex >= allThemes.length) currentThemeIndex = 0;
            document.documentElement.className = allThemes[currentThemeIndex];
            localStorage.setItem('currentTheme', currentThemeIndex);
        }

        // Project details data
        const projectData = {
            weather: {
                title: "Weather App",
                icon: "fas fa-cloud-sun",
                description: "A responsive weather application that displays current weather conditions and forecasts. This app uses the OpenWeather API to fetch real-time weather data and presents it in a clean, user-friendly interface. Features include location-based weather, 5-day forecast, and temperature unit conversion.",
                tech: ["HTML", "CSS", "JavaScript", "API Integration"],
                liveLink: "weatherapp.html",
                codeLink: "#"
            },
            tictactoe: {
                title: "Tic Tac Toe",
                icon: "fas fa-times-circle",
                description: "An interactive Tic Tac Toe game with smooth animations and responsive design. This implementation includes player vs player mode, win detection, and game statistics. The interface is designed to be intuitive and visually appealing with subtle animations for game actions.",
                tech: ["HTML", "CSS", "JavaScript", "DOM Manipulation"],
                liveLink: "tic-tac-index.html",
                codeLink: "#"
            },
            gravity: {
                title: "Gravity Simulator",
                icon: "fas fa-meteor",
                description: "A semi-realistic Earth gravity simulation that models gravitational forces between celestial bodies using Newton's law of universal gravitation. This simulation allows users to adjust parameters like mass, velocity, and gravitational constant to observe their effects on orbital mechanics. Features include real-time visualization of gravitational interactions, adjustable time scales, and collision detection. The simulation provides educational insights into planetary motion and space dynamics.",
                tech: ["HTML", "CSS", "JavaScript", "Canvas API", "Physics Simulation"],
                liveLink: "gravity-simu-index.html",
                codeLink: "#"
            },
            snake: {
                title: "Snake Game",
                icon: "fas fa-otter",
                description: "A classic Snake game implementation where players control a growing snake to collect food while avoiding collisions. Features include score tracking, increasing difficulty as the snake grows, and responsive controls. The game includes visual feedback for game events and a clean, modern interface.",
                tech: ["HTML", "CSS", "JavaScript", "Game Development"],
                liveLink: "Snake Game/snakegame.html",
                codeLink: "#"
            },
            flappybird: {
                title: "Flappy Bird",
                icon: "fas fa-dove",
                description: "A recreation of the popular Flappy Bird game where players tap to keep the bird flying through obstacles. This implementation includes score tracking, collision detection, and procedurally generated obstacles. The game features smooth animations and responsive controls suitable for all devices.",
                tech: ["HTML", "CSS", "JavaScript", "Game Development", "Collision Detection"],
                liveLink: "Flappy-Bird/flappybird.html",
                codeLink: "#"
            },
            spaceshooter: {
                title: "Space Shooter",
                icon: "fas fa-space-shuttle",
                description: "An engaging space shooter game where players control a spaceship to shoot enemies and dodge obstacles. Features include multiple enemy types, power-ups, score tracking, and increasing difficulty levels. The game includes particle effects for explosions and smooth ship movement.",
                tech: ["HTML", "CSS", "JavaScript", "Game Development", "Canvas Rendering"],
                liveLink: "spaceshooter/spaceshooter.html",
                codeLink: "#"
            }
        };

        // Project Popup Functions
        function showProjectDetails(projectId) {
            const project = projectData[projectId];
            if (!project) return;

            document.getElementById('popupTitle').textContent = project.title;

            // Set icon instead of image
            const popupIcon = document.getElementById('popupIcon');
            popupIcon.innerHTML = `<i class="${project.icon}"></i>`;

            document.getElementById('popupDescription').textContent = project.description;

            const techContainer = document.getElementById('popupTech');
            techContainer.innerHTML = '';
            project.tech.forEach(tech => {
                const techTag = document.createElement('span');
                techTag.className = 'tech-tag';
                techTag.textContent = tech;
                techContainer.appendChild(techTag);
            });

            document.getElementById('popupLiveLink').href = project.liveLink;
            document.getElementById('popupCodeLink').href = project.codeLink;

            document.getElementById('projectPopup').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeProjectDetails() {
            document.getElementById('projectPopup').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Customization Popup Functions
        function openCustomizationPopup() {
            document.getElementById('customizationPopup').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeCustomizationPopup() {
            document.getElementById('customizationPopup').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function updateCustomizationUI() {
            // Update mode selector
            const modeOptions = document.querySelectorAll('.mode-option');
            modeOptions.forEach(option => {
                option.classList.remove('active');
                if (option.dataset.mode === animationMode) {
                    option.classList.add('active');
                }
            });

            // Update sliders
            const particleAmountSlider = document.getElementById('particleAmountSlider');
            const particleAmountValue = document.getElementById('particleAmountValue');
            const animationSpeedSlider = document.getElementById('animationSpeedSlider');
            const animationSpeedValue = document.getElementById('animationSpeedValue');

            if (particleAmountSlider && particleAmountValue) {
                particleAmountSlider.value = particleAmount;
                particleAmountValue.textContent = particleAmount;
            }

            if (animationSpeedSlider && animationSpeedValue) {
                animationSpeedSlider.value = animationSpeed;
                animationSpeedValue.textContent = animationSpeed.toFixed(1) + 'x';
            }

            // Show/hide speed slider based on mode - with null checks
            const speedSliderContainer = document.getElementById('speedSliderContainer');
            if (speedSliderContainer) {
                if (animationMode === 'flow') {
                    speedSliderContainer.style.display = 'block';
                } else {
                    speedSliderContainer.style.display = 'none';
                }
            }

            // Show/hide particle amount slider based on mode - with null checks
            const sliderContainers = document.querySelectorAll('.slider-container');
            const particleAmountContainer = sliderContainers[0]; // First slider container
            if (particleAmountContainer) {
                if (animationMode !== 'off') {
                    particleAmountContainer.style.display = 'block';
                } else {
                    particleAmountContainer.style.display = 'none';
                }
            }
        }

        function applyCustomizationSettings() {
            // Get selected mode
            const activeMode = document.querySelector('.mode-option.active');
            if (activeMode) {
                animationMode = activeMode.dataset.mode;
            }

            // Get particle amount
            const particleAmountSlider = document.getElementById('particleAmountSlider');
            if (particleAmountSlider) {
                particleAmount = parseInt(particleAmountSlider.value);
            }

            // Get animation speed
            const animationSpeedSlider = document.getElementById('animationSpeedSlider');
            if (animationSpeedSlider) {
                animationSpeed = parseFloat(animationSpeedSlider.value);
            }

            // Update animation
            clearParticles();
            maxLimit = 0;

            // Close popup
            closeCustomizationPopup();
        }

        function resetCustomizationSettings() {
            // Reset to default values
            animationMode = 'flow';
            particleAmount = 10;
            animationSpeed = 1;

            // Update UI
            updateCustomizationUI();

            // Apply settings
            applyCustomizationSettings();
        }

        // Clear all particles
        function clearParticles() {
            const bg = document.querySelector(".fixed-bg");
            if (!bg) return;

            const particles = document.querySelectorAll('.particles');
            particles.forEach(particle => {
                if (particle.parentNode === bg) {
                    bg.removeChild(particle);
                }
            });

            // Reset particle arrays
            allp = [];
            allpPosition = [];
            randomDir = [];
            allvelo = [];
            dirval = [];
            maxLimit = 0;
        }

        // Initialize everything when DOM is loaded
        document.addEventListener('DOMContentLoaded', function () {
            // Typed.js initialization
            const typedElement = document.querySelector('.text');
            if (typedElement) {
                const typed = new Typed('.text', {
                    strings: ["Frontend Developer", "Creative Coder", "Web Developer"],
                    typeSpeed: 100,
                    backSpeed: 100,
                    backDelay: 1000,
                    loop: true
                });
            }

            // Mobile menu functionality
            const menuToggle = document.getElementById('menuToggle');
            const mobileNav = document.getElementById('mobileNav');
            const closeMenu = document.getElementById('closeMenu');
            const overlay = document.getElementById('overlay');

            function openMobileMenu() {
                if (mobileNav) mobileNav.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeMobileMenu() {
                if (mobileNav) mobileNav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            if (menuToggle) {
                menuToggle.addEventListener('click', openMobileMenu);
            }
            if (closeMenu) {
                closeMenu.addEventListener('click', closeMobileMenu);
            }
            if (overlay) {
                overlay.addEventListener('click', closeMobileMenu);
            }

            const mobileLinks = document.querySelectorAll('.mobile-nav a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });

            // Header scroll effect
            window.addEventListener('scroll', function () {
                const header = document.querySelector('header');
                if (header) {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
                animateOnScroll();
            });

            // Theme initialization
            const savedTheme = localStorage.getItem('currentTheme');
            if (savedTheme !== null) {
                currentThemeIndex = parseInt(savedTheme, 10);
                document.documentElement.className = allThemes[currentThemeIndex];
            } else {
                document.documentElement.className = allThemes[0];
                currentThemeIndex = 0;
            }

            // Theme toggle buttons
            const moreThemeToggle = document.getElementById('moreThemeToggle');
            if (moreThemeToggle) {
                moreThemeToggle.addEventListener('click', changeTheme);
            }

            const mobileThemeToggle = document.getElementById('mobileThemeToggle');
            if (mobileThemeToggle) {
                mobileThemeToggle.addEventListener('click', function () {
                    changeTheme();
                    closeMobileMenu();
                });
            }

            // Customization buttons
            const customizeToggle = document.getElementById('customizeToggle');
            if (customizeToggle) {
                customizeToggle.addEventListener('click', openCustomizationPopup);
            }

            const mobileCustomizeToggle = document.getElementById('mobileCustomizeToggle');
            if (mobileCustomizeToggle) {
                mobileCustomizeToggle.addEventListener('click', function () {
                    openCustomizationPopup();
                    closeMobileMenu();
                });
            }

            // Customization popup events
            const customizationClose = document.getElementById('customizationClose');
            if (customizationClose) {
                customizationClose.addEventListener('click', closeCustomizationPopup);
            }

            const applySettings = document.getElementById('applySettings');
            if (applySettings) {
                applySettings.addEventListener('click', applyCustomizationSettings);
            }

            const resetSettings = document.getElementById('resetSettings');
            if (resetSettings) {
                resetSettings.addEventListener('click', resetCustomizationSettings);
            }

            // Mode selector
            document.querySelectorAll('.mode-option').forEach(option => {
                option.addEventListener('click', function () {
                    document.querySelectorAll('.mode-option').forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');


                    const selectedMode = this.dataset.mode;
                    const speedSliderContainer = document.getElementById('speedSliderContainer');
                    const sliderContainers = document.querySelectorAll('.slider-container');
                    const particleAmountContainer = sliderContainers[0];

                    if (speedSliderContainer) {
                        if (selectedMode === 'flow') {
                            speedSliderContainer.style.display = 'block';
                        } else {
                            speedSliderContainer.style.display = 'none';
                        }
                    }

                    if (particleAmountContainer) {
                        if (selectedMode !== 'off') {
                            particleAmountContainer.style.display = 'block';
                        } else {
                            particleAmountContainer.style.display = 'none';
                        }
                    }
                });
            });

            // Slider updates
            const particleAmountSlider = document.getElementById('particleAmountSlider');
            if (particleAmountSlider) {
                particleAmountSlider.addEventListener('input', function () {
                    const particleAmountValue = document.getElementById('particleAmountValue');
                    if (particleAmountValue) {
                        particleAmountValue.textContent = this.value;
                    }
                });
            }

            const animationSpeedSlider = document.getElementById('animationSpeedSlider');
            if (animationSpeedSlider) {
                animationSpeedSlider.addEventListener('input', function () {
                    const animationSpeedValue = document.getElementById('animationSpeedValue');
                    if (animationSpeedValue) {
                        animationSpeedValue.textContent = parseFloat(this.value).toFixed(1) + 'x';
                    }
                });
            }

            // Initialize skill bars with their values
            document.querySelectorAll('.skill-progress').forEach(progress => {
                const width = progress.getAttribute('data-width');
                progress.style.width = width + '%';
            });

            // Project detail buttons
            document.querySelectorAll('.project-btn[data-project]').forEach(button => {
                button.addEventListener('click', function () {
                    const projectId = this.getAttribute('data-project');
                    showProjectDetails(projectId);
                });
            });

            // Popup close button
            const popupClose = document.getElementById('popupClose');
            if (popupClose) {
                popupClose.addEventListener('click', closeProjectDetails);
            }

            // Contact form submission
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    alert('Thank you for your message! I will get back to you soon.');
                    this.reset();
                });
            }

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Fetch GitHub data
            const exp = document.querySelector("#exp");
            const repo = document.querySelector("#repo");
            const proj = document.querySelector("#lan");

            if (exp && repo && proj) {
                fetch("https://api.github.com/users/TheRetrox")
                    .then(res => res.json())
                    .then(data => {
                        const createdDate = new Date(data.created_at);
                        const today = new Date();
                        const ageInYears = (today - createdDate) / (1000 * 60 * 60 * 24 * 365);

                        exp.innerText = ageInYears.toFixed(1);
                        repo.innerText = data.public_repos;
                        proj.innerText = 27;
                    })
                    .catch(err => {
                        console.error("Error:", err);
                        // Set default values if API call fails
                        exp.innerText = "2";
                        repo.innerText = "15";
                        proj.innerText = "27";
                    });
            }

            // Initialize customization UI
            updateCustomizationUI();

            // Initial animation trigger
            animateOnScroll();
        });

        // Profile image change function
        function changeImage(url) {
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.style.backgroundImage = `url('${url}')`;
            }
        }

        // Scroll animation function
        function animateOnScroll() {
            const elementsToAnimate = document.querySelectorAll(
                '.section-title h1, .about-image, .about-text, .skill-card, .project-card, .skill-item, .contact-form, .form-group, .sub-btn, .contact-info'
            );

            elementsToAnimate.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (elementTop < windowHeight - 100) {
                    element.classList.add('animate');
                }
            });
        }

        // Background particles animation
        const bg = document.querySelector(".fixed-bg");

        let allp = [];
        let allpPosition = [];
        let randomDir = [];
        let maxLimit = 0;

        // Gravity animation variables
        let allvelo = [];
        let g = 0.1;
        let dirval = [];

        function gameloop() {
            if (animationMode === 'off') {
                // Don't create or update particles
                requestAnimationFrame(gameloop);
                return;
            }

            if (animationMode === 'flow') {
                if (maxLimit < particleAmount) {
                    createP();
                    maxLimit++;
                }
                updateAnimation();
            } else if (animationMode === 'gravity') {
                if (maxLimit < particleAmount) {
                    createPgravity();
                    maxLimit++;
                }
                applygravity();
            }

            requestAnimationFrame(gameloop);
        }

        function updateAnimation() {
            for (let i = 0; i < allp.length; i++) {
                let pos = allpPosition[i];
                let baseDir = randomDir[i];

                // Apply speed multiplier here 
                pos.x += baseDir.dx * animationSpeed;
                pos.y += baseDir.dy * animationSpeed;

                // Bounce off edges
                if (pos.x <= 0 || pos.x >= bg.clientWidth) baseDir.dx *= -1;
                if (pos.y <= 0 || pos.y >= bg.clientHeight) baseDir.dy *= -1;

                allp[i].style.left = pos.x + "px";
                allp[i].style.top = pos.y + "px";
            }
        }

        function createP() {
            if (!bg) return;

            let x = Math.random() * bg.clientWidth;
            let y = Math.random() * bg.clientHeight;
            let w = Math.random() * 5 + 2;

            let particle = document.createElement("div");
            particle.classList.add('particles');
            particle.style.width = w + 'px';
            particle.style.height = w + 'px';
            bg.appendChild(particle);

            allp.push(particle);
            allpPosition.push({ x: x, y: y });

            // Base speed (no speedControl yet)
            let baseSpeedX = (Math.random() * 1.5 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
            let baseSpeedY = (Math.random() * 1.5 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
            randomDir.push({ dx: baseSpeedX, dy: baseSpeedY });
        }

        function createPgravity() {
            if (!bg) return;

            let x = Math.random() * bg.clientWidth;
            let y = Math.random() * bg.clientHeight;
            let w = Math.random() * 10 + 2;
            let particle = document.createElement("div");
            particle.classList.add('particles');
            particle.style.width = w + 'px';
            particle.style.height = w + 'px';
            bg.appendChild(particle);
            allp.push(particle);
            allpPosition.push({ x: x, y: y });
            allvelo.push(0.1);

            let dirluck = Math.floor(Math.random() * 2);
            if (dirluck == 1) {
                dirval.push(-5);
            } else {
                dirval.push(5);
            }
        }

        function applygravity() {
            for (let i = 0; i < allvelo.length; i++) {
                allpPosition[i].y += allvelo[i];
                allpPosition[i].x += dirval[i];
                allp[i].style.top = allpPosition[i].y + "px";
                allp[i].style.left = allpPosition[i].x + "px";

                // Collision
                if (allpPosition[i].x <= 0) {
                    dirval[i] = Math.abs(dirval[i]);
                }
                if (allpPosition[i].x >= bg.clientWidth) {
                    dirval[i] = -dirval[i];
                }

                if (allpPosition[i].y >= bg.clientHeight) {
                    allvelo[i] = -allvelo[i];
                } else {
                    allvelo[i] += g;
                }
            }
        }

        // Start the game loop if bg exists
        if (bg) {
            requestAnimationFrame(gameloop);
        }