class Boss {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = 50;
        this.health = 1000;
        this.maxHealth = 1000;
        this.phase = 1;
        this.color = '#ff00ff';
        this.attackPatterns = [];
        this.currentPattern = null;
        this.attackCooldown = 0;
        this.projectiles = [];
        this.shields = [];
        this.adaptationData = {
            playerPosition: [],
            playerAttacks: [],
            successfulDefenses: [],
            failedDefenses: [],
            playerWeapons: {},
            playerMovement: {
                horizontal: 0,
                vertical: 0,
                dashCount: 0,
                blockCount: 0
            },
            lastHitTime: 0,
            timeSinceLastHit: 0
        };
        this.defenseMode = false;
        this.defenseCooldown = 0;
        this.defenseDuration = 0;
        this.rageMode = false;
        this.rageTimer = 0;
        this.rageDuration = 300; // 5 seconds at 60fps
        this.rageThreshold = 0.3; // 30% health triggers rage
        this.attackHistory = [];
        this.maxAttackHistory = 10;
        this.initializePatterns();
    }

    initializePatterns() {
        this.attackPatterns = [
            {
                name: 'basic',
                weight: 1,
                execute: () => this.basicAttack(),
                counter: null,
                energyCost: 0
            },
            {
                name: 'rush',
                weight: 1,
                execute: () => this.rushAttack(),
                counter: null,
                energyCost: 5
            },
            {
                name: 'projectile',
                weight: 1,
                execute: () => this.projectileAttack(),
                counter: null,
                energyCost: 10
            },
            {
                name: 'teleport',
                weight: 1,
                execute: () => this.teleportAttack(),
                counter: null,
                energyCost: 15
            },
            {
                name: 'shield',
                weight: 0.5,
                execute: () => this.shieldAttack(),
                counter: null,
                energyCost: 20
            },
            {
                name: 'summon',
                weight: 0.3,
                execute: () => this.summonAttack(),
                counter: null,
                energyCost: 30
            },
            {
                name: 'laser',
                weight: 0.7,
                execute: () => this.laserAttack(),
                counter: null,
                energyCost: 25
            },
            {
                name: 'counter',
                weight: 0.4,
                execute: () => this.counterAttack(),
                counter: null,
                energyCost: 15
            },
            {
                name: 'energyNova',
                weight: 0.6,
                execute: () => this.energyNovaAttack(),
                counter: null,
                energyCost: 20
            },
            {
                name: 'laserGrid',
                weight: 0.5,
                execute: () => this.laserGridAttack(),
                counter: null,
                energyCost: 25
            },
            {
                name: 'energyStorm',
                weight: 0.4,
                execute: () => this.energyStormAttack(),
                counter: null,
                energyCost: 30
            }
        ];
    }

    update() {
        // Update time since last hit
        this.adaptationData.timeSinceLastHit++;
        
        // Update defense mode
        if (this.defenseMode) {
            this.defenseDuration--;
            if (this.defenseDuration <= 0) {
                this.defenseMode = false;
            }
        } else if (this.defenseCooldown > 0) {
            this.defenseCooldown--;
        }
        
        // Update rage mode
        if (this.rageMode) {
            this.rageTimer--;
            if (this.rageTimer <= 0) {
                this.rageMode = false;
            }
        }
        
        // Check for rage mode activation
        if (!this.rageMode && this.health < this.maxHealth * this.rageThreshold) {
            this.activateRageMode();
        }

        // Update position based on current pattern
        if (this.currentPattern) {
            this.currentPattern.execute();
        }

        // Update projectiles
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update();
            return projectile.y < this.game.canvas.height && projectile.y > 0 && 
                   projectile.x > 0 && projectile.x < this.game.canvas.width &&
                   projectile.lifetime > 0;
        });
        
        // Update shields
        this.shields = this.shields.filter(shield => {
            shield.update();
            return shield.lifetime > 0;
        });

        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        // Record player position
        this.adaptationData.playerPosition.push({
            x: this.game.player.x,
            y: this.game.player.y,
            timestamp: Date.now()
        });

        // Keep only last 100 positions
        if (this.adaptationData.playerPosition.length > 100) {
            this.adaptationData.playerPosition.shift();
        }

        // Choose next attack pattern
        if (this.attackCooldown <= 0) {
            this.chooseNextPattern();
        }

        // Phase transitions
        if (this.health < this.maxHealth * 0.75 && this.phase === 1) {
            this.phase = 2;
            this.adaptPatterns();
        } else if (this.health < this.maxHealth * 0.5 && this.phase === 2) {
            this.phase = 3;
            this.adaptPatterns();
        } else if (this.health < this.maxHealth * 0.25 && this.phase === 3) {
            this.phase = 4;
            this.adaptPatterns();
        }
    }

    draw(ctx) {
        // Draw shields
        this.shields.forEach(shield => shield.draw(ctx));
        
        // Draw boss
        ctx.fillStyle = this.rageMode ? '#ff0000' : this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw defense mode effect
        if (this.defenseMode) {
            ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw projectiles
        this.projectiles.forEach(projectile => projectile.draw(ctx));

        // Draw phase indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`Phase ${this.phase}`, this.x, this.y - 10);
        
        // Draw rage mode indicator
        if (this.rageMode) {
            ctx.fillStyle = '#ff0000';
            ctx.font = '16px Arial';
            ctx.fillText('RAGE MODE', this.x, this.y - 30);
        }
    }

    chooseNextPattern() {
        // Analyze player behavior
        const playerBehavior = this.analyzePlayerBehavior();
        
        // Adjust pattern weights based on analysis
        this.adaptPatterns();

        // Choose pattern based on weights
        const totalWeight = this.attackPatterns.reduce((sum, pattern) => sum + pattern.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const pattern of this.attackPatterns) {
            random -= pattern.weight;
            if (random <= 0) {
                this.currentPattern = pattern;
                this.attackCooldown = 60;
                
                // Record attack in history
                this.attackHistory.push({
                    name: pattern.name,
                    timestamp: Date.now()
                });
                
                // Keep only recent attacks
                if (this.attackHistory.length > this.maxAttackHistory) {
                    this.attackHistory.shift();
                }
                
                break;
            }
        }
    }

    analyzePlayerBehavior() {
        const recentPositions = this.adaptationData.playerPosition.slice(-10);
        const behavior = {
            isAggressive: false,
            prefersRange: false,
            movementPattern: 'random',
            usesDash: false,
            usesBlock: false,
            weaponPreference: 'sword',
            attackFrequency: 0
        };

        // Analyze movement pattern
        let horizontalMovement = 0;
        let verticalMovement = 0;
        
        for (let i = 1; i < recentPositions.length; i++) {
            horizontalMovement += Math.abs(recentPositions[i].x - recentPositions[i-1].x);
            verticalMovement += Math.abs(recentPositions[i].y - recentPositions[i-1].y);
        }

        behavior.prefersRange = horizontalMovement > verticalMovement * 2;
        behavior.isAggressive = this.adaptationData.playerAttacks.length > 5;
        behavior.usesDash = this.adaptationData.playerMovement.dashCount > 2;
        behavior.usesBlock = this.adaptationData.playerMovement.blockCount > 2;
        
        // Analyze weapon usage
        const weaponCounts = {};
        this.adaptationData.playerAttacks.forEach(attack => {
            if (attack.weapon) {
                weaponCounts[attack.weapon] = (weaponCounts[attack.weapon] || 0) + 1;
            }
        });
        
        // Find most used weapon
        let maxCount = 0;
        for (const weapon in weaponCounts) {
            if (weaponCounts[weapon] > maxCount) {
                maxCount = weaponCounts[weapon];
                behavior.weaponPreference = weapon;
            }
        }
        
        // Calculate attack frequency
        const recentAttacks = this.adaptationData.playerAttacks.filter(
            attack => Date.now() - attack.timestamp < 5000
        );
        behavior.attackFrequency = recentAttacks.length;

        return behavior;
    }

    adaptPatterns() {
        const behavior = this.analyzePlayerBehavior();
        
        // Reset weights
        this.attackPatterns.forEach(pattern => {
            pattern.weight = 1;
        });
        
        // Adjust pattern weights based on player behavior
        this.attackPatterns.forEach(pattern => {
            // Counter ranged players with close attacks
            if (behavior.prefersRange) {
                if (pattern.name === 'rush' || pattern.name === 'teleport') {
                    pattern.weight *= 1.5;
                }
                if (pattern.name === 'projectile') {
                    pattern.weight *= 0.5;
                }
            }
            
            // Counter aggressive players with defensive moves
            if (behavior.isAggressive) {
                if (pattern.name === 'shield' || pattern.name === 'counter') {
                    pattern.weight *= 1.5;
                }
                if (pattern.name === 'basic') {
                    pattern.weight *= 0.5;
                }
            }
            
            // Counter dashing players with area attacks
            if (behavior.usesDash) {
                if (pattern.name === 'laser' || pattern.name === 'summon') {
                    pattern.weight *= 1.5;
                }
            }
            
            // Counter blocking players with unblockable attacks
            if (behavior.usesBlock) {
                if (pattern.name === 'laser' || pattern.name === 'summon') {
                    pattern.weight *= 1.5;
                }
                if (pattern.name === 'projectile') {
                    pattern.weight *= 0.5;
                }
            }
            
            // Counter weapon preferences
            if (behavior.weaponPreference === 'sword') {
                if (pattern.name === 'shield' || pattern.name === 'counter') {
                    pattern.weight *= 1.5;
                }
            } else if (behavior.weaponPreference === 'energyBlast') {
                if (pattern.name === 'shield') {
                    pattern.weight *= 1.5;
                }
            }
            
            // Adjust based on phase
            if (this.phase > 1) {
                if (pattern.name === 'summon' || pattern.name === 'laser') {
                    pattern.weight *= 1.2;
                }
            }
            
            if (this.phase > 2) {
                if (pattern.name === 'counter') {
                    pattern.weight *= 1.3;
                }
            }
            
            // Rage mode adjustments
            if (this.rageMode) {
                if (pattern.name === 'rush' || pattern.name === 'laser') {
                    pattern.weight *= 1.5;
                }
                if (pattern.name === 'shield') {
                    pattern.weight *= 0.5;
                }
            }
        });

        // Normalize weights
        const totalWeight = this.attackPatterns.reduce((sum, pattern) => sum + pattern.weight, 0);
        this.attackPatterns.forEach(pattern => {
            pattern.weight = pattern.weight / totalWeight;
        });
    }

    basicAttack() {
        // Simple movement towards player
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += (dx / distance) * (this.rageMode ? 5 : 3);
            this.y += (dy / distance) * (this.rageMode ? 5 : 3);
        }
    }

    rushAttack() {
        // Quick dash towards player
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += (dx / distance) * (this.rageMode ? 12 : 8);
            this.y += (dy / distance) * (this.rageMode ? 12 : 8);
        }
    }

    projectileAttack() {
        // Shoot projectiles at player
        if (this.attackCooldown <= 0) {
            const angle = Math.atan2(
                this.game.player.y - this.y,
                this.game.player.x - this.x
            );
            
            // Predict player position
            const predictedX = this.game.player.x + this.game.player.velocityX * 5;
            const predictedY = this.game.player.y + this.game.player.velocityY * 5;
            const predictedAngle = Math.atan2(
                predictedY - this.y,
                predictedX - this.x
            );
            
            // Use predicted angle in rage mode
            const finalAngle = this.rageMode ? predictedAngle : angle;
            
            this.projectiles.push(new Projectile(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(finalAngle) * (this.rageMode ? 7 : 5),
                Math.sin(finalAngle) * (this.rageMode ? 7 : 5),
                '#ff0000',
                15
            ));
            
            // Add spread shots in rage mode
            if (this.rageMode) {
                this.projectiles.push(new Projectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    Math.cos(finalAngle + 0.2) * 5,
                    Math.sin(finalAngle + 0.2) * 5,
                    '#ff0000',
                    10
                ));
                
                this.projectiles.push(new Projectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    Math.cos(finalAngle - 0.2) * 5,
                    Math.sin(finalAngle - 0.2) * 5,
                    '#ff0000',
                    10
                ));
            }
            
            this.attackCooldown = this.rageMode ? 20 : 30;
        }
    }

    teleportAttack() {
        // Teleport near player
        if (this.attackCooldown <= 0) {
            const offsetX = (Math.random() - 0.5) * (this.rageMode ? 300 : 200);
            const offsetY = (Math.random() - 0.5) * (this.rageMode ? 300 : 200);
            
            this.x = this.game.player.x + offsetX;
            this.y = this.game.player.y + offsetY;
            
            // Keep within canvas bounds
            this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
            this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));
            
            this.attackCooldown = this.rageMode ? 30 : 45;
        }
    }
    
    shieldAttack() {
        if (this.attackCooldown <= 0) {
            this.defenseMode = true;
            this.defenseDuration = 120; // 2 seconds
            this.defenseCooldown = 180; // 3 seconds cooldown
            
            // Create shield
            this.shields.push(new Shield(
                this.x + this.width/2,
                this.y + this.height/2,
                this.width * 1.2,
                '#0000ff',
                120 // 2 seconds
            ));
            
            this.attackCooldown = 60;
        }
    }
    
    summonAttack() {
        if (this.attackCooldown <= 0) {
            // Create minions
            const numMinions = this.rageMode ? 4 : 2;
            
            for (let i = 0; i < numMinions; i++) {
                const angle = (Math.PI * 2 / numMinions) * i;
                const distance = 150;
                
                const minionX = this.x + this.width/2 + Math.cos(angle) * distance;
                const minionY = this.y + this.height/2 + Math.sin(angle) * distance;
                
                this.projectiles.push(new Projectile(
                    minionX,
                    minionY,
                    Math.cos(angle) * 3,
                    Math.sin(angle) * 3,
                    '#00ffff',
                    5,
                    'minion'
                ));
            }
            
            this.attackCooldown = 120;
        }
    }
    
    laserAttack() {
        if (this.attackCooldown <= 0) {
            // Create laser beam
            const laserWidth = this.rageMode ? 40 : 20;
            const laserHeight = this.game.canvas.height;
            
            this.projectiles.push(new Projectile(
                this.x + this.width/2 - laserWidth/2,
                0,
                0,
                0,
                '#ff00ff',
                25,
                'laser'
            ));
            
            this.attackCooldown = 90;
        }
    }
    
    counterAttack() {
        if (this.attackCooldown <= 0) {
            // Counter attack based on player's last action
            const lastAttack = this.adaptationData.playerAttacks[this.adaptationData.playerAttacks.length - 1];
            
            if (lastAttack && Date.now() - lastAttack.timestamp < 1000) {
                // Player recently attacked, counter with appropriate move
                if (lastAttack.weapon === 'sword') {
                    // Counter melee with shield
                    this.shieldAttack();
                } else if (lastAttack.weapon === 'energyBlast') {
                    // Counter ranged with rush
                    this.rushAttack();
                } else {
                    // Default counter
                    this.teleportAttack();
                }
            } else {
                // No recent attack, use default
                this.basicAttack();
            }
            
            this.attackCooldown = 45;
        }
    }
    
    energyNovaAttack() {
        if (this.attackCooldown <= 0) {
            // Create energy nova
            const numProjectiles = this.rageMode ? 12 : 8;
            for (let i = 0; i < numProjectiles; i++) {
                const angle = (Math.PI * 2 / numProjectiles) * i;
                this.projectiles.push(new Projectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    Math.cos(angle) * (this.rageMode ? 7 : 5),
                    Math.sin(angle) * (this.rageMode ? 7 : 5),
                    '#ff00ff',
                    10
                ));
            }
            this.attackCooldown = this.rageMode ? 30 : 45;
        }
    }

    laserGridAttack() {
        if (this.attackCooldown <= 0) {
            // Create laser grid
            const numLasers = this.rageMode ? 6 : 4;
            for (let i = 0; i < numLasers; i++) {
                const x = (this.game.canvas.width / numLasers) * i;
                this.projectiles.push(new Projectile(
                    x,
                    0,
                    0,
                    this.game.canvas.height,
                    '#ff00ff',
                    20,
                    'laser'
                ));
            }
            this.attackCooldown = this.rageMode ? 60 : 90;
        }
    }

    energyStormAttack() {
        if (this.attackCooldown <= 0) {
            // Create energy storm
            const numProjectiles = this.rageMode ? 20 : 10;
            for (let i = 0; i < numProjectiles; i++) {
                const angle = Math.random() * Math.PI * 2;
                this.projectiles.push(new Projectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    Math.cos(angle) * (this.rageMode ? 7 : 5),
                    Math.sin(angle) * (this.rageMode ? 7 : 5),
                    '#ff00ff',
                    10
                ));
            }
            this.attackCooldown = this.rageMode ? 45 : 60;
        }
    }

    activateRageMode() {
        this.rageMode = true;
        this.rageTimer = this.rageDuration;
        
        // Visual effect
        this.color = '#ff0000';
        
        // Increase attack speed
        this.attackCooldown = Math.max(0, this.attackCooldown - 30);
    }

    takeDamage(amount) {
        // Check if boss is in defense mode
        if (this.defenseMode) {
            amount = Math.floor(amount * 0.25); // 75% damage reduction
        }
        
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.updateHealthBar();
        
        // Record successful attack
        this.adaptationData.playerAttacks.push({
            timestamp: Date.now(),
            damage: amount,
            weapon: this.game.player.weapons[this.game.player.currentWeapon].name
        });
        
        // Record time of last hit
        this.adaptationData.lastHitTime = Date.now();
        this.adaptationData.timeSinceLastHit = 0;
        
        // Record player movement
        this.adaptationData.playerMovement.dashCount += this.game.player.isDashing ? 1 : 0;
        this.adaptationData.playerMovement.blockCount += this.game.player.isBlocking ? 1 : 0;
    }

    updateHealthBar() {
        const healthBar = document.querySelector('.boss-health-fill');
        healthBar.style.width = `${(this.health / this.maxHealth) * 100}%`;
        
        // Update phase display
        document.getElementById('phase').textContent = this.phase;
    }
}

class Shield {
    constructor(x, y, size, color, lifetime) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.lifetime = lifetime;
    }
    
    update() {
        this.lifetime--;
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(0, 0, 255, ${this.lifetime / 120})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}