// 3D Robot with Network Effect
class RobotNetwork {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.robot = null;
        this.nodes = [];
        this.lines = [];
        this.clock = new THREE.Clock();
        
        this.init();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 10;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth * 0.3, window.innerHeight * 0.4);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('robot-container').appendChild(this.renderer.domElement);
        
        // Add lights
        this.addLights();
        
        // Create robot
        this.createRobot();
        
        // Create network nodes
        this.createNetworkNodes(15);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x4f46e5, 1, 50);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }
    
    createRobot() {
        // Robot group
        this.robot = new THREE.Group();
        
        // Head
        const headGeometry = new THREE.BoxGeometry(1, 1, 1);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4f46e5,
            shininess: 100 
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4338ca,
            shininess: 100 
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.3);
        const armMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4f46e5,
            shininess: 100 
        });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1, 0.5, 0);
        leftArm.rotation.z = 0.5;
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1, 0.5, 0);
        rightArm.rotation.z = -0.5;
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.3);
        const legMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4338ca,
            shininess: 100 
        });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.5, -1.5, 0);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.5, -1.5, 0);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.25, 1.6, 0.51);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.25, 1.6, 0.51);
        
        // Assemble robot
        this.robot.add(head);
        this.robot.add(body);
        this.robot.add(leftArm);
        this.robot.add(rightArm);
        this.robot.add(leftLeg);
        this.robot.add(rightLeg);
        this.robot.add(leftEye);
        this.robot.add(rightEye);
        
        this.scene.add(this.robot);
    }
    
    createNetworkNodes(count) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.8
        });
        
        for (let i = 0; i < count; i++) {
            const node = new THREE.Mesh(geometry, material.clone());
            
            // Position nodes in a sphere around the robot
            const radius = 3 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            node.position.x = radius * Math.sin(phi) * Math.cos(theta);
            node.position.y = radius * Math.sin(phi) * Math.sin(theta);
            node.position.z = radius * Math.cos(phi);
            
            // Add some movement
            node.userData = {
                speed: 0.1 + Math.random() * 0.2,
                direction: new THREE.Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ).normalize()
            };
            
            this.nodes.push(node);
            this.scene.add(node);
        }
        
        // Create connecting lines
        this.createConnectingLines();
    }
    
    createConnectingLines() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.nodes[i].position.distanceTo(this.nodes[j].position);
                if (distance < 4) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        this.nodes[i].position,
                        this.nodes[j].position
                    ]);
                    
                    const material = new THREE.LineBasicMaterial({
                        color: 0x4f46e5,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const line = new THREE.Line(geometry, material);
                    line.userData = {
                        node1: this.nodes[i],
                        node2: this.nodes[j]
                    };
                    
                    this.lines.push(line);
                    this.scene.add(line);
                }
            }
        }
    }
    
    updateLines() {
        // Remove old lines
        this.lines.forEach(line => this.scene.remove(line));
        this.lines = [];
        
        // Create new lines
        this.createConnectingLines();
    }
    
    updateNodes() {
        this.nodes.forEach(node => {
            // Move node
            node.position.addScaledVector(node.userData.direction, node.userData.speed * 0.02);
            
            // Bounce off an invisible sphere
            const distance = node.position.length();
            const minRadius = 3;
            const maxRadius = 8;
            
            if (distance > maxRadius || distance < minRadius) {
                // Reverse direction when hitting boundaries
                node.userData.direction.negate();
                
                // Add some randomness to the bounce
                node.userData.direction.add(
                    new THREE.Vector3(
                        (Math.random() - 0.5) * 0.5,
                        (Math.random() - 0.5) * 0.5,
                        (Math.random() - 0.5) * 0.5
                    )
                ).normalize();
                
                // Ensure we're within bounds
                if (distance > maxRadius) {
                    node.position.normalize().multiplyScalar(maxRadius * 0.9);
                } else {
                    node.position.normalize().multiplyScalar(minRadius * 1.1);
                }
            }
            
            // Pulsing effect
            const scale = 0.8 + Math.sin(Date.now() * 0.002 * node.userData.speed) * 0.2;
            node.scale.set(scale, scale, scale);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        // Rotate robot
        if (this.robot) {
            this.robot.rotation.y = time * 0.3;
            
            // Make robot nod
            this.robot.rotation.x = Math.sin(time * 0.5) * 0.1;
            
            // Make arms swing
            this.robot.children[2].rotation.z = 0.5 + Math.sin(time) * 0.3;
            this.robot.children[3].rotation.z = -0.5 + Math.sin(time + Math.PI) * 0.3;
        }
        
        // Update network nodes and lines
        this.updateNodes();
        this.updateLines();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth * 0.3, window.innerHeight * 0.4);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add container for the robot
    const robotContainer = document.createElement('div');
    robotContainer.id = 'robot-container';
    robotContainer.style.position = 'fixed';
    robotContainer.style.bottom = '20px';
    robotContainer.style.right = '20px';
    robotContainer.style.width = '300px';
    robotContainer.style.height = '400px';
    robotContainer.style.zIndex = '1000';
    robotContainer.style.pointerEvents = 'none';
    document.body.appendChild(robotContainer);
    
    // Create the robot network
    new RobotNetwork();
});
