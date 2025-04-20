class Player {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 50;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = game.canvas.height - this.height - 20;
        this.speed = 5;
        this.jumpForce = -15;
        this.gravity = 0.8;
        this.velocityY = 0;
        this.velocityX = 0;
        this.isJumping = false;
        this.health = 100;
        this.maxHealth = 100;
        this.energy = 100;
        this.maxEnergy = 100;
        this.energyRegenRate = 0.5;
        this.attackCooldown = 0;
        this.specialCooldown = 0;
        this.isAttacking = false;
        this.isBlocking = false;
        this.isDashing = false;
        this.dashCooldown = 0;
        this.dashDuration = 0;
        this.dashSpeed = 15;
        this.attackBox = {
            width: 60,
            height: 60
        };
        this.color = '#00ff9d';
        this.trail = [];
        this.maxTrailLength = 5;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.comboTimeout = 60; // frames
        this.weapons = [
            { name: 'sword', damage: 10, energyCost: 0, cooldown: 20 },
            { name: 'energyBlast', damage: 20, energyCost: 30, cooldown: 60 },
            { name: 'shield', damage: 0, energyCost: 5, cooldown: 10, duration: 30 }
        ];
        this.currentWeapon = 0;
        this.weaponCooldown = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 30; // frames

        // Add touch controls for movement
        window.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });

        window.addEventListener('touchmove', (e) => {
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;

            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0) {
                    this.x += this.speed; // Swipe right
                } else {
                    this.x -= this.speed; // Swipe left
                }
            } else {
                // Vertical swipe
                if (deltaY < 0 && !this.isJumping) {
                    this.velocityY = this.jumpForce; // Swipe up to jump
                    this.isJumping = true;
                }
            }

            // Update touch start position for continuous movement
            this.touchStartX = touchEndX;
            this.touchStartY = touchEndY;
        });
    }

    update() {
        // Energy regeneration
        if (this.energy < this.maxEnergy) {
            this.energy += this.energyRegenRate;
            if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
        }

        // Combo timer
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer === 0) {
                this.comboCount = 0;
            }
        }

        // Invincibility timer
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }

        // Dash mechanics
        if (this.isDashing) {
            this.dashDuration--;
            if (this.dashDuration <= 0) {
                this.isDashing = false;
                this.velocityX = 0;
            }
        } else if (this.dashCooldown > 0) {
            this.dashCooldown--;
        }

        // Weapon cooldown
        if (this.weaponCooldown > 0) {
            this.weaponCooldown--;
        }

        // Movement
        if (!this.isDashing) {
            if (this.game.keys.includes('ArrowLeft') || this.game.keys.includes('a')) {
                this.x -= this.speed;
            }
            if (this.game.keys.includes('ArrowRight') || this.game.keys.includes('d')) {
                this.x += this.speed;
            }
        }

        // Jump
        if ((this.game.keys.includes('ArrowUp') || this.game.keys.includes('w') || this.game.keys.includes(' ')) && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }

        // Block
        this.isBlocking = this.game.keys.includes('Shift') && this.energy >= 5;
        if (this.isBlocking) {
            this.energy -= 0.5;
        }

        // Weapon switch
        if (this.game.keys.includes('1')) {
            this.currentWeapon = 0;
        } else if (this.game.keys.includes('2')) {
            this.currentWeapon = 1;
        } else if (this.game.keys.includes('3')) {
            this.currentWeapon = 2;
        }

        // Dash
        if ((this.game.keys.includes('Control') || this.game.keys.includes('q')) && this.dashCooldown <= 0 && !this.isDashing) {
            this.dash();
        }

        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Ground collision
        if (this.y > this.game.canvas.height - this.height - 20) {
            this.y = this.game.canvas.height - this.height - 20;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // Wall collision
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.canvas.width - this.width) {
            this.x = this.game.canvas.width - this.width;
        }

        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        if (this.specialCooldown > 0) {
            this.specialCooldown--;
        }

        // Update trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    draw(ctx) {
        // Draw trail
        ctx.save();
        this.trail.forEach((pos, index) => {
            const alpha = (index + 1) / this.maxTrailLength;
            ctx.fillStyle = `rgba(0, 255, 157, ${alpha * 0.5})`;
            ctx.fillRect(pos.x, pos.y, this.width, this.height);
        });
        ctx.restore();

        // Draw player
        ctx.fillStyle = this.invincible ? 'rgba(0, 255, 157, 0.5)' : this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw block effect
        if (this.isBlocking) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw dash effect
        if (this.isDashing) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.fillRect(this.x - 10, this.y, this.width + 20, this.height);
        }

        // Draw attack box if attacking
        if (this.isAttacking) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(
                this.x + this.width / 2 - this.attackBox.width / 2,
                this.y - this.attackBox.height,
                this.attackBox.width,
                this.attackBox.height
            );
        }

        // Draw combo counter
        if (this.comboCount > 1) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText(`${this.comboCount}x Combo!`, this.x, this.y - 20);
        }

        // Draw energy bar
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x, this.y - 10, (this.energy / this.maxEnergy) * this.width, 5);
    }

    attack() {
        const weapon = this.weapons[this.currentWeapon];
        
        if (this.weaponCooldown <= 0 && this.energy >= weapon.energyCost) {
            this.isAttacking = true;
            this.weaponCooldown = weapon.cooldown;
            this.energy -= weapon.energyCost;
            
            // Combo system
            this.comboCount++;
            this.comboTimer = this.comboTimeout;
            
            // Damage multiplier based on combo
            const damageMultiplier = 1 + (this.comboCount - 1) * 0.1;
            const damage = Math.floor(weapon.damage * damageMultiplier);
            
            setTimeout(() => {
                this.isAttacking = false;
            }, 200);

            // Check for boss hit
            const attackBox = {
                x: this.x + this.width / 2 - this.attackBox.width / 2,
                y: this.y - this.attackBox.height,
                width: this.attackBox.width,
                height: this.attackBox.height
            };

            if (this.checkCollision(attackBox, this.game.boss)) {
                this.game.boss.takeDamage(damage);
                this.game.score += damage;
                this.game.updateScore();
            }
        }
    }

    specialAttack() {
        if (this.specialCooldown <= 0 && this.energy >= 50) {
            this.specialCooldown = 120;
            this.energy -= 50;
            
            // Create energy wave
            this.game.projectiles.push(new Projectile(
                this.x + this.width / 2,
                this.y,
                0,
                -10,
                '#ff00ff',
                30,
                'special'
            ));
            
            // Create side waves
            this.game.projectiles.push(new Projectile(
                this.x + this.width / 2,
                this.y,
                -5,
                -8,
                '#ff00ff',
                20,
                'special'
            ));
            
            this.game.projectiles.push(new Projectile(
                this.x + this.width / 2,
                this.y,
                5,
                -8,
                '#ff00ff',
                20,
                'special'
            ));
        }
    }

    dash() {
        this.isDashing = true;
        this.dashDuration = 10;
        this.dashCooldown = 60;
        this.invincible = true;
        this.invincibleTimer = this.invincibleDuration;
        
        // Determine dash direction
        if (this.game.keys.includes('ArrowLeft') || this.game.keys.includes('a')) {
            this.velocityX = -this.dashSpeed;
        } else if (this.game.keys.includes('ArrowRight') || this.game.keys.includes('d')) {
            this.velocityX = this.dashSpeed;
        } else {
            // Default dash direction based on boss position
            this.velocityX = this.game.boss.x > this.x ? -this.dashSpeed : this.dashSpeed;
        }
    }

    takeDamage(amount) {
        if (this.invincible) return;
        
        if (this.isBlocking) {
            // Block reduces damage by 75%
            amount = Math.floor(amount * 0.25);
        }
        
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.updateHealthBar();
        
        // Reset combo on taking damage
        this.comboCount = 0;
        
        // Brief invincibility after taking damage
        this.invincible = true;
        this.invincibleTimer = this.invincibleDuration;
    }

    updateHealthBar() {
        const healthBar = document.querySelector('.health-fill');
        healthBar.style.width = `${(this.health / this.maxHealth) * 100}%`;
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
}

class Projectile {
    constructor(x, y, velocityX, velocityY, color, damage, type = 'normal') {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.damage = damage;
        this.type = type;
        this.width = type === 'special' ? 20 : 10;
        this.height = type === 'special' ? 20 : 10;
        this.lifetime = type === 'special' ? 120 : 60; // frames
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.lifetime--;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        
        if (this.type === 'special') {
            // Draw special projectile with glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}