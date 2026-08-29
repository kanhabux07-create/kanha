/* ============================================
   PROPOSAL WEBSITE — 3D & INTERACTIONS
   ============================================ */

// ---- Three.js 3D Background ----
let scene, camera, renderer, hearts = [], stars = [], mouseX = 0, mouseY = 0;

function init3D() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas'),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0a0f, 1);

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Point lights
  const pinkLight = new THREE.PointLight(0xe8779a, 2, 100);
  pinkLight.position.set(10, 10, 10);
  scene.add(pinkLight);

  const goldLight = new THREE.PointLight(0xffd700, 1.5, 80);
  goldLight.position.set(-10, -5, 15);
  scene.add(goldLight);

  // Create 3D Hearts
  createHearts();
  // Create Stars
  createStars();

  // Mouse move effect
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

function createHeartShape() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x, y + 0.5);
  shape.bezierCurveTo(x, y + 0.5, x - 0.5, y, x - 0.5, y);
  shape.bezierCurveTo(x - 0.5, y - 0.35, x, y - 0.6, x, y - 0.9);
  shape.bezierCurveTo(x, y - 0.6, x + 0.5, y - 0.35, x + 0.5, y);
  shape.bezierCurveTo(x + 0.5, y, x, y + 0.5, x, y + 0.5);
  return shape;
}

function createHearts() {
  const heartShape = createHeartShape();
  const extrudeSettings = {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.05,
    bevelSegments: 3
  };
  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

  for (let i = 0; i < 25; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(0.95 + Math.random() * 0.08, 0.7 + Math.random() * 0.3, 0.5 + Math.random() * 0.2),
      transparent: true,
      opacity: 0.4 + Math.random() * 0.4,
      shininess: 100,
    });

    const heart = new THREE.Mesh(geometry, material);
    const scale = 0.3 + Math.random() * 0.8;
    heart.scale.set(scale, scale, scale);
    heart.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30 - 10
    );
    heart.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.PI // Flip heart right-side up
    );
    heart.userData = {
      speedY: 0.002 + Math.random() * 0.005,
      speedRot: 0.003 + Math.random() * 0.008,
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: 0.5 + Math.random() * 1,
      floatAmplitude: 0.02 + Math.random() * 0.05
    };
    hearts.push(heart);
    scene.add(heart);
  }
}

function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1500;
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    sizes[i] = Math.random() * 2;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });

  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
  stars.push(starField);
}

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Animate hearts
  hearts.forEach((heart) => {
    const d = heart.userData;
    heart.rotation.y += d.speedRot;
    heart.rotation.x += d.speedRot * 0.5;
    heart.position.y += Math.sin(time * d.floatSpeed + d.floatOffset) * d.floatAmplitude;
  });

  // Animate stars
  stars.forEach((s) => {
    s.rotation.y += 0.0002;
    s.rotation.x += 0.0001;
  });

  // Camera follow mouse (subtle)
  camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
  camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}


// ---- Floating Petals ----
function createPetals() {
  const container = document.getElementById('petals-container');
  const petalEmojis = ['🌸', '🩷', '💗', '✨', '🌹', '💕'];

  for (let i = 0; i < 30; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.fontSize = (14 + Math.random() * 18) + 'px';
    petal.style.animationDuration = (8 + Math.random() * 12) + 's';
    petal.style.animationDelay = (Math.random() * 15) + 's';
    container.appendChild(petal);
  }
}


// ---- Scroll Animations (Intersection Observer) ----
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Ring box logic
        if (entry.target.closest('.scene-4')) {
          setTimeout(() => {
            document.getElementById('ringBoxLid').classList.add('open');
            setTimeout(() => {
              document.getElementById('ring3d').classList.add('show');
            }, 600);
          }, 800);
        }
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}


// ---- "No" Button Dodge ----
function setupNoButtonDodge() {
  const btnNo = document.getElementById('btnNo');
  let dodgeCount = 0;
  const messages = [
    "Nope! 😜",
    "Pakad ke dikha! 🏃",
    "Haha try again! 😂",
    "Itni jaldi? 🥺",
    "Ring dekh! 💍",
    "Say YES na! ❤️",
    "Please please! 😘",
    "Bhag bhag! 🏃‍♂️",
    "Not here! 😝",
    "Idhar bhi nahi! 🤭",
    "Catch me! 💨",
    "Still running! 🏃‍♀️",
    "YES bol do! 🥰",
    "Main nahi rukunga! 😜",
    "Bas YES daba do! 💖",
  ];

  function dodgeButton() {
    dodgeCount++;
    // Keep button within screen bounds with padding
    const btnWidth = btnNo.offsetWidth + 20;
    const btnHeight = btnNo.offsetHeight + 20;
    const maxX = window.innerWidth - btnWidth;
    const maxY = window.innerHeight - btnHeight;
    const x = Math.max(10, Math.random() * maxX);
    const y = Math.max(10, Math.random() * maxY);

    btnNo.style.position = 'fixed';
    btnNo.style.left = x + 'px';
    btnNo.style.top = y + 'px';
    btnNo.style.zIndex = '999';
    btnNo.textContent = messages[dodgeCount % messages.length];

    // Add a little shake animation
    btnNo.style.transform = 'scale(0.9) rotate(' + (Math.random() * 20 - 10) + 'deg)';
    setTimeout(() => {
      btnNo.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
  }

  // Desktop — mouse hover dodge
  btnNo.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    dodgeButton();
  });

  // Mobile — touch dodge (prevent click, just dodge)
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeButton();
  });

  // Also dodge on click as fallback
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dodgeButton();
  });
}


// ---- YES / Celebration ----
function triggerCelebration() {
  // Hide question section's buttons
  document.getElementById('answerButtons').style.display = 'none';
  document.getElementById('bigQuestion').style.display = 'none';

  // Show celebration
  const scene5 = document.getElementById('scene5');
  scene5.classList.remove('hidden');
  scene5.scrollIntoView({ behavior: 'smooth' });

  // Heart explosion
  createHeartExplosion();

  // Fireworks
  launchFireworks();

  // Add extra hearts to 3D scene
  addCelebrationHearts();
}

function createHeartExplosion() {
  const container = document.getElementById('heartExplosion');
  const heartEmojis = ['❤️', '💖', '💗', '💕', '💘', '💝', '💞', '💓', '🩷', '💍', '🎉', '🥂'];

  for (let i = 0; i < 80; i++) {
    const heart = document.createElement('div');
    heart.className = 'explosion-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.fontSize = (16 + Math.random() * 30) + 'px';

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 500;
    heart.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
    heart.style.setProperty('--ty', Math.sin(angle) * distance - 200 + 'px');
    heart.style.animationDelay = Math.random() * 0.5 + 's';

    container.appendChild(heart);
  }
}

function launchFireworks() {
  const colors = ['#ff6b9d', '#ffd700', '#ff4757', '#e8779a', '#7c3aed', '#06b6d4', '#10b981'];

  function burst(x, y) {
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 200;
      particle.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
      particle.style.setProperty('--fy', Math.sin(angle) * dist + 'px');

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1500);
    }
  }

  // Launch multiple bursts
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      burst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.6
      );
    }, i * 400);
  }

  // Keep launching periodically
  setInterval(() => {
    burst(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight * 0.5
    );
  }, 2000);
}

function addCelebrationHearts() {
  const heartShape = createHeartShape();
  const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05, bevelSegments: 3 };
  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

  for (let i = 0; i < 30; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.9, 0.9, 0.6),
      transparent: true,
      opacity: 0.5 + Math.random() * 0.4,
      shininess: 100,
    });

    const heart = new THREE.Mesh(geometry, material);
    const scale = 0.5 + Math.random() * 1.2;
    heart.scale.set(scale, scale, scale);
    heart.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20
    );
    heart.rotation.z = Math.PI;
    heart.userData = {
      speedY: 0.003 + Math.random() * 0.008,
      speedRot: 0.005 + Math.random() * 0.01,
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: 0.5 + Math.random() * 1.5,
      floatAmplitude: 0.03 + Math.random() * 0.06
    };
    hearts.push(heart);
    scene.add(heart);
  }
}


// ---- Music Toggle ----
function setupMusic() {
  const btn = document.getElementById('musicBtn');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      btn.textContent = '🎵';
    } else {
      audio.play().catch(() => {});
      btn.classList.add('playing');
      btn.textContent = '🔊';
    }
    playing = !playing;
  });
}


// ---- Preloader ----
function setupPreloader() {
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('openBtn');
  const preloader = document.getElementById('preloader');
  const mainContent = document.getElementById('main-content');

  openBtn.addEventListener('click', () => {
    envelope.classList.add('open');

    setTimeout(() => {
      preloader.classList.add('fade-out');
      mainContent.classList.remove('hidden');

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1000);
    }, 1200);

    // Try to start music
    const audio = document.getElementById('bgMusic');
    audio.play().then(() => {
      document.getElementById('musicBtn').classList.add('playing');
      document.getElementById('musicBtn').textContent = '🔊';
    }).catch(() => {});
  });
}


// ---- INITIALIZE EVERYTHING ----
document.addEventListener('DOMContentLoaded', () => {
  init3D();
  createPetals();
  setupPreloader();
  setupScrollAnimations();
  setupNoButtonDodge();
  setupMusic();

  // YES button
  document.getElementById('btnYes').addEventListener('click', triggerCelebration);
});
