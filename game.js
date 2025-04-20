class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = [];
        this.projectiles = [];
        this.isRunning = false;
        this.score = 0;
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize game objects
        this.player = new Player(this);
        this.boss = new Boss(this);
        this.guardian = new Guardian(this.player);
        
        // Event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
        
        // Start button
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('resetBoss').addEventListener('click', () => this.resetBoss());
        
        // Show menu initially
        this.showMenu();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.8;
    }

    startGame() {
        this.isRunning = true;
        this.score = 0;
        this.updateScore();
        document.getElementById('gameMenu').style.display = 'none';
        this.gameLoop();
    }

    resetBoss() {
        this.boss = new Boss(this);
        this.boss.updateHealthBar();
    }

    showMenu() {
        document.getElementById('gameMenu').style.display = 'block';
    }

    handleKeyDown(e) {
        if (!this.keys.includes(e.key)) {
            this.keys.push(e.key);
        }
    }

    handleKeyUp(e) {
        const index = this.keys.indexOf(e.key);
        if (index > -1) {
            this.keys.splice(index, 1);
        }
    }

    handleClick(e) {
        if (this.isRunning) {
            this.player.attack();
        }
    }

    handleRightClick(e) {
        if (this.isRunning) {
            e.preventDefault();
            this.player.specialAttack();
        }
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    checkCollisions() {
        // Check player-boss collision
        if (this.checkRectCollision(this.player, this.boss)) {
            this.player.takeDamage(10);
        }

        // Check player-projectile collisions
        this.boss.projectiles.forEach(projectile => {
            if (this.checkRectCollision(this.player, projectile)) {
                this.player.takeDamage(projectile.damage);
            }
        });

        // Check boss-player projectile collisions
        this.projectiles.forEach(projectile => {
            if (this.checkRectCollision(projectile, this.boss)) {
                this.boss.takeDamage(projectile.damage);
                this.score += 10;
                this.updateScore();
            }
        });
    }

    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    gameLoop() {
        if (!this.isRunning) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update game objects
        this.player.update();
        this.boss.update();
        this.guardian.update();
        this.projectiles.forEach(projectile => projectile.update());

        // Check collisions
        this.checkCollisions();

        // Draw game objects
        this.player.draw(this.ctx);
        this.boss.draw(this.ctx);
        this.guardian.draw(this.ctx);
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));

        // Check game over conditions
        if (this.player.health <= 0) {
            this.gameOver();
            return;
        }

        if (this.boss.health <= 0) {
            this.victory();
            return;
        }

        // Continue game loop
        requestAnimationFrame(() => this.gameLoop());
    }

    gameOver() {
        this.isRunning = false;
        alert('Game Over! Your score: ' + this.score);
        this.showMenu();
    }

    victory() {
        this.isRunning = false;
        alert('Victory! You defeated the Chameleon Overlord! Score: ' + this.score);
        this.showMenu();
    }
}

// Added Guardian NPC logic
class Guardian {
    constructor(player) {
        this.player = player;
        this.width = 40;
        this.height = 40;
        this.x = player.x - 60; // Fixed distance from player
        this.y = player.y;
        this.health = 100;
        this.maxHealth = 100;
        this.shieldCooldown = 0;
        this.shieldDuration = 0;
        this.isShieldActive = false;
    }

    update() {
        // Follow the player
        this.x = this.player.x - 60;
        this.y = this.player.y;

        // Shield cooldown logic
        if (this.shieldCooldown > 0) {
            this.shieldCooldown--;
        }

        // Shield duration logic
        if (this.isShieldActive) {
            this.shieldDuration--;
            if (this.shieldDuration <= 0) {
                this.isShieldActive = false;
            }
        }
    }

    activateShield() {
        if (this.shieldCooldown <= 0) {
            this.isShieldActive = true;
            this.shieldDuration = 300; // 5 seconds at 60fps
            this.shieldCooldown = 1800; // 30 seconds cooldown
        }
    }

    draw(ctx) {
        // Draw Guardian
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw shield effect
        if (this.isShieldActive) {
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw health bar
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y - 10, (this.health / this.maxHealth) * this.width, 5);
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    new Game();
});