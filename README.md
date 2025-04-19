# Chameleon Overlord

A client-side only boss battle game featuring an AI that learns and evolves with each encounter. The boss adapts to your playstyle, creating a unique and challenging experience every time you play.

## Features

- Dynamic boss AI that learns from player actions
- Multiple attack patterns that evolve as the battle progresses
- Player abilities including movement, jumping, attacking, and special moves
- Laser gun attack that fires toward the direction of a click or tap
- Score tracking and phase progression
- No server required - runs entirely in the browser

## How to Play

### Controls

- **Movement**:
    For Keyboard: Arrow keys or WASD  
    For Touchscreen: Swipe left or right
- **Jump**: 
    For Keyboard: Up arrow, W, or Spacebar  
    For Touchscreen: Swipe up
- **Attack**: 
    For Keyboard: Left mouse button (fires a laser gun toward the click direction)  
    For Touchscreen: Single Tap (fires a laser gun toward the tap direction)
- **Special Attack**:
    For Keyboard: Right mouse button  
    For Touchscreen: Longpress single tap (500ms)
- **Block**:
    For Keyboard: Shift key  
    For Touchscreen: Longpress two fingers
- **Dash**: 
    For Keyboard: Ctrl or Q key  
    For Touchscreen: Double tap in the desired direction
- **Switch Weapons**: 
    For Keyboard: 1, 2, 3 keys  
    For Touchscreen: Two-finger swipe down
  - 1: Sword (melee, low energy cost)
  - 2: Energy Blast (ranged, high energy cost)
  - 3: Shield (defensive, medium energy cost)

### Game Mechanics

#### Player Abilities

- **Laser Gun Attack**: Fires a laser projectile toward the direction of a click or tap. The laser damages the boss upon collision.
- **Basic Movement**: Use arrow keys or WASD to move around the arena
- **Jumping**: Press Up, W, or Spacebar to jump (can only jump when on the ground)
- **Attacking**: Click the left mouse button to perform a basic attack
- **Special Attack**: Right-click to perform a special attack (energy blast)
- **Blocking**: Hold Shift to block incoming damage (reduces damage by 75%)
- **Dashing**: Press Ctrl or Q to perform a quick dash (grants temporary invincibility)
- **Weapon Switching**: Press 1, 2, or 3 to switch between different weapons
- **Combo System**: Consecutive hits increase your damage multiplier

#### Boss Mechanics

- **Adaptive AI**: The boss learns from your actions and adjusts its strategy
- **Multiple Phases**: The boss becomes more aggressive as its health decreases
- **Attack Patterns**: The boss uses various attack patterns that you must learn to counter
- **Rage Mode**: When the boss's health drops below 30%, it enters a more aggressive state
- **Defense Mode**: The boss can activate a shield to reduce incoming damage

#### Energy System

- Your energy regenerates over time
- Different abilities consume different amounts of energy
- Manage your energy wisely to maintain offensive and defensive capabilities

## Tips to Win

### General Strategy

1. **Stay Mobile**: Constant movement makes you harder to hit
2. **Watch the Boss**: Pay attention to visual cues that indicate what attack is coming next
3. **Manage Your Energy**: Don't exhaust your energy with too many special attacks
4. **Learn the Patterns**: Each boss phase introduces new attack patterns - learn to recognize them
5. **Use the Environment**: The arena has boundaries - use them to your advantage

### Countering Specific Attacks

- **Basic Attack**: Dodge by moving away or jumping
- **Rush Attack**: Jump or dash to avoid the charge
- **Projectile Attack**: Move perpendicular to the projectile's path
- **Teleport Attack**: Be ready to change direction quickly when the boss teleports
- **Shield Attack**: Focus on dodging until the shield expires
- **Summon Attack**: Prioritize eliminating minions before they overwhelm you
- **Laser Attack**: Move to the side of the laser beam
- **Counter Attack**: Vary your attack patterns to prevent the boss from predicting your moves

### Advanced Techniques

1. **Combo Mastery**: Build and maintain combos for increased damage
2. **Energy Management**: Keep enough energy for defensive moves when needed
3. **Weapon Switching**: Change weapons based on the boss's current state
4. **Dash Timing**: Use dashes to avoid attacks and reposition quickly
5. **Block Timing**: Block only when necessary to conserve energy

### Phase-Specific Strategies

- **Phase 1**: Focus on learning the boss's basic patterns
- **Phase 2**: The boss becomes more aggressive - prioritize defense
- **Phase 3**: The boss introduces new attacks - stay alert and adapt quickly
- **Phase 4**: The final phase is the most challenging - use all your abilities strategically

### Adapting to the Boss's Learning

- **Vary Your Approach**: The boss learns from your actions, so don't rely on the same strategy
- **Mix Up Your Attacks**: Alternate between melee and ranged attacks
- **Change Your Position**: Don't stay in one area for too long
- **Surprise Elements**: Use unexpected combinations of abilities to catch the boss off guard

## Technical Details

- Built with HTML5 Canvas, CSS, and vanilla JavaScript
- No external dependencies or frameworks required
- Runs entirely in the browser
- Saves high scores using local storage

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

To modify the game:

1. Clone the repository
2. Edit the JavaScript files to modify game logic
3. Edit the CSS file to change the visual style
4. Open index.html in a browser to test your changes

## Credits

Created by [Your Name] as a demonstration of client-side game development with adaptive AI.