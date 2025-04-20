# Chameleon Overlord

A client-side only boss battle game featuring an AI that learns and evolves with each encounter. The boss adapts to your playstyle, creating a unique and challenging experience every time you play.

## Features

- Dynamic boss AI that learns from player actions
- Multiple attack patterns that evolve as the battle progresses
- Player abilities including movement, jumping, attacking, and special moves
- Score tracking and phase progression
- No server required - runs entirely in the browser

## How to Play

### Controls & Game Mechanics

#### Basic Movement [Player]
- **Movement**:
    - Keyboard: Arrow keys or WASD to move around the arena
    - Touchscreen: Swipe left or right to move
- **Jump** :
    - Keyboard: Up arrow, W, or Spacebar (only when on ground)
    - Touchscreen: Swipe up

#### Combat System [Player]
- **Basic Attack & Weapons**:
    - Activation:
        - Keyboard: Left mouse button
        - Touchscreen: Single tap
    - Weapon Types (Switch with number keys or two-finger swipe down):
        1. **Sword**:
            - Short-range steady laser resembling a sword blade
            - Low energy cost, high close-range damage, deals 5% damage to the boss
            - Could use anytime
            - Perfect for close combat encounters
        2. **Energy Blast**:
            - Fires a laser projectile toward click/tap location
            - High energy cost, good ranged damage, deals 3% damage to the boss
            - Could use anytime
            - Ideal for keeping distance from the boss
        3. **Shield**:
            - Creates a circular laser field around the player that also reduces incoming damage by 75%
            - Medium energy cost, continuous damage to nearby enemies, deals 5% damage to the boss
            - Cooldown: 10 seconds between uses
            - Great for defensive playstyle
    - Weapon Switching:
        - Keyboard: 1, 2, 3 keys
        - Touchscreen: Two-finger swipe down
- **Special Attack**
    - Keyboard: Right mouse button
    - Touchscreen: Longpress single tap (500ms)
    - Effect: Releases damaging circles in all directions, deals 10% damage
    - Cooldown: 20 seconds between uses

#### Defensive Abilities [Player]
- **Block**:
    - Keyboard: Hold Shift key
    - Touchscreen: Longpress with two fingers
    - Effect: Reduces incoming damage by 75%
- **Dash**:
    - Keyboard: Ctrl or Q key
    - Touchscreen: Double tap in desired direction
    - Effect: Quick movement with temporary invincibility
    - Cooldown: 10 seconds between 3 dashes

#### Combat Mechanics [Player]
- **Energy Management**:
    - Different weapons and abilities consume varying amounts of energy as stated in each section
    - Energy of the player regenerates over time by 0.5% per 20 seconds
    - Manage wisely for optimal combat effectiveness

#### Basic Attacks [Boss]
- **Energy Beam**:
    - Fires a concentrated beam of energy
    - Damage: 3% of player's energy
    - Warning Sign: Brief charging animation
- **Energy Spheres**:
    - Launches multiple energy orbs in patterns
    - Damage: 5% of player's energy per sphere
    - Could use after each 10 energy beams
    - Pattern varies based on boss's phase
- **Ground Slam**:
    - Creates shockwaves across the arena
    - Damage: 5% on direct hit, 3% from shockwave
    - Could use after each 2 energy spheres
    - Warning Sign: Boss leaps into the air

#### Special Attacks [Boss]
- **Energy Storm**:
    - Fills arena with random energy bolts
    - Damage: 5% per bolt
    - Appears in later phases
    - Cooldown: 15 seconds between uses
    - Warning Sign: Arena darkens briefly
- **Laser Grid**:
    - Creates a grid of deadly lasers
    - Damage: 5% on contact
    - Cooldown: 15 seconds between uses
    - Safe spots appear between grid lines
    - Warning Sign: Grid pattern appears on ground

#### Ultimate Attacks [Boss]
- **Energy Nova**:
    - Massive explosion covering most of the arena
    - Damage: 8% if caught in blast
    - Only used when boss is below 30% energy
    - Cooldown: 15 seconds between uses
    - Warning Sign: Boss glows brightly and charges for 3 seconds

#### Defense Patterns [Boss]
- **Energy Shield**:
    - Boss becomes temporarily invulnerable
    - Duration: 5 seconds
    - Use this time to regenerate your energy
    - Cooldown: 20 seconds between uses
- **Counter Strike**:
    - Reflects player attacks
    - Damage: Equal to player's attack + 5%
    - Activated after taking heavy damage
    - Cooldown: 20 seconds between uses

## Tips to Win

### Win/Loss Conditions
- **To Win**:
    - Deplete the boss's energy bar completely through consistent attacks
    - Keep managing your own energy while dealing damage
- **Game Over**:
    - If your energy bar is depleted first, you lose the battle
    - Careful energy management is crucial for survival

### Movement Strategies
1. **Stay Mobile**:
    - Constant movement makes you harder to hit
    - Use WASD/Arrow keys (keyboard) or swipe (touchscreen) to maintain mobility
    - Combine movement with attacks for hit-and-run tactics
2. **Watch the Boss**:
    - Pay attention to visual cues that indicate what attack is coming next
    - Position yourself to counter-attack after dodging
3. **Manage Your Energy**:
    - Don't exhaust your energy with too many special attacks
    - Balance between offensive and defensive abilities
4. **Learn the Patterns**:
    - Each boss phase introduces new attack patterns
    - Learn to recognize them to better time your attacks
5. **Use the Environment**:
    - The arena has boundaries - use them to your advantage
    - Position yourself to maximize attack effectiveness

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
#### Phase 1: Learning Phase
- **Duration**: Until boss loses 25% energy
- **Movement Patterns**:
    - Base Movement Speed: 50% of player speed
    - Simple linear movement
    - Teleport cooldown: 8 seconds
    - Keeps medium distance (30% of arena width)
    - Repositions after every 3 attacks
- **Attack Pattern**:
    - Basic Energy Beam (2 second cooldown)
    - Energy Spheres (3 second cooldown)
    - Ground Slam (5 second cooldown)
- **Boss Learning**:
    - Tracks player's preferred dodge direction and adds it to player action dataset
    - Monitors weapon choice frequency and adds it to player action dataset
    - Records player's attack timing patterns and adds it to player action dataset
- **Adaptation Mechanics**:
    - Gradually adjusts beam aim to predict player movement and saves it to boss action dataset
    - Increases attack frequency against stationary players
    - Starts timing attacks to interrupt player patterns

#### Phase 2: Aggressive Adaptation
- **Duration**: 25% - 50% boss energy loss
- **Movement Patterns**:
    - Movement Speed: 75% of player speed
    - Circular and zigzag patterns
    - Teleport cooldown: 6 seconds
    - Varies distance (20-40% of arena width)
    - Quick sidesteps after attacks
    - Dash ability unlocked (10 second cooldown)
- **New Attacks**:
    - Energy Storm (8 second cooldown)
    - Counter Strike ability unlocked
- **Enhanced Abilities**:
    - Energy Beam now tracks player movement
    - Energy Spheres form more complex patterns
- **Boss Learning**:
    - Tracks player's preferred dodge direction and adds it to player action dataset
    - Monitors weapon choice frequency and adds it to player action dataset
    - Records player's attack timing patterns and adds it to player action dataset
    - Analyzes player's weapon preferences and saves it to boss action dataset
    - Studies defensive timing patterns and saves it to boss action dataset
    - Maps player's safe zones and saves it to boss action dataset
- **Adaptation Mechanics**:
    - Targets player's most-used areas of the arena and saves it to boss action dataset
    - Times Counter Strike with player's attack patterns
    - Reduces delays between attacks if player is passive

#### Phase 3: Tactical Evolution
- **Duration**: 50% - 75% boss energy loss
- **Movement Patterns**:
    - Movement Speed: 100% of player speed
    - Complex geometric patterns
    - Teleport cooldown: 4 seconds
    - Aggressive distance closing
    - Fake-out movements to bait attacks
    - Multiple consecutive dashes (8 second cooldown)
    - Shadow clone movement (creates false position indicators)
- **New Attacks**:
    - Laser Grid (10 second cooldown)
    - Energy Shield (15 second cooldown)
- **Enhanced Abilities**:
    - Ground Slam creates multiple shockwave patterns
    - Energy Storm covers larger area
- **Boss Learning**:
    - Tracks player's preferred dodge direction and adds it to player action dataset
    - Monitors weapon choice frequency and adds it to player action dataset
    - Records player's attack timing patterns and adds it to player action dataset
    - Identifies player's combo patterns and saves it to boss action dataset
    - Recognizes energy management habits and saves it to boss action dataset
    - Tracks successful player strategies and saves it to boss action dataset
- **Adaptation Mechanics**:
    - Creates laser grid patterns based on player's movement habits and saves it to boss action dataset
    - Activates shield when player's energy is highest
    - Combines attacks to counter observed strategies and saves it to boss action dataset

#### Phase 4: Ultimate Challenge
- **Duration**: Final 25% of boss energy
- **Movement Patterns**:
    - Movement Speed: 125% of player speed
    - Unpredictable mixed patterns
    - Teleport cooldown: 2 seconds
    - Rapid distance changes
    - Continuous movement during attacks
    - Chain dash ability (3 dashes, 5 second cooldown)
    - Mirror movement (can briefly copy player movement patterns)
    - Phase shifting (can become temporarily intangible while moving)
- **New Attacks**:
    - Energy Nova (20 second cooldown)
    - Rapid Phase Shift (switches between previous attack patterns)
- **Enhanced Abilities**:
    - All attack cooldowns reduced by 25%
    - Can combine multiple attack patterns
- **Boss Learning**:
    - Tracks player's preferred dodge direction and adds it to player action dataset
    - Monitors weapon choice frequency and adds it to player action dataset
    - Records player's attack timing patterns and adds it to player action dataset
    - Full analysis of player's combat style and saves it to boss action dataset
    - Predicts player's emergency responses and saves it to boss action dataset
    - Adapts to player's final phase strategies and saves it to boss action dataset
- **Adaptation Mechanics**:
    - Dynamically switches attack patterns to counter player's style and saves it to boss action dataset
    - Times Energy Nova with player's low energy periods and saves it to boss action dataset
    - Creates complex attack combinations based on observed weaknesses and saves it to boss action dataset
    - Uses all learned patterns to create unpredictable sequences and saves it to boss action dataset

#### Boss Movement Mechanics
- **Base Movement**:
    - Ground movement follows geometric patterns
    - Teleport always leaves brief visual indicator
    - Movement speed increases with each phase
    - Direction changes based on player position
- **Advanced Movement**:
    - Dash creates energy trail that damages player
    - Teleport locations predict player movement
    - Phase shifting indicated by color change
    - Shadow clones mimic base movement patterns
- **Tactical Positioning**:
    - Maintains optimal range for current attack type
    - Uses arena boundaries to corner player
    - Creates crossfire situations with projectiles
    - Positions to limit player escape routes

#### Boss AI Learning Factors
- **Movement Patterns**:
    - Preferred dodge directions from boss action dataset
    - Common safe zones from boss action dataset
    - Dash timing and frequency from boss action dataset
- **Combat Behavior**:
    - Weapon selection patterns from boss action dataset
    - Attack timing preferences from boss action dataset
    - Energy management style from boss action dataset
    - Combo building habits from boss action dataset
    - Response to specific attacks from boss action dataset
    - Resource management patterns from boss action dataset
    - Defensive timing preferences from boss action dataset
    - Arena positioning preferences from boss action dataset
- **Strategic Elements**:

#### Dataset
- **Action and Counter Masterfile Dataset**:
    - The dataset contains all the possible attacks or movements of the player with the appropriate counter attack or movement of the boss to it
    - The dataset should be categorized by phase.
    - Each entry should have a type of either attack or movement.
    - In each phase, the list of possible player attacks or movements should be paired with possible counter attacks or movements of the boss for that phase or based on the phase complexity.
- **Player Action Dataset**:
    - It contains the attacks and movements of the player with damage details to the player or to the boss.
    - The record will be categorized by phase, by action type (attacks or movements).
- **Boss Action Dataset**:
    - It contains the generated attacks and movements for the boss.
    - The record will be categorized by phase, by action type (attacks or movements).
    - Generated attacks in this dataset for the boss are based on the attacks of the player that damaged the boss. Through the identified player attacks that damage the boss, the boss will store in this dataset the created counter movement or counter attacks from the Action and Counter Masterfile Dataset.

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