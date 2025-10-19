// ============================
// 🌌 Gravity Simulation Canvas
// ============================

// Canvas setup
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");

// ============================
// ⚙️ Simulation Parameters
// ============================
let G = 0.5;                            // Gravitational constant
let FRAGMENTATION_THRESHOLD = 10;       // Velocity threshold for fragmentation
let line_size = 400;                    // Max distance for drawing connection lines
let obg_count = 5;                      // Minimum number of planets
const density = 0.009;                  // Mass density
let eventCalled = false;                // Start physics after at least one planet exists

// ============================
// 🪐 Simulation Data Arrays
// ============================
let circleObg = [];        // Planet positions
let random_mass_arr = [];  // Masses
let random_size_arr = [];  // Sizes
let dirCircleArr = [];     // Velocities
let C_circleArr = [];      // Color schemes
let circleNames = [];      // Planet names



let f_circleObg = [];        // Fragments positions
let f_random_mass_arr = [];  // Masses
let f_random_size_arr = [];  // Sizes
let f_dirCircleArr = [];     // Velocities


// ============================
// 🎨 Color Themes for Planets
// ============================
const planetColors = [
    { name: 'Earth', colors: ['#dff9ff', '#4cc9f0', '#4a90e2', '#081c15'] },
    { name: 'Lava', colors: ['#fff2cc', '#ff7518', '#cc3300', '#330000'] },
    { name: 'GasGiant', colors: ['#fefae0', '#e9c46a', '#b56576', '#3d2b1f'] },
    { name: 'Desert', colors: ['#fff2cc', '#e6b566', '#a36f2d', '#2e1f0f'] },
    { name: 'Toxic', colors: ['#eaffd0', '#a3bffa', '#6c63ff', '#1a237e'] },
    { name: 'Shadow', colors: ['#e0e0e0', '#757575', '#212121', '#000000'] },
    { name: 'Neon', colors: ['#f0f0f0', '#00ffff', '#00bcd4', '#001f3f'] },
    { name: 'Crimson', colors: ['#ffebee', '#ef5350', '#c62828', '#4a0000'] },
    { name: 'Mystic', colors: ['#ede7f6', '#b39ddb', '#673ab7', '#311b92'] },
    { name: 'Aurora', colors: ['#e0f7fa', '#80deea', '#536dfe', '#1a237e'] },
    { name: 'Storm', colors: ['#f5f5f5', '#90a4ae', '#455a64', '#263238'] },
    { name: 'Ember', colors: ['#fff3e0', '#ffb74d', '#e65100', '#1a0000'] },
    { name: 'Void', colors: ['#f0f0f0', '#8888ff', '#000033', '#000000'] },
    { name: 'Amethyst', colors: ['#f3e5f5', '#ce93d8', '#8e24aa', '#4a0072'] },
    { name: 'Gold', colors: ['#fff8e1', '#ffd54f', '#ffb300', '#4e342e'] },
    { name: 'Obsidian', colors: ['#eceff1', '#90a4ae', '#263238', '#000000'] }
];

// ============================
// 🌠 Gravitational Physics
// ============================
function addphysics() {
    for (let i = 0; i < circleObg.length; i++) {
        for (let j = circleObg.length - 1; j >= 0; j--) {
            if (i === j) continue;

            const dx = circleObg[i].x - circleObg[j].x;
            const dy = circleObg[i].y - circleObg[j].y;
            const hypo = Math.sqrt(dx * dx + dy * dy);
            if (hypo < 0.00001) continue; // prevent division by zero

            // Draw connection line between planets based on distance
            const alpha = Math.max(0, 1 - hypo / line_size);
            c.beginPath();
            c.moveTo(circleObg[i].x, circleObg[i].y);
            c.lineTo(circleObg[j].x, circleObg[j].y);
            c.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
            c.stroke();

            // Gravitational force calculation
            const force = (G * random_mass_arr[i] * random_mass_arr[j]) / (hypo * hypo);
            const ax = (dx / hypo) * force / random_mass_arr[j];
            const ay = (dy / hypo) * force / random_mass_arr[j];
            const bx = (dx / hypo) * force / random_mass_arr[i];
            const by = (dy / hypo) * force / random_mass_arr[i];

            // Apply acceleration to velocities
            dirCircleArr[i].dx -= bx;
            dirCircleArr[i].dy -= by;
            dirCircleArr[j].dx += ax;
            dirCircleArr[j].dy += ay;

            // Apply slight drag for stability
            dirCircleArr[i].dx *= 0.999;
            dirCircleArr[i].dy *= 0.999;

            // Trigger reset if object becomes too large
            if (random_size_arr[i] >= 500) {
                clearSimulation();
            }

            // Collision handling
            const collisionDistance = random_size_arr[i] + random_size_arr[j];
            if (hypo <= collisionDistance) {
                const relVelX = dirCircleArr[i].dx - dirCircleArr[j].dx;
                const relVelY = dirCircleArr[i].dy - dirCircleArr[j].dy;
                const relativeSpeed = Math.sqrt(relVelX * relVelX + relVelY * relVelY);

                if (relativeSpeed > FRAGMENTATION_THRESHOLD) {
                    // Fragmentation — remove both planets

                    //create new smaller particles
                    let random = Math.max(10, Math.floor(Math.random() * 20));

                    let a = (random_mass_arr[i] + random_mass_arr[j]) / random;
                    const newVolume = Math.pow(random_size_arr[i], 3) + Math.pow(random_size_arr[j], 3);
                    let b = (Math.cbrt(newVolume)) / random;

                    for (let n = 0; n < random; n++) {
                        createNewObg(circleObg[i].x, circleObg[i].y, a, b);
                    }

                    removeObject(i, j);
                } else {
                    // Merge planets: mass + volume-based size
                    random_mass_arr[i] += random_mass_arr[j];
                    const newVolume = Math.pow(random_size_arr[i], 3) + Math.pow(random_size_arr[j], 3);
                    random_size_arr[i] = Math.cbrt(newVolume);
                    removeObject(j);
                }
                break;
            }
        }
    }
}
function fragmentUpdate() {
    for (let o = f_circleObg.length - 1; o >= 0; o--) {
        f_circleObg[o].x += f_dirCircleArr[o].dx;
        f_circleObg[o].y += f_dirCircleArr[o].dy;

        for (let l = f_circleObg.length - 1; l >= 0; l--) {
            const dx = f_circleObg[o].x - f_circleObg[l].x;
            const dy = f_circleObg[o].y - f_circleObg[l].y;
            const hypo = Math.sqrt(dx * dx + dy * dy);

            //
            const alpha = Math.max(0, 1 - hypo / 35);
            c.beginPath();
            c.moveTo(f_circleObg[o].x, f_circleObg[o].y);
            c.lineTo(f_circleObg[l].x, f_circleObg[l].y);
            c.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
            c.lineWidth = 0.5;
            c.stroke();

        }
        // Remove if off-screen
        if (f_circleObg[o].x < 0 || f_circleObg[o].x > window.innerWidth ||
            f_circleObg[o].y < 0 || f_circleObg[o].y > window.innerHeight ||
            f_random_size_arr[o] < 0.5) {
            clearFragments(o);
        }
    }
}


function clearFragments(idx) {
    f_circleObg.splice(idx, 1);
    f_dirCircleArr.splice(idx, 1);
    f_random_mass_arr.splice(idx, 1);
    f_random_size_arr.splice(idx, 1);
}

function drawFragments() {
    //Fragments 
    for (let t = 0; t < f_circleObg.length; t++) {
        c.beginPath();
        c.arc(f_circleObg[t].x, f_circleObg[t].y, f_random_size_arr[t], 0, Math.PI * 2);
        c.fillStyle = 'rgba(255, 255, 255, 0.92)';
        c.fill();
    }
}




function createNewObg(x, y, random_mass, random_size) {
    let actualspeed = 0.5;
    let randomSpeed = Math.floor(Math.random() * 10) + 1;

    // New outward explosion style
    let angle = Math.random() * Math.PI * 2; // random direction
    let speed = actualspeed + randomSpeed * 0.02; // slightly faster than original
    let dx = Math.cos(angle) * speed;
    let dy = Math.sin(angle) * speed;

    f_circleObg.push({ x: x, y: y });
    f_dirCircleArr.push({ dx: dx, dy: dy });
    f_random_mass_arr.push(random_mass);
    f_random_size_arr.push(random_size);

}

// ============================
// 🪐 Draw Planets on Canvas
// ============================
function draw() {
    for (let i = 0; i < circleObg.length; i++) {
        const gradient = c.createRadialGradient(
            circleObg[i].x,
            circleObg[i].y,
            random_size_arr[i] * 0.1,
            circleObg[i].x,
            circleObg[i].y,
            random_size_arr[i]
        );

        const colors = planetColors[C_circleArr[i]].colors;
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.25, colors[1]);
        gradient.addColorStop(0.7, colors[2]);
        gradient.addColorStop(1, colors[3]);

        // Planet body
        c.beginPath();
        c.arc(circleObg[i].x, circleObg[i].y, random_size_arr[i], 0, Math.PI * 2);
        c.fillStyle = gradient;
        c.fill();


        // Atmosphere glow
        c.beginPath();
        c.arc(circleObg[i].x, circleObg[i].y, random_size_arr[i] * 1.2, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        c.lineWidth = 2;
        c.stroke();

        // Move planets based on velocity
        circleObg[i].x += dirCircleArr[i].dx;
        circleObg[i].y += dirCircleArr[i].dy;

        // Label
        c.fillStyle = 'rgba(255, 255, 255, 1)';
        c.font = `${Math.max(12, random_size_arr[i] / 2)}px monospace`;
        c.textAlign = 'center';
        c.fillText(circleNames[i], circleObg[i].x, circleObg[i].y - random_size_arr[i] - 20);

        // Bounce off window edges
        if (circleObg[i].x - random_size_arr[i] <= 0) dirCircleArr[i].dx = Math.abs(dirCircleArr[i].dx);
        if (circleObg[i].x + random_size_arr[i] >= window.innerWidth) dirCircleArr[i].dx = -dirCircleArr[i].dx;
        if (circleObg[i].y - random_size_arr[i] <= 0) dirCircleArr[i].dy = Math.abs(dirCircleArr[i].dy);
        if (circleObg[i].y + random_size_arr[i] >= window.innerHeight) dirCircleArr[i].dy = -dirCircleArr[i].dy;
    }

}

// ============================
// 🧹 Utility Functions
// ============================

// Create new planet (click or auto)
function create(event, fromClick) {
    const randomP = Math.floor(Math.random() * planetColors.length);
    const randomname = Math.floor(Math.random() * 5000);

    const x = fromClick ? event.clientX : Math.random() * window.innerWidth - 20;
    const y = fromClick ? event.clientY : Math.random() * window.innerHeight - 20;

    const random_size = Math.max(5, Math.floor(Math.random() * 20));
    const random_mass = (4 / 3) * Math.PI * Math.pow(random_size, 3) * density;

    circleObg.push({ x: x, y: y });
    dirCircleArr.push({ dx: 0, dy: 0 });
    random_mass_arr.push(random_mass);
    random_size_arr.push(random_size);
    C_circleArr.push(randomP);
    circleNames.push("planet_" + randomname);

    eventCalled = true;
    updateObjectCount();
}

// Remove objects cleanly
function removeObject(index1, index2) {
    const indexes = index2 !== undefined ? [index1, index2] : [index1];
    indexes.sort((a, b) => b - a);
    for (const idx of indexes) {
        circleObg.splice(idx, 1);
        random_mass_arr.splice(idx, 1);
        random_size_arr.splice(idx, 1);
        dirCircleArr.splice(idx, 1);
        C_circleArr.splice(idx, 1);
        circleNames.splice(idx, 1);
    }
    updateObjectCount();
}

// Reset entire simulation
function clearSimulation() {
    circleObg = [];
    random_mass_arr = [];
    random_size_arr = [];
    dirCircleArr = [];
    C_circleArr = [];
    circleNames = [];
    eventCalled = false;

    f_circleObg = [];
    f_random_mass_arr = [];
    f_random_size_arr = [];
    f_dirCircleArr = [];
    updateObjectCount();
}

// Update UI object count
function updateObjectCount() {
    document.getElementById('object-count').textContent = circleObg.length;
}

// ============================
// 🖱️ Interaction & Controls
// ============================

// Click to create a new planet
canvas.addEventListener('click', (e) => create(e, true));

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ============================
// 🪄 Control Panel Elements
// ============================
const customizeBtn = document.querySelector('.customize-btn');
const customizationPanel = document.querySelector('.customization-panel');
const welcomePanel = document.querySelector('.welcome-panel');
const welcomeCloseBtn = document.getElementById('welcome-close-btn');
const welcomeStartBtn = document.getElementById('welcome-start-btn');
const customizationCloseBtn = document.getElementById('customization-close-btn');
const overlay = document.querySelector('.overlay');

const gConstSlider = document.getElementById('gravity-slider');
const fragSlider = document.getElementById('Fragmentaition');
const lineLenSlider = document.getElementById('Lines');
const objNumSlider = document.getElementById('Object_Number');

const gConstVal = document.getElementById('gravity-slider-value');
const fragVal = document.getElementById('Fragmentaition-value');
const lineLenVal = document.getElementById('Lines-value');
const objNumVal = document.getElementById('Object_Number-value');
const clearBtn = document.getElementById('clear-btn');

// Open customization panel
customizeBtn.addEventListener('click', () => {
    customizationPanel.classList.add('active');
    overlay.classList.add('active');
});

// Close welcome panel
welcomeCloseBtn.addEventListener('click', closeWelcome);
welcomeStartBtn.addEventListener('click', closeWelcome);
function closeWelcome() {
    welcomePanel.classList.remove('active');
    overlay.classList.remove('active');
}

// Close customization panel
customizationCloseBtn.addEventListener('click', closeCustomization);
overlay.addEventListener('click', closeCustomization);
function closeCustomization() {
    customizationPanel.classList.remove('active');
    overlay.classList.remove('active');
}

// Slider events
gConstSlider.addEventListener('input', () => {
    G = parseFloat(gConstSlider.value);
    gConstVal.textContent = G;
});
fragSlider.addEventListener('input', () => {
    FRAGMENTATION_THRESHOLD = parseFloat(fragSlider.value);
    fragVal.textContent = FRAGMENTATION_THRESHOLD;
});
lineLenSlider.addEventListener('input', () => {
    line_size = parseFloat(lineLenSlider.value);
    lineLenVal.textContent = line_size;
});
objNumSlider.addEventListener('input', () => {
    obg_count = parseFloat(objNumSlider.value);
    objNumVal.textContent = obg_count;
});

// Clear simulation button
clearBtn.addEventListener('click', () => {
    clearSimulation();
    closeCustomization();
});

// ============================= //
   // 🕹️ Main Animation Loop //
// ============================= //
function gameloop() {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (eventCalled) {
        addphysics();
        fragmentUpdate()
        draw();
        if (f_circleObg.length > 0) {
            drawFragments();
        }
    }
    // Auto spawn planets if below minimum
    if (circleObg.length < obg_count) {
        create(0, false);
    }
    requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);
updateObjectCount();
