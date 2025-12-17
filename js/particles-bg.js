class ParticleNetwork {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        
        // Default options
        this.options = {
            particleColor: 'rgba(0, 240, 255, 0.7)',
            lineColor: 'rgba(0, 240, 255, 0.3)',
            particleAmount: 50,
            defaultRadius: 1.5,
            variantRadius: 2,
            defaultSpeed: 0.5,
            variantSpeed: 0.5,
            lineWidth: 1,
            ...options
        };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        for (let i = 0; i < this.options.particleAmount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const speedX = (Math.random() - 0.5) * this.options.defaultSpeed;
        const speedY = (Math.random() - 0.5) * this.options.defaultSpeed;
        const size = Math.random() * this.options.variantRadius + this.options.defaultRadius;
        
        return { x, y, speedX, speedY, size };
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();
        
        // Draw particles
        for (const particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.particleColor;
            this.ctx.fill();
        }
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.options.lineColor;
                    this.ctx.lineWidth = this.options.lineWidth;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
            
            // Connect to mouse if close enough
            if (this.mouse.x && this.mouse.y) {
                const dx = this.particles[i].x - this.mouse.x;
                const dy = this.particles[i].y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        for (const particle of this.particles) {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX = -particle.speedX;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY = -particle.speedY;
            }
            
            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    // Repel particles from mouse
                    const angle = Math.atan2(dy, dx);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.x -= Math.cos(angle) * force * 2;
                    particle.y -= Math.sin(angle) * force * 2;
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.updateParticles();
        this.drawParticles();
    }

    setupEventListeners() {
        // Mouse move
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Update cursor position for arrow
            if (window.updateCursorPosition) {
                window.updateCursorPosition(e);
            }
        });
        
        // Touch move for mobile
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
            
            if (window.updateCursorPosition) {
                window.updateCursorPosition({
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                });
            }
        }, { passive: false });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
}

// Initialize the particle network
function initParticleNetwork() {
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        new ParticleNetwork(canvas, {
            particleColor: 'rgba(0, 240, 255, 0.7)',
            lineColor: 'rgba(0, 240, 255, 0.2)',
            particleAmount: 60,
            defaultRadius: 1.2,
            variantRadius: 1.8,
            defaultSpeed: 0.2,
            variantSpeed: 0.4,
            lineWidth: 1
        });
    }
}
