// Interactive 3D Robot Component
class InteractiveRobot {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        // Add a class to the container for additional styling
        this.container.classList.add('robot-3d-container');

        // Default options
        this.options = {
            // Using the custom 3D character model
            modelPath: '3d-robot-test/models/robot.glb',
            position: { x: 0, y: -1, z: 0 },
            scale: 0.5,
            moveSpeed: 1.5,
            rotationSpeed: 0.02,
            autoRotate: false,
            hoverEffect: false,
            clickEffect: false,
            ...options
        };
        
        // Movement variables
        this.moveDirection = new THREE.Vector3();
        this.moveTarget = null;
        this.isMoving = false;
        this.moveStartTime = 0;
        this.moveDuration = 0;
        
        // Dragging variables
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.containerPosition = { x: 0, y: 0 };

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.targetRotation = 0;
        this.targetRotationX = 0;
        this.originalPosition = new THREE.Vector3();
        this.isHovered = false;

        this.init();
    }

    async init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.background = null; // Transparent background

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Add lights
        this.addLights();

        // Load model
        await this.loadModel();

        // Add event listeners
        this.addEventListeners();

        // Start animation loop
        this.animate();
    }

    addLights() {
        // Ambient light - slightly brighter for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        // Directional light - more focused on the robot
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(1, 1, 2);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Add a second directional light from the opposite side for better lighting
        const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
        backLight.position.set(-1, -1, -1);
        this.scene.add(backLight);

        // Point light for glow - more intense
        this.pointLight = new THREE.PointLight(0x00a8ff, 1.5, 15);
        this.pointLight.position.set(0, 1.5, 2);
        this.scene.add(this.pointLight);
        
        // Add a subtle blue ambient light for a futuristic glow
        const blueAmbient = new THREE.AmbientLight(0x00a8ff, 0.3);
        this.scene.add(blueAmbient);
    }

    async loadModel() {
        const loader = new THREE.GLTFLoader();
        
        try {
            // Show loading state
            this.showLoadingState();
            
            const gltf = await loader.loadAsync(this.options.modelPath);
            this.robot = gltf.scene;
            
            // Set initial position and scale
            this.robot.scale.set(this.options.scale, this.options.scale, this.options.scale);
            this.robot.position.set(0, -1, 0);
            
            // Start with a random rotation
            this.robot.rotation.y = Math.random() * Math.PI * 2;
            
            // Make sure the robot is visible and properly lit
            this.robot.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    // Make materials more metallic and shiny
                    if (node.material) {
                        if (Array.isArray(node.material)) {
                            node.material.forEach(mat => this.enhanceMaterial(mat));
                        } else {
                            this.enhanceMaterial(node.material);
                        }
                    }
                }
            });
            
            // Set position and scale with adjusted Y position
            const scale = this.options.scale * 0.8; // Slightly smaller
            this.robot.scale.set(scale, scale, scale);
            
            // Position the robot properly
            const position = { ...this.options.position };
            position.y = -0.5; // Lower the position
            this.robot.position.copy(position);
            this.originalPosition.copy(this.robot.position);
            
            // Add glow effect to specific parts
            this.robot.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // Add emissive material for glow to specific parts
                    if (node.material) {
                        // Make eyes and accents glow blue
                        if (node.name.includes('Eye') || node.name.includes('Screen') || node.name.includes('Light')) {
                            node.material.emissive = new THREE.Color(0x00a8ff);
                            node.material.emissiveIntensity = 0.8;
                            node.material.toneMapped = false; // Make it brighter
                        } else {
                            node.material.emissive = new THREE.Color(0x000000);
                        }
                        
                        // Make metal parts more reflective
                        if (node.name.includes('Metal') || node.name.includes('Body')) {
                            node.material.metalness = 0.9;
                            node.material.roughness = 0.2;
                        }
                    }
                }
            });
            
            // Animation mixer for the model - use a simple rotation animation if no animations are available
            this.mixer = new THREE.AnimationMixer(this.robot);
            
            if (gltf.animations && gltf.animations.length) {
                this.actions = [];
                gltf.animations.forEach((clip) => {
                    this.actions.push(this.mixer.clipAction(clip));
                });
                if (this.actions[0]) this.actions[0].play();
            } else {
                // Create a simple rotation animation if no animations are available
                const clock = new THREE.Clock();
                const rotationSpeed = 0.5;
                
                const animateRotation = () => {
                    if (this.robot) {
                        this.robot.rotation.y += 0.005 * rotationSpeed;
                    }
                    requestAnimationFrame(animateRotation);
                };
                animateRotation();
            }
            
            this.scene.add(this.robot);
            
        } catch (error) {
            console.error('Error loading 3D model:', error);
            this.showErrorState();
        }
    }

    addEventListeners() {
        // Make the robot draggable
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    onMouseDown(event) {
        if (event.button !== 0) return; // Only left mouse button
        this.isDragging = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this.container.style.cursor = 'grabbing';
        event.preventDefault();
    }
    
    onMouseMove(event) {
        if (!this.isDragging) return;
        
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;
        
        // Update container position
        const containerRect = this.container.getBoundingClientRect();
        const newX = containerRect.left + deltaX;
        const newY = containerRect.top + deltaY;
        
        // Apply new position
        this.container.style.left = `${newX}px`;
        this.container.style.top = `${newY}px`;
        this.container.style.right = 'auto';
        this.container.style.bottom = 'auto';
        
        // Update previous position
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    onMouseUp() {
        this.isDragging = false;
        this.container.style.cursor = 'move';
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    enhanceMaterial(material) {
        if (material.emissive) {
            material.emissive.set(0x00a8ff);
            material.emissiveIntensity = 0.5;
        }
        if (material.metalness !== undefined) material.metalness = 0.9;
        if (material.roughness !== undefined) material.roughness = 0.1;
        material.needsUpdate = true;
    }

    // Move to a random position on the screen
    moveToRandomPosition() {
        if (!this.robot) return;
        
        // Calculate random position within screen bounds
        const maxX = 5;
        const minX = -5;
        const maxZ = 5;
        const minZ = -5;
        
        this.moveTarget = new THREE.Vector3(
            Math.random() * (maxX - minX) + minX,
            this.robot.position.y,
            Math.random() * (maxZ - minZ) + minZ
        );
        
        // Calculate direction to move
        this.moveDirection.subVectors(this.moveTarget, this.robot.position).normalize();
        
        // Calculate distance and duration
        const distance = this.robot.position.distanceTo(this.moveTarget);
        this.moveDuration = distance / this.options.moveSpeed;
        this.moveStartTime = this.clock.getElapsedTime();
        this.isMoving = true;
        
        // Make the character face the movement direction
        if (this.robot) {
            this.robot.lookAt(this.moveTarget);
            // Reset the X and Z rotation to keep the character upright
            this.robot.rotation.x = 0;
            this.robot.rotation.z = 0;
        }
    }
    
    // Update movement
    updateMovement() {
        if (!this.isMoving || !this.robot || !this.moveTarget) return;
        
        const elapsed = this.clock.getElapsedTime() - this.moveStartTime;
        const progress = Math.min(elapsed / this.moveDuration, 1);
        
        // Move towards target
        this.robot.position.lerpVectors(
            this.robot.position,
            this.moveTarget,
            progress
        );
        
        // If we've reached the target, get a new target
        if (progress >= 1) {
            this.isMoving = false;
            // Wait a bit before moving again
            setTimeout(() => this.moveToRandomPosition(), 2000);
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();

        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Handle movement
        this.updateMovement();
        
        // Start moving if not already moving
        if (!this.isMoving && this.robot) {
            this.moveToRandomPosition();
        }
        
        // Update point light position to create a subtle pulsing effect
        if (this.pointLight) {
            const time = Date.now() * 0.001;
            this.pointLight.intensity = 1.2 + Math.sin(time * 2) * 0.3;
        }

        this.renderer.render(this.scene, this.camera);
    }

    showLoadingState() {
        // Show loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'robot-loading';
        loadingDiv.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            color: white;
            background: rgba(0,0,0,0.7);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 1001;
        `;
        loadingDiv.innerHTML = '🤖 Loading robot...';
        this.container.appendChild(loadingDiv);
    }
    
    removeLoadingState() {
        const loadingDiv = document.getElementById('robot-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    showErrorState() {
        console.error('Failed to load 3D model. Falling back to a simple robot.');
        
        // Create a simple robot-like shape as fallback
        const group = new THREE.Group();
        
        // Robot body
        const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            metalness: 0.7,
            roughness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Robot head
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            metalness: 0.8,
            roughness: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.1;
        group.add(head);
        
        // Robot eyes
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 1.1, 0.35);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 1.1, 0.35);
        group.add(rightEye);
        
        // Add to scene
        this.robot = group;
        this.scene.add(this.robot);
        
        // Simple animation
        this.animate = () => {
            requestAnimationFrame(this.animate.bind(this));
            if (this.robot) {
                this.robot.rotation.y += 0.01;
                // Gentle bobbing
                this.robot.position.y = Math.sin(Date.now() * 0.002) * 0.05;
            }
            this.renderer.render(this.scene, this.camera);
        };
        
        // Remove loading state
        this.removeLoadingState();
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.id = 'robot-error';
        errorDiv.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            color: white;
            background: rgba(231, 76, 60, 0.8);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 1001;
            max-width: 200px;
        `;
        errorDiv.innerHTML = '⚠️ Could not load robot model. Using a simple version instead.';
        this.container.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            const errorMsg = document.getElementById('robot-error');
            if (errorMsg) errorMsg.remove();
        }, 5000);
    }
}

// Initialize the robot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if the container exists
    if (document.getElementById('robot-container')) {
        // Initialize the 3D character
        window.character = new InteractiveRobot('robot-container', {
            modelPath: '3d-robot-test/models/robot.glb',
            position: { x: 0, y: -1, z: 0 },
            scale: 0.5,
            moveSpeed: 1.5,
            autoRotate: false,
            hoverEffect: false,
            clickEffect: false
        });
    }
});
