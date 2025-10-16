const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");

// State variables
let eventCalled = false;

// Arrays to store circles, their masses, velocities, and acceleration
let circleObg = [];
let random_mass_arr = [];
let dirCircleArr = [];
let C_circleArr = [];

let amount = 0;
let actualspeed = 1;
const i_cir = 15; // multiplier for gravitational influence radius
let G = 0.5; 

let circleNames = [];

// Function to handle gravitational physics between circles
function addphysics() {
    for (let i = 0; i < circleObg.length; i++) {
        for (let j = circleObg.length - 1; j >= 0; j--) {
            if (i === j) continue;

            let dx = circleObg[i].x - circleObg[j].x;
            let dy = circleObg[i].y - circleObg[j].y;
            let hypo = Math.sqrt(dx * dx + dy * dy);

            if (hypo < 0.0001) continue; // avoid zero division

            c.beginPath();
            c.moveTo(circleObg[i].x, circleObg[i].y);
            c.lineTo(circleObg[j].x, circleObg[j].y);
            c.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            c.stroke()

            let force = (G * random_mass_arr[i] * random_mass_arr[j]) / (hypo * hypo);
            let ax = (dx / hypo) * force / random_mass_arr[j];
            let ay = (dy / hypo) * force / random_mass_arr[j];

            dirCircleArr[i].dx -= ax;
            dirCircleArr[i].dy -= ay;
            dirCircleArr[j].dx += ax;
            dirCircleArr[j].dy += ay;

            dirCircleArr[i].dx *= 0.999;
            dirCircleArr[i].dy *= 0.999;

            let collisionDistance = random_mass_arr[i] + random_mass_arr[j];
            if (hypo <= collisionDistance) {
                random_mass_arr[i] += random_mass_arr[j];
                circleObg.splice(j, 1);
                random_mass_arr.splice(j, 1);
                dirCircleArr.splice(j, 1);
                C_circleArr.splice(j, 1);
                circleNames.splice(j, 1);
            }
        }
    }
}

const planetColors = [
    {
        name: 'Earth',
        colors: ['#dff9ff', '#4cc9f0', '#2d6a4f', '#081c15']
    },
    {
        name: 'Lava',
        colors: ['#fff2cc', '#ff7518', '#cc3300', '#330000']
    },
    {
        name: 'GasGiant',
        colors: ['#fefae0', '#e9c46a', '#b56576', '#3d2b1f']
    },
    {
        name: 'Ice',
        colors: ['#f0faff', '#b5e5ff', '#3399cc', '#001a33']
    },
    {
        name: 'Desert',
        colors: ['#fff2cc', '#e6b566', '#a36f2d', '#2e1f0f']
    },
];

// Function to draw circles and their gravitational influence
function draw() {
    for (let i = 0; i < circleObg.length; i++) {
        // Create radial gradient (for shading)
        const gradient = c.createRadialGradient(
            circleObg[i].x,
            circleObg[i].y,
            random_mass_arr[i] * 0.1,
            circleObg[i].x,
            circleObg[i].y,
            random_mass_arr[i]
        );

        // Pick a planet by index or name
        const selected = planetColors[C_circleArr[i]].colors;

        gradient.addColorStop(0, selected[0]);
        gradient.addColorStop(0.25, selected[1]);
        gradient.addColorStop(0.7, selected[2]);
        gradient.addColorStop(1, selected[3]);

        // Draw the sphere
        c.beginPath();
        c.arc(circleObg[i].x, circleObg[i].y, random_mass_arr[i], 0, Math.PI * 2);
        c.fillStyle = gradient;
        c.fill();
        c.closePath();

        // Draw the atmosphere / ring
        c.beginPath();
        c.arc(circleObg[i].x, circleObg[i].y, random_mass_arr[i] * 1.2, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        c.lineWidth = 2;
        c.stroke();

        // update position
        circleObg[i].x += dirCircleArr[i].dx;
        circleObg[i].y += dirCircleArr[i].dy;

        // Draw name above the circle
        c.fillStyle = 'rgba(255, 255, 255, 0.2)';
        c.font = `${Math.max(12, random_mass_arr[i] / 2)}px monospace`;
        c.textAlign = 'center';
        c.fillText(circleNames[i], circleObg[i].x, circleObg[i].y - random_mass_arr[i] - 20);

        // boundary collisions: bounce off edges
        if (circleObg[i].x - random_mass_arr[i] <= 0) dirCircleArr[i].dx = Math.abs(dirCircleArr[i].dx);
        if (circleObg[i].x + random_mass_arr[i]>= window.innerWidth) dirCircleArr[i].dx = -dirCircleArr[i].dx;
        if (circleObg[i].y - random_mass_arr[i]<= 0) dirCircleArr[i].dy = Math.abs(dirCircleArr[i].dy);
        if (circleObg[i].y + random_mass_arr[i] >= window.innerHeight) dirCircleArr[i].dy = -dirCircleArr[i].dy;
    }
}

// Mouse click event to create a new circle
canvas.addEventListener('click', (event) => {
    create(event)
})

function create(event) {
    let randomP = Math.floor(Math.random() * planetColors.length);
    let randomname = Math.floor(Math.random() * 5000);

    C_circleArr.push(randomP);
    circleNames.push("planet_" + randomname);

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const random_mass = Math.max(5, Math.floor(Math.random() * 20));

    let dx = 0;
    let dy = 0;

    circleObg.push({ x: mouseX, y: mouseY });
    dirCircleArr.push({ dx: dx, dy: dy });
    random_mass_arr.push(random_mass);

    eventCalled = true;
}

// Main animation loop
gameloop = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (eventCalled) {
        addphysics();
        draw();
    }

    requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);

// Customization panel functionality
const customizeBtn = document.querySelector('.customize-btn');
const customizationPanel = document.querySelector('.customization-panel');
const closeBtn = document.querySelector('.close-btn');
const overlay = document.querySelector('.overlay');
const gravitySlider = document.getElementById('gravity-slider');
const gravityValue = document.getElementById('gravity-value');

// Open panel
customizeBtn.addEventListener('click', () => {
    customizationPanel.classList.add('active');
    overlay.classList.add('active');
});

// Close panel
closeBtn.addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

function closePanel() {
    customizationPanel.classList.remove('active');
    overlay.classList.remove('active');
}

// Update G value when slider changes
gravitySlider.addEventListener('input', () => {
    G = parseFloat(gravitySlider.value);
    gravityValue.textContent = G.toFixed(1);
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});