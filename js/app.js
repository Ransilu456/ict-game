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
            results: document.getElementById('results-screen'),
            select: document.getElementById('select-screen')
        };

        this.hud = {
            level: document.getElementById('hud-level'),
            score: document.getElementById('hud-score'),
            timer: document.getElementById('hud-timer')
        };

        this.levelContainer = document.getElementById('level-container');
        this.modal = document.getElementById('feedback-modal');
        this.overlay = document.getElementById('overlay');

        this.initCanvas();
        this.init();
    }

    initCanvas() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = Array(columns).fill(1);
        });

        // Matrix Rain
        const fontSize = 16;
        let columns = Math.floor(width / fontSize);
        let drops = Array(columns).fill(1);
        const chars = "0101010101ABCDEF"; // Binary + Hex

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    init() {
        // Event Listeners
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-missions').addEventListener('click', () => this.showMissionSelect());
        document.getElementById('btn-reset').addEventListener('click', () => this.resetProgress());
        document.getElementById('btn-next-level').addEventListener('click', () => this.nextLevel());

        // Pause Menu Events
        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-restart').addEventListener('click', () => {
            this.togglePause();
            this.loadLevel(this.gameState.currentLevel);
        });
        document.getElementById('btn-quit').addEventListener('click', () => this.quitToMenu());

        // Global Keydown
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.togglePause();
        });

        // Modal Close (Global)
        window.closeModal = () => this.toggleModal(false);
        // Language Switch (Global)
        window.setLang = (lang) => this.setLanguage(lang);

        // Load Save Data
        this.loadData();

        // Initial Render
        this.updateUIText();
        this.checkResume();
    }

    /* Persistence */
    saveData() {
        const data = {
            playerName: this.gameState.playerName,
            maxLevel: Math.max(this.gameState.currentLevel, this.gameState.maxLevel || 1), // Track max unlocked
            xp: this.gameState.xp,
            lang: this.gameState.lang
        };
        localStorage.setItem('ictQuestSave', JSON.stringify(data));
        console.log('[System] Progress Saved.');
    }

    loadData() {
        const raw = localStorage.getItem('ictQuestSave');
        if (raw) {
            try {
                const data = JSON.parse(raw);
                this.gameState.playerName = data.playerName || '';
                this.gameState.xp = data.xp || 0;
                this.gameState.maxLevel = data.maxLevel || 1;
                if (data.lang) this.setLanguage(data.lang);

                // If name exists, pre-fill
                if (this.gameState.playerName) {
                    document.getElementById('player-name').value = this.gameState.playerName;
                }
            } catch (e) {
                console.error('Save File Corrupted', e);
            }
        } else {
            this.gameState.maxLevel = 1;
        }
    }

    checkResume() {
        if (this.gameState.playerName) {
            document.getElementById('btn-missions').style.display = 'inline-block';
            document.getElementById('btn-start').innerText = this.gameState.lang === 'si' ? 'දිගටම කරගෙන යන්න' : 'Resume'; // Quick override or add to LANG
        }
    }

    resetProgress() {
        if (confirm(this.getText('MSG_RESET_CONFIRM'))) {
            localStorage.removeItem('ictQuestSave');
            location.reload();
        }
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

        if (screenName === 'select') {
            this.renderLevelSelect();
        }
    }

    showMissionSelect() {
        this.showScreen('select');
    }

    renderLevelSelect() {
        const list = document.getElementById('mission-list');
        list.innerHTML = '';

        // Config: Total Levels? We have 8 implemented.
        const totalLevels = 8;

        for (let i = 1; i <= totalLevels; i++) {
            const isLocked = i > this.gameState.maxLevel;
            const btn = document.createElement('div');
            btn.className = `btn ${isLocked ? 'btn-secondary' : ''}`; // Style diff for locked? Or simpler
            btn.style.width = '150px';
            btn.style.height = '150px';
            btn.style.display = 'flex';
            btn.style.flexDirection = 'column';
            btn.style.justifyContent = 'center';
            btn.style.alignItems = 'center';
            btn.style.padding = '1rem';
            btn.style.opacity = isLocked ? '0.5' : '1';
            btn.style.cursor = isLocked ? 'not-allowed' : 'pointer';

            // Content
            btn.innerHTML = `
                <div style="font-size:2rem; margin-bottom:0.5rem;">${isLocked ? '🔒' : '🔓'}</div>
                <div>${this.getText('LBL_LEVEL')} ${i}</div>
                <div style="font-size:0.8rem; margin-top:0.5rem; color:var(--color-text-muted);">
                    ${isLocked ? this.getText('LBL_LOCKED') : ''}
                </div>
            `;

            if (!isLocked) {
                btn.onclick = () => {
                    this.gameState.currentLevel = i;
                    this.startGame(true); // Skip name check if already has name
                };
            }

            list.appendChild(btn);
        }
    }

    /* Game Flow */
    startGame(skipCheck = false) {
        if (!skipCheck) {
            const nameInput = document.getElementById('player-name');
            const name = nameInput.value.trim();

            if (!name) {
                this.showFeedback('Access Denied', 'Please enter your Agent Name to proceed.');
                return;
            }
            this.gameState.playerName = name;

            // ADMIN HACK
            if (name.toUpperCase() === 'ADMIN' || name.toUpperCase() === 'SUDO') {
                this.gameState.maxLevel = 8;
                console.log('*** ADMIN ACCESS GRANTED: ALL LEVELS UNLOCKED ***');
            }
        }

        // Check if level was set via menu, else continue from max?
        // Default behavior: if coming from "Connect/Resume", maybe load maxLevel.
        // If from Menu, load currentLevel.
        if (!skipCheck) {
            // For "Connect" button, define behavior: Start at maxLevel
            this.gameState.currentLevel = this.gameState.maxLevel;
        }

        this.saveData(); // Save initial login
        console.log(`[System] Player ${this.gameState.playerName} logged in.`);
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

        // Update Max Level if proceeding
        if (levelResults.success && this.gameState.currentLevel === this.gameState.maxLevel) {
            this.gameState.maxLevel++;
        }

        this.saveData();

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

    /* Pause System */
    togglePause() {
        if (!this.screens.game.classList.contains('active')) return;

        this.isPaused = !this.isPaused;
        const pauseModal = document.getElementById('pause-modal');

        if (this.isPaused) {
            pauseModal.style.display = 'flex';
            this.overlay.classList.add('active'); // Reuse overlay? Or pause has its own
            // Pause start time could be tracked here if we want to subtract duration later
        } else {
            pauseModal.style.display = 'none';
            this.overlay.classList.remove('active');
        }
    }

    quitToMenu() {
        this.togglePause(); // Close menu
        this.showScreen('intro');
    }
}

// Start Engine
const game = new GameEngine();
export default game;
