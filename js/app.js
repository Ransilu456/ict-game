/**
 * ICT Quest - Main Game Engine
 * Handles state, screen transitions, and level loading.
 */

import { LANG } from './lang.js';

class GameEngine {
    constructor() {
        this.gameState = {
            playerName: '',
            currentLevel: 1,
            score: 0,
            xp: 0,
            lang: 'en' // Default Language
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
        // Language Switch (Global)
        window.setLang = (lang) => this.setLanguage(lang);

        // Initial Render
        this.updateUIText();
    }

    /* Language System */
    setLanguage(langCode) {
        if (this.gameState.lang === langCode) return;
        this.gameState.lang = langCode;
        this.updateUIText();

        // If in level, re-render level (simple approach)
        if (this.screens.game.classList.contains('active') && this.currentLevelModule) {
            this.currentLevelModule.render();
            // Re-attach events since we wiped innerHTML
            this.currentLevelModule.attachEvents();
        }
    }

    getText(key) {
        const entry = LANG[key];
        if (!entry) return `[${key}]`;
        return entry[this.gameState.lang] || entry['en'];
    }

    updateUIText() {
        // Find all elements with data-key
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            el.innerText = this.getText(key); // Use innerText to preserve styling on parents if careful, but for buttons/headers it's standard.
            // Note: For elements with nested HTML (like Intro Title), we might need targeted handling or avoid full overwrite.
            // Fix for Title which has a span:
            if (el.querySelector('*')) {
                // Skip complex children updating here, handled individually or structured differently.
                // Actually, let's just target leaf nodes or specific IDs in HTML.
                // For now, let's be careful.
            }
        });

        // Handle placeholders
        document.querySelectorAll('[data-key-placeholder]').forEach(el => {
            const key = el.getAttribute('data-key-placeholder');
            el.placeholder = this.getText(key);
        });

        // Specific updates for formatted strings
        if (this.screens.game.classList.contains('active')) {
            this.updateHUD();
        }

        // Intro Title special case (Nested SPAN)
        // We can just rely on data-keys being on the span itself, which we added.
        // But the H1 top-level text gets wiped.
        // Solution: Split the H1 text into a span or handle in HTML.
        // Let's assume the HTML update handles granular data-keys.
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
                this.currentLevelModule = module.default;
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
        const outcomeKey = levelResults.success ? 'RES_SUCCESS' : 'RES_FAIL';
        const outcomeEl = document.getElementById('mission-outcome');
        outcomeEl.innerText = this.getText(outcomeKey);
        outcomeEl.style.color = levelResults.success ? 'var(--color-success)' : 'var(--color-error)';

        // Update Labels (Static ones handled by updateUIText, but dynamic values need care)
        document.getElementById('res-accuracy-lbl').innerText = this.getText('RES_ACCURACY');
        document.getElementById('res-time-lbl').innerText = this.getText('RES_TIME_BONUS');
        document.getElementById('res-xp-lbl').innerText = this.getText('RES_TOTAL_XP');

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
        this.hud.level.innerText = `${this.getText('LBL_LEVEL')}: ${String(this.gameState.currentLevel).padStart(2, '0')}`;
        this.hud.score.innerText = `${this.getText('LBL_SCORE')}: ${String(this.gameState.score).padStart(4, '0')}`;
    }

    /* Utilities */
    showFeedback(title, message) {
        document.getElementById('feedback-title').innerText = title; // Title might need to be a key if passed as key
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
