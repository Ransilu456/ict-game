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
            maxLevel: 1, // Ensure default exists
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
            timer: document.getElementById('hud-timer'),

            // Sidebar Stats
            playerName: document.getElementById('hud-player-name'),
            levelSm: document.getElementById('hud-level-sm'),
            xpBar: document.getElementById('hud-xp-bar'),
            xpVal: document.getElementById('hud-xp-val'),
            scoreVal: document.getElementById('hud-score-val'),
            statsPanel: document.getElementById('user-stats-panel')
        };

        this.levelContainer = document.getElementById('level-container');
        this.modal = document.getElementById('feedback-modal');
        this.overlay = document.getElementById('overlay');

        // Expose globally for HTML onclicks
        window.game = this;

        this.init();
    }

    init() {
        // Event Listeners
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-missions')?.addEventListener('click', () => this.showMissionSelect()); // Optional btn now
        document.getElementById('btn-next-level').addEventListener('click', () => this.nextLevel());

        // Pause Menu Events
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause()); // Close pause menu
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
            maxLevel: Math.max(this.gameState.currentLevel, this.gameState.maxLevel || 1),
            xp: this.gameState.xp,
            score: this.gameState.score,
            lang: this.gameState.lang
        };
        localStorage.setItem('ictQuestSave', JSON.stringify(data));
        console.log('[System] Progress Saved.');
        this.updateHUD(); // Sync stats on save
    }

    loadData() {
        const raw = localStorage.getItem('ictQuestSave');
        if (raw) {
            try {
                const data = JSON.parse(raw);
                this.gameState.playerName = data.playerName || '';
                this.gameState.xp = data.xp || 0;
                this.gameState.score = data.score || 0;
                this.gameState.maxLevel = data.maxLevel || 1;
                if (data.lang) this.setLanguage(data.lang);

                // If name exists, pre-fill
                const nameInput = document.getElementById('player-name');
                if (this.gameState.playerName && nameInput) {
                    nameInput.value = this.gameState.playerName;
                }
            } catch (e) {
                console.error('Save File Corrupted', e);
            }
        }
    }

    checkResume() {
        // If player has a name, show "Resume" style or Mission Select logic
        if (this.gameState.playerName) {
            const btnStart = document.getElementById('btn-start');
            if (btnStart) {
                // Change text to indicate resume
                // We'll update the inner text directly or via key
                // For now, let's just ensure the UI reflects a "logged in" state if we were to support auto-login
                // But user requested "Connect to Server" flow.
                // We can show the "Select Mission" button on intro if logged in previously
                const btnMissions = document.getElementById('btn-missions');
                if (btnMissions) btnMissions.classList.remove('hidden');
            }
            // Show stats panel
            this.hud.statsPanel.style.display = 'block';
            this.updateHUD();
        }
    }

    /* Language System */
    setLanguage(langCode) {
        if (this.gameState.lang === langCode) return;
        this.gameState.lang = langCode;
        this.updateUIText();

        // If in level, re-render level module
        if (!this.screens.game.classList.contains('hidden') && this.currentLevelModule) {
            this.currentLevelModule.render();
            if (this.currentLevelModule.attachEvents) this.currentLevelModule.attachEvents();
        }
    }

    getText(key) {
        const entry = LANG[key];
        if (!entry) return `[${key}]`;
        return entry[this.gameState.lang] || entry['en'];
    }

    updateUIText() {
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            // Check if element has children we shouldn't overwrite (like icons)
            // Ideally, wrap text in span. For now, simple replace.
            if (el.children.length === 0) {
                el.innerText = this.getText(key);
            } else {
                // Try to find a span or text node? 
                // Allow overwrite if it's just text + icon and logic handles it?
                // Let's just update title attribute if it exists, or innerText if safe.
                // For buttons with icons, we wrapped text in span in new HTML.
                const span = el.querySelector('span[data-key]');
                if (span) return; // handled by the child loop

                // If the element itself has the key but also children (e.g. icon), 
                // maybe we shouldn't overwrite innerHTML.
                // Safe approach: Only update if no children, or specific "text-only" children.
            }
        });

        document.querySelectorAll('[data-key-placeholder]').forEach(el => {
            const key = el.getAttribute('data-key-placeholder');
            el.placeholder = this.getText(key);
        });

        this.updateHUD();
    }

    /* Screen Management */
    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        this.screens[screenName].classList.remove('hidden');

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

        const totalLevels = 8; // Updated count

        for (let i = 1; i <= totalLevels; i++) {
            const isLocked = i > this.gameState.maxLevel;
            const btn = document.createElement('div');

            // Tailwind definition for Level Card
            btn.className = `group relative overflow-hidden rounded-xl p-5 border transition-all cursor-pointer shadow-lg hover:shadow-xl
                ${isLocked
                    ? 'bg-slate-900/40 border-slate-800 opacity-60 grayscale cursor-not-allowed'
                    : 'glass-panel border-indigo-500/30 hover:border-indigo-500 hover:bg-slate-900/60'
                }`;

            // Inner Content
            btn.innerHTML = `
                <div class="flex items-start justify-between mb-4">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl border ${isLocked ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}">
                        <iconify-icon icon="${isLocked ? 'solar:lock-keyhole-linear' : 'solar:code-square-linear'}"></iconify-icon>
                    </div>
                    ${!isLocked ? '<iconify-icon icon="solar:check-circle-bold" class="text-emerald-500 text-xl opacity-0 group-hover:opacity-100 transition-opacity"></iconify-icon>' : ''}
                </div>
                <div>
                    <h4 class="text-sm font-semibold text-white mb-1">${this.getText('LBL_LEVEL')} ${i}</h4>
                    <p class="text-xs text-slate-500 line-clamp-2">${isLocked ? this.getText('LBL_LOCKED') : this.getText('L' + i + '_TITLE') || 'Mission Ready'}</p>
                </div>
                
                <!-- Progress Line -->
                <div class="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-4">
                    <div class="bg-indigo-500 h-full w-${isLocked ? '0' : (i < this.gameState.maxLevel ? 'full' : '0')}"></div>
                </div>
            `;

            if (!isLocked) {
                btn.onclick = () => {
                    this.gameState.currentLevel = i;
                    this.startGame(true);
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
                this.showFeedback(this.getText('ERROR_NO_NAME_TITLE'), this.getText('ERROR_NO_NAME_MSG'));
                return;
            }
            this.gameState.playerName = name;

            // Admin Logic
            if (name.toUpperCase() === 'ADMIN' || name.toUpperCase() === 'SUDO') {
                this.gameState.maxLevel = 8;
                console.log('*** ADMIN ACCESS GRANTED ***');
            }
        }

        if (!skipCheck) {
            this.gameState.currentLevel = this.gameState.maxLevel;
        }

        // Show HUD stats immediately
        this.hud.statsPanel.style.display = 'block';
        this.saveData();
        this.loadLevel(this.gameState.currentLevel);
    }

    async loadLevel(levelNum) {
        this.showScreen('game');
        this.updateHUD();
        this.levelContainer.innerHTML = `
            <div class="h-full w-full flex flex-col items-center justify-center text-slate-500 animate-pulse">
                <iconify-icon icon="solar:hourglass-line-linear" class="text-4xl mb-2"></iconify-icon>
                <span>Loading Mission Data...</span>
            </div>
        `;

        try {
            const module = await import(`./levels/level${levelNum}.js`);
            this.levelContainer.innerHTML = ''; // Clear loader

            if (module.default && typeof module.default.init === 'function') {
                this.currentLevelModule = module.default;

                // Wrap in a padding container or let level handle it?
                // The container #level-container is flex-col flex-1.
                // Let's create a wrapper div for padding.
                const wrapper = document.createElement('div');
                wrapper.className = "w-full h-full overflow-y-auto p-4 md:p-8 level-content";
                this.levelContainer.appendChild(wrapper);

                module.default.init(wrapper, this);
                this.startLevelTimer(); // Start global timer
            } else {
                throw new Error('Invalid Level Module Format');
            }

        } catch (error) {
            console.error('Failed to load level:', error);
            this.levelContainer.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-rose-500 text-center p-6">
                    <iconify-icon icon="solar:danger-triangle-bold" class="text-4xl mb-2"></iconify-icon>
                    <h3 class="font-bold">Mission Load Failure</h3>
                    <p class="text-sm mt-1 text-rose-400/80">${error.message}</p>
                </div>
            `;
        }
    }

    completeLevel(levelResults) {
        this.stopLevelTimer(); // Stop timer

        const levelScore = levelResults.score || 0;
        this.gameState.score += levelScore;
        this.gameState.xp += (levelResults.xp || 100);

        if (levelResults.success && this.gameState.currentLevel === this.gameState.maxLevel) {
            this.gameState.maxLevel++;
        }

        this.saveData();

        // Update Results Screen
        const outcomeKey = levelResults.success ? 'RES_SUCCESS' : 'RES_FAIL';
        const outcomeEl = document.getElementById('mission-outcome');
        outcomeEl.innerText = this.getText(outcomeKey);

        // Dynamic Class for Success/Fail color
        if (levelResults.success) {
            outcomeEl.classList.add('from-emerald-400', 'to-cyan-400');
            outcomeEl.classList.remove('from-rose-500', 'to-orange-500');
        } else {
            outcomeEl.classList.remove('from-emerald-400', 'to-cyan-400');
            outcomeEl.classList.add('from-rose-500', 'to-orange-500');
        }

        // Stats
        document.getElementById('res-accuracy').innerText = (levelResults.accuracy || 0) + '%';

        // Calculate Time Bonus based on actual formatted timer logic if needed?
        // Or trust the level's reported timeBonus? 
        // Let's use the actual elapsed time logic for consistency if levels don't report it well.
        // For now, trust the level object.
        document.getElementById('res-time').innerText = '+' + (levelResults.timeBonus || 0);
        document.getElementById('res-xp').innerText = this.gameState.xp; // Show total XP? Or earned? Standard is usually earned. 
        // But the ID is res-xp. Let's show "Earned: 200".

        this.showScreen('results');
    }

    nextLevel() {
        this.gameState.currentLevel++;
        // Max check
        if (this.gameState.currentLevel > 8) { // Updated max
            this.showFeedback("CAMPAIGN COMPLETE", "You have completed all available missions! Check back later for updates.");
            this.showScreen('select');
            return;
        }
        this.loadLevel(this.gameState.currentLevel);
    }

    /* HUD Updates */
    updateHUD() {
        // Top HUD
        this.hud.level.innerText = String(this.gameState.currentLevel).padStart(2, '0');
        this.hud.score.innerText = String(this.gameState.score).padStart(4, '0');

        // Sidebar Stats
        if (this.hud.playerName) this.hud.playerName.innerText = this.gameState.playerName;
        if (this.hud.levelSm) this.hud.levelSm.innerText = 'Lvl ' + Math.floor(this.gameState.currentLevel); // Or calc level from XP
        if (this.hud.xpVal) this.hud.xpVal.innerText = this.gameState.xp;
        if (this.hud.scoreVal) this.hud.scoreVal.innerText = this.gameState.score;

        // XP Bar (Visual only, fake math for now: (XP % 1000) / 10)
        if (this.hud.xpBar) {
            const progress = (this.gameState.xp % 2000) / 20; // 2000 xp per level visual
            this.hud.xpBar.style.width = `${Math.min(100, Math.max(5, progress))}%`;
        }
    }

    /* Utilities */
    showFeedback(title, message) {
        document.getElementById('feedback-title').innerText = title;
        document.getElementById('feedback-msg').innerHTML = message;
        this.toggleModal(true);
    }

    toggleModal(show) {
        if (show) {
            this.modal.classList.remove('hidden');
            this.overlay.classList.remove('hidden');
        } else {
            this.modal.classList.add('hidden');
            this.overlay.classList.add('hidden');
        }
    }

    /* Timer Logic */
    startLevelTimer() {
        this.stopLevelTimer(); // Clear existing
        this.levelStartTime = Date.now();
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.updateTimerDisplay();
            }
        }, 1000);
        this.updateTimerDisplay();
    }

    stopLevelTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        if (!this.levelStartTime) return;

        // Calculate elapsed
        // Note: If we want to handle pause accurately (subtracting pause duration), we need more logic.
        // For now, simple Date.now diff. If pause is long, it counts. 
        // To fix pause: Store 'accumulatedTime' and 'lastStartTime'.
        // Let's stick to simple for now unless requested.

        const elapsedSec = Math.floor((Date.now() - this.levelStartTime) / 1000);
        const min = Math.floor(elapsedSec / 60);
        const sec = elapsedSec % 60;

        if (this.hud.timer) {
            this.hud.timer.innerText = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        }
    }

    /* Pause System */
    togglePause() {
        if (this.screens.game.classList.contains('hidden')) return;

        this.isPaused = !this.isPaused;
        const pauseModal = document.getElementById('pause-modal');

        if (this.isPaused) {
            pauseModal.classList.remove('hidden');
            // Optional: visual freeze
        } else {
            pauseModal.classList.add('hidden');
        }
    }

    quitToMenu() {
        this.togglePause();
        this.stopLevelTimer();
        this.showScreen('intro');
    }
}

// Start Engine
const game = new GameEngine();
export default game;
