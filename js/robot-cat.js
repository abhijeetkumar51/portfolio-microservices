// js/robot-cat.js

class RobotCat {
    constructor(containerId) {
        this.container = document.getElementById(containerId);

        // THREE.js basic setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, 220 / 260, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.clock = new THREE.Clock();

        // Cat state
        this.cat = null;
        this.head = null;
        this.eyes = [];
        this.baseCatY = -0.2;   // thoda neeche, taaki head cut na ho

        // Canvas size for movement
        this.canvasWidth = 220;
        this.canvasHeight = 260;

        // Start position – bottom right
        this.screenPos = {
            x: window.innerWidth - this.canvasWidth - 20,
            y: window.innerHeight - this.canvasHeight - 20
        };
        this.targetScreenPos = { ...this.screenPos };

        // Behaviour
        this.isWalking = true;
        this.walkSpeed = 220;      // default speed
        this.mode = "wander";      // "wander" | "follow"
        this.sleeping = false;
        this.cursorPos = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
        this.lastInteraction = performance.now();

        // Blink
        this.isBlinking = false;
        this.blinkProgress = 0;

        // 🔊 Simple sound (tum isko tweak kar sakta hai)
        this.meowAudio = new Audio("https://actions.google.com/sounds/v1/animals/cat_meow.ogg");
        this.meowAudio.preload = "auto";
        this.meowAudio.volume = 1.0;

        // 🔥 AI Mood system
        this.mood = "curious";           // "curious" | "chill" | "hyper"
        this.moodTimer = 0;              // seconds since last mood change
        this.moodChangeInterval = 12;    // 12 sec ke baad mood change try

        this.init();
    }

    updateCanvasPosition() {
        const canvas = this.renderer.domElement;
        canvas.style.left = this.screenPos.x + "px";
        canvas.style.top = this.screenPos.y + "px";
    }

    init() {
        // Renderer
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        const canvas = this.renderer.domElement;
        canvas.style.position = "fixed";
        canvas.style.zIndex = "9999";
        canvas.style.cursor = "pointer";
        canvas.style.borderRadius = "0";
        canvas.style.boxShadow = "none";
        canvas.style.background = "transparent";

        this.updateCanvasPosition();

        // Old container card ko hide karo (sirf canvas use kar rahe hain)
        if (this.container) {
            this.container.style.display = "none";
        }

        document.body.appendChild(canvas);

        // Camera – thoda peeche
        this.camera.position.set(0, 1.0, 5.2);
        this.camera.lookAt(0, 0.8, 0);

        // Lights
        const amb = new THREE.AmbientLight(0xffffff, 0.9);
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(2, 4, 3);
        this.scene.add(amb);
        this.scene.add(dir);

        // Model
        this.createCatModel();

        // Events
        this.setupEventListeners();

        // Start loop
        this.animate();

        window.addEventListener("resize", this.onWindowResize.bind(this));
        this.setRandomTarget();

        // Start with curious mood
        this.changeMood("curious");
    }

    createCatModel() {
        const scale = 2.9;

        this.cat = new THREE.Group();
        this.cat.scale.set(scale, scale, scale);
        this.cat.position.y = this.baseCatY;

        const bodyMat = new THREE.MeshPhongMaterial({
            color: 0x4e8cff,
            shininess: 80,
            emissive: 0x2940ff,
            emissiveIntensity: 0.4
        });

        const accentMat = new THREE.MeshPhongMaterial({
            color: 0xdfe6ff,
            shininess: 60
        });

        const eyeMat = new THREE.MeshPhongMaterial({
            color: 0x00ffea,
            emissive: 0x00a6ff,
            emissiveIntensity: 0.8
        });

        // Body
        const bodyGeom = new THREE.SphereGeometry(0.5, 32, 32);
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.set(0, 0.5, 0);
        this.cat.add(body);

        // Head
        const headGeom = new THREE.SphereGeometry(0.35, 32, 32);
        this.head = new THREE.Mesh(headGeom, bodyMat);
        this.head.position.set(0, 0.95, 0.15);
        this.head.name = "head";
        this.cat.add(this.head);

        // Ears
        const earGeom = new THREE.ConeGeometry(0.14, 0.3, 10);
        const leftEar = new THREE.Mesh(earGeom, accentMat);
        leftEar.position.set(-0.26, 1.25, -0.05);
        leftEar.rotation.x = -Math.PI / 3;
        this.cat.add(leftEar);

        const rightEar = leftEar.clone();
        rightEar.position.x = 0.26;
        this.cat.add(rightEar);

        // Eyes
        const eyeGeom = new THREE.SphereGeometry(0.09, 16, 16);
        const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(-0.14, 1.0, 0.45);
        this.cat.add(leftEye);

        const rightEye = leftEye.clone();
        rightEye.position.x = 0.14;
        this.cat.add(rightEye);
        this.eyes = [leftEye, rightEye];

        // Nose
        const noseGeom = new THREE.ConeGeometry(0.05, 0.12, 8);
        const noseMat = new THREE.MeshPhongMaterial({
            color: 0xff6fb8,
            emissive: 0xff2d8c,
            emissiveIntensity: 0.4
        });
        const nose = new THREE.Mesh(noseGeom, noseMat);
        nose.position.set(0, 0.9, 0.55);
        nose.rotation.x = Math.PI;
        this.cat.add(nose);

        // Tail
        const tailGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12);
        const tail = new THREE.Mesh(tailGeom, bodyMat);
        tail.position.set(0, 0.75, -0.45);
        tail.rotation.x = -Math.PI / 2.5;
        tail.name = "tail";
        this.cat.add(tail);

        // Legs
        const legGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.45, 12);
        const legPos = [
            { x: -0.28, y: 0.15, z: 0.2 },
            { x: 0.28, y: 0.15, z: 0.2 },
            { x: -0.28, y: 0.15, z: -0.05 },
            { x: 0.28, y: 0.15, z: -0.05 }
        ];
        legPos.forEach(p => {
            const leg = new THREE.Mesh(legGeom, accentMat);
            leg.position.set(p.x, p.y, p.z);
            this.cat.add(leg);
        });

        // Arms / hands
        const armGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 12);
        const leftArm = new THREE.Mesh(armGeom, accentMat);
        leftArm.position.set(-0.42, 0.55, 0.15);
        leftArm.rotation.z = Math.PI / 2.2;
        this.cat.add(leftArm);

        const rightArm = leftArm.clone();
        rightArm.position.x = 0.42;
        this.cat.add(rightArm);

        // Front-facing
        this.cat.rotation.y = 0;

        this.scene.add(this.cat);
    }

    setupEventListeners() {
        // Cat click
        this.renderer.domElement.addEventListener("click", () => {
            this.lastInteraction = performance.now();
            this.wakeUp();
            this.onClick();
        });

        // Cursor follow
        document.addEventListener("mousemove", (e) => {
            this.cursorPos.x = e.clientX;
            this.cursorPos.y = e.clientY;
            this.lastInteraction = performance.now();
            if (!this.sleeping && this.mood !== "chill") {
                // chill mood me itna aggressive follow nahi
                this.mode = "follow";
            }
        });

        window.addEventListener("resize", () => this.onWindowResize());
    }

    // 🔥 Mood change logic
    changeMood(newMood = null) {
        const moods = ["curious", "chill", "hyper"];

        if (!newMood) {
            // random different mood
            const others = moods.filter(m => m !== this.mood);
            newMood = others[Math.floor(Math.random() * others.length)];
        }

        this.mood = newMood;
        this.moodTimer = 0;

        switch (this.mood) {
            case "curious":
                this.walkSpeed = 260;
                this.mode = "follow";
                console.log("😺 Mood: CURIOUS");
                break;
            case "chill":
                this.walkSpeed = 140;
                this.mode = "wander";
                console.log("😴 Mood: CHILL");
                break;
            case "hyper":
                this.walkSpeed = 320;
                this.mode = "wander";
                console.log("🤪 Mood: HYPER");
                break;
        }
    }

    // Flag to prevent multiple rapid jumps
    isJumping = false;

    async playMeowSound() {
        try {
            // Reset and play sound
            this.meowAudio.currentTime = 0;
            await this.meowAudio.play();
            console.log("🔊 Meow played");
        } catch (err) {
            console.warn("🔇 Sound error:", err);
            // If blocked by autoplay policy, try again after user interaction
            if (err.name === 'NotAllowedError') {
                const playPromise = this.meowAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.warn("🔇 Still blocked:", e));
                }
            }
        }
    }

    onClick() {
        console.log("Cat clicked �");

        // Play sound
        this.playMeowSound();

        // Prevent rapid double-tap jumps
        if (this.isJumping) return;
        this.isJumping = true;

        // Auto-reset jump flag after animation
        setTimeout(() => {
            this.isJumping = false;
        }, this.mood === "hyper" ? 300 : 400);

        // Click par mood bhi kabhi-kabhi change ho
        if (Math.random() < 0.6) {
            this.changeMood();
        }

        // Jump
        const startY = this.baseCatY;
        const jumpHeight = this.mood === "hyper" ? 0.55 : 0.35;
        const duration = this.mood === "hyper" ? 300 : 400;
        const startTime = performance.now();

        const jump = () => {
            const t = (performance.now() - startTime) / duration;
            if (t >= 1) {
                this.baseCatY = startY;
                this.cat.position.y = this.baseCatY;
                return;
            }
            const p = t < 0.5 ? 2 * t : 2 * (1 - t);
            this.baseCatY = startY + jumpHeight * Math.sin(p * Math.PI);
            this.cat.position.y = this.baseCatY;
            requestAnimationFrame(jump);
        };
        jump();

        // Random glow
        this.cat.traverse(child => {
            if (child.material && child.material.emissive) {
                const c = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
                child.material.emissive.copy(c);
            }
        });

        this.setRandomTarget();
    }

    setRandomTarget() {
        if (!this.isWalking) return;
        const padding = 20;
        const maxX = window.innerWidth - this.canvasWidth - padding;
        const maxY = window.innerHeight - this.canvasHeight - padding;

        this.targetScreenPos = {
            x: padding + Math.random() * (maxX - padding),
            y: padding + Math.random() * (maxY - padding)
        };
    }

    enterSleep() {
        this.sleeping = true;
        this.isWalking = false;
        this.mode = "wander";
        if (this.head) this.head.rotation.x = 0.3;
        this.eyes.forEach(e => (e.scale.y = 0.15));
        console.log("💤 Cat sleeping");
    }

    wakeUp() {
        if (!this.sleeping) return;
        this.sleeping = false;
        this.isWalking = true;
        if (this.head) this.head.rotation.x = 0;
        this.eyes.forEach(e => (e.scale.y = 1));
        this.changeMood("curious");
        this.setRandomTarget();
        console.log("🌞 Cat woke up");
    }

    updateBlink(delta) {
        if (this.sleeping || this.eyes.length === 0) return;

        if (!this.isBlinking && Math.random() < delta * 0.35) {
            this.isBlinking = true;
            this.blinkProgress = 0;
        }

        if (this.isBlinking) {
            this.blinkProgress += delta * 6;
            const p = Math.min(this.blinkProgress, 1);
            let scaleY = p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2;
            scaleY = THREE.MathUtils.clamp(scaleY, 0.05, 1);
            this.eyes.forEach(e => (e.scale.y = scaleY));

            if (this.blinkProgress >= 1) {
                this.isBlinking = false;
                this.eyes.forEach(e => (e.scale.y = 1));
            }
        }
    }

    updateBehaviour(delta) {
        const now = performance.now();
        this.moodTimer += delta;

        // Sleep after 15s idle
        if (!this.sleeping && now - this.lastInteraction > 15000) {
            this.enterSleep();
        }

        // Agar follow mode me hai aur 3s se cursor move nahi hua
        if (!this.sleeping && this.mode === "follow") {
            if (now - this.lastInteraction > 3000) {
                this.mode = "wander";
                this.setRandomTarget();
            }
        }

        // Mood auto change every few seconds jab awake
        if (!this.sleeping && this.moodTimer > this.moodChangeInterval) {
            this.changeMood();
        }

        if (this.sleeping) return;

        if (this.mode === "follow") {
            const padding = 40;
            const tx = THREE.MathUtils.clamp(
                this.cursorPos.x - this.canvasWidth / 2,
                padding,
                window.innerWidth - this.canvasWidth - padding
            );
            const ty = THREE.MathUtils.clamp(
                this.cursorPos.y - this.canvasHeight / 2,
                padding,
                window.innerHeight - this.canvasHeight - padding
            );
            this.targetScreenPos.x = tx;
            this.targetScreenPos.y = ty;
        } else if (this.mode === "wander") {
            const dx = this.targetScreenPos.x - this.screenPos.x;
            const dy = this.targetScreenPos.y - this.screenPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 3) this.setRandomTarget();
        }
    }

    updateMovement(delta) {
        if (!this.isWalking || this.sleeping) return;

        const dx = this.targetScreenPos.x - this.screenPos.x;
        const dy = this.targetScreenPos.y - this.screenPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 1) return;

        const maxStep = this.walkSpeed * delta;
        const ratio = Math.min(maxStep / distance, 1);

        this.screenPos.x += dx * ratio;
        this.screenPos.y += dy * ratio;
        this.updateCanvasPosition();

        if (this.cat) {
            this.cat.rotation.y = 0;

            if (this.head) {
                const targetYaw = THREE.MathUtils.clamp(dx * 0.002, -0.25, 0.25);
                this.head.rotation.y = THREE.MathUtils.lerp(
                    this.head.rotation.y,
                    targetYaw,
                    0.15
                );
            }

            const tail = this.cat.getObjectByName("tail");
            if (tail) {
                const factor = this.mood === "hyper" ? 0.015 : 0.008;
                tail.rotation.z = Math.sin(performance.now() * factor) * 0.4;
            }

            this.cat.position.y = this.baseCatY;
        }
    }

    onWindowResize() {
        this.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();

        const padding = 20;
        const maxX = window.innerWidth - this.canvasWidth - padding;
        const maxY = window.innerHeight - this.canvasHeight - padding;

        this.screenPos.x = Math.min(Math.max(this.screenPos.x, padding), maxX);
        this.screenPos.y = Math.min(Math.max(this.screenPos.y, padding), maxY);
        this.updateCanvasPosition();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const delta = this.clock.getDelta();

        this.updateBehaviour(delta);
        this.updateMovement(delta);
        this.updateBlink(delta);

        this.renderer.render(this.scene, this.camera);
    }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    console.log("Robot Cat script loaded ✅");

    if (typeof THREE === "undefined") {
        console.error("THREE is not defined – three.js CDN missing?");
        return;
    }

    let container = document.getElementById("robot-cat-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "robot-cat-container";
        document.body.appendChild(container);
    }

    try {
        window.robotCat = new RobotCat("robot-cat-container");
        console.log("Robot Cat initialized 🐱🤖");
    } catch (e) {
        console.error("Robot Cat error:", e);
    }
});
