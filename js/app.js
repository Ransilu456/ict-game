/**
 * ICT Quest - Main Game Engine
 * Handles state, screen transitions, and level loading.
 */

class GameEngine {
    constructor() {
        this.gameState = {
            playerName: '',
            currentLevel: 1,
            score: 0,
            xp: 0
        };

        // DOM Elements
        this.screens = {
            intro: document.getElementById('intro-screen'),
            game: document.getElementById('game-screen'),
            results: document.getElementById('results-screen')
        };
        
        this.hud = {
            level: document.getElementById('hud-level'),
            score: document.getElementById('hud-score'),
            timer: document.getElementById('hud-timer')
        };

        this.levelContainer = document.getElementById('level-container');
        this.modal = document.getElementById('feedback-modal');
        this.overlay = document.getElementById('overlay');

        this.init();
    }

    init() {
        // Event Listeners
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-next-level').addEventListener('click', () => this.nextLevel());
        
        // Modal Close (Global)
        window.closeModal = () => this.toggleModal(false);
    }

    /* Screen Management */
    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    /* Game Flow */
    startGame() {
        const nameInput = document.getElementById('player-name');
        const name = nameInput.value.trim();
        
        if (!name) {
            this.showFeedback('Access Denied', 'Please enter your Agent Name to proceed.');
            return;
        }

        this.gameState.playerName = name;
        this.gameState.currentLevel = 1;
        this.gameState.score = 0;
        
        console.log(`[System] Player ${name} logged in.`);
        this.loadLevel(this.gameState.currentLevel);
    }

    async loadLevel(levelNum) {
        this.showScreen('game');
        this.updateHUD();
        this.levelContainer.innerHTML = '<div style="text-align:center; padding:2rem;">Loading Mission Data...</div>';

        try {
            // Dynamic Import of Level Logic
            const module = await import(`./levels/level${levelNum}.js`);
            
            // Clear Loading
            this.levelContainer.innerHTML = '';
            
            // Initialize Level
            if (module.default && typeof module.default.init === 'function') {
                module.default.init(this.levelContainer, this);
            } else {
                throw new Error('Invalid Level Module Format');
            }

        } catch (error) {
            console.error('Failed to load level:', error);
            this.levelContainer.innerHTML = `<div style="color:var(--color-error)">CRITICAL ERROR: Failed to load Mission ${levelNum}.<br>${error.message}</div>`;
        }
    }

    completeLevel(levelResults) {
        // Calculate Score & XP
        const levelScore = levelResults.score || 0;
        this.gameState.score += levelScore;
        this.gameState.xp += (levelResults.xp || 100);

        // Show Results
        document.getElementById('mission-outcome').innerText = levelResults.success ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED';
        document.getElementById('mission-outcome').style.color = levelResults.success ? 'var(--color-success)' : 'var(--color-error)';
        
        document.getElementById('res-accuracy').innerText = (levelResults.accuracy || 0) + '%';
        document.getElementById('res-time').innerText = levelResults.timeBonus || 0;
        document.getElementById('res-xp').innerText = this.gameState.xp;

        this.showScreen('results');
    }

    nextLevel() {
        this.gameState.currentLevel++;
        // Check if level exists (for now just loop or stop)
        // TODO: Add max level check
        this.loadLevel(this.gameState.currentLevel);
    }

    /* HUD Updates */
    updateHUD() {
        this.hud.level.innerText = `LEVEL: ${String(this.gameState.currentLevel).padStart(2, '0')}`;
        this.hud.score.innerText = `SCORE: ${String(this.gameState.score).padStart(4, '0')}`;
    }

    /* Utilities */
    showFeedback(title, message) {
        document.getElementById('feedback-title').innerText = title;
        document.getElementById('feedback-msg').innerHTML = message;
        this.toggleModal(true);
    }

    toggleModal(show) {
        if (show) {
            this.modal.classList.add('active');
            this.overlay.classList.add('active');
        } else {
            this.modal.classList.remove('active');
            this.overlay.classList.remove('active');
        }
    }
}

// Start Engine
const game = new GameEngine();
export default game;
