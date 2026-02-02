/**
 * ICT Quest - Main Game Engine
 * Refactored for Component Architecture
 */

import { LANG } from './lang.js';
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import LandingPage from './components/LandingPage.js';

class GameEngine {
    constructor() {
        this.gameState = {
            playerName: '',
            currentLevel: 1,
            maxLevel: 1,
            score: 0,
            xp: 0,
            lang: 'en'
        };

        // Initialize Components
        this.sidebar = new Sidebar(this);
        this.header = new Header(this);
        this.landingPage = new LandingPage(this);

        this.screens = {};
        this.hud = {};

        // Expose globally
        window.game = this;

        // Init Flow
        this.init();
    }

    init() {
        this.cacheContainers();
        this.renderComponents();
        this.cacheDOMElements();
        this.attachGlobalEvents();
        this.loadData();

        // Initial State
        this.updateUIText();

        // Show Landing Page by default.
        this.showLanding();
    }

    cacheContainers() {
        this.sidebarContainer = document.getElementById('sidebar-container');
        this.headerContainer = document.getElementById('header-container');
    }

    renderComponents() {
        // Render Static Components
        if (this.sidebarContainer) {
            this.sidebarContainer.innerHTML = this.sidebar.render();
            this.sidebar.attachEvents();
        }

        if (this.headerContainer) {
            this.headerContainer.innerHTML = this.header.render();
            this.header.attachEvents();
        }
    }

    cacheDOMElements() {
        // Screens
        this.screens = {
            intro: document.getElementById('intro-screen'),
            game: document.getElementById('game-screen'),
            results: document.getElementById('results-screen'),
            select: document.getElementById('select-screen'),
            landing: document.getElementById('landing-container')
        };

        // HUD (Some elements are inside Sidebar/Header now)
        this.hud = {
            level: document.getElementById('hud-level'),
            score: document.getElementById('hud-score'),
            timer: document.getElementById('hud-timer'),
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
    }

    attachGlobalEvents() {
        // Intro Screen Events
        document.getElementById('btn-start')?.addEventListener('click', () => this.startGame());

        // Navigation
        document.getElementById('btn-next-level')?.addEventListener('click', () => this.nextLevel());

        // Pause / Modals
        document.getElementById('btn-resume')?.addEventListener('click', () => this.togglePause());
        document.getElementById('btn-restart')?.addEventListener('click', () => {
            this.togglePause();
            this.loadLevel(this.gameState.currentLevel);
        });
        document.getElementById('btn-quit')?.addEventListener('click', () => this.quitToMenu());

        // Global Keys
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.togglePause();
        });

        // Global Helpers
        window.closeModal = () => this.toggleModal(false);
        window.setLang = (lang) => this.setLanguage(lang);
    }

    /* Screen Management */
    showLanding() {
        // Render Landing Page
        this.screens.landing.innerHTML = this.landingPage.render();
        this.landingPage.attachEvents(this.screens.landing);
        this.screens.landing.classList.remove('hidden');

        // Hide Dashboard UI
        this.sidebarContainer.classList.add('hidden');
        this.headerContainer.classList.add('hidden');

        // Hide others (visually)
        Object.values(this.screens).forEach(s => {
            if (s !== this.screens.landing) s.classList.add('hidden');
        });
    }

    showScreen(screenName) {
        // Hide Landing if we move away
        this.screens.landing.innerHTML = '';
        this.screens.landing.classList.add('hidden');

        // Show Dashboard UI
        this.sidebarContainer.classList.remove('hidden');
        this.headerContainer.classList.remove('hidden');

        // Hide all main screens
        ['intro', 'game', 'results', 'select'].forEach(key => {
            this.screens[key].classList.add('hidden');
        });

        // Show target
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
        }

        if (screenName === 'select') {
            this.renderLevelSelect();
        }
    }

    /* Data Persistence */
    saveData() {
        const data = {
            playerName: this.gameState.playerName,
            maxLevel: Math.max(this.gameState.currentLevel, this.gameState.maxLevel || 1),
            xp: this.gameState.xp,
            score: this.gameState.score,
            lang: this.gameState.lang
        };
        localStorage.setItem('ictQuestSave', JSON.stringify(data));
        this.updateHUD();
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

                if (this.gameState.playerName) {
                    const el = document.getElementById('player-name');
                    if (el) el.value = this.gameState.playerName;
                    this.checkResume();
                }
            } catch (e) { console.error(e); }
        }
    }

    checkResume() {
        if (this.gameState.playerName) {
            // Show stats panel in sidebar logic
            if (this.hud.statsPanel) {
                this.hud.statsPanel.classList.remove('hidden');
                this.hud.statsPanel.style.display = 'block'; // Ensure block if class list fails
            }
            this.updateHUD();
        }
    }

    /* Logic (Same as before) */
    setLanguage(langCode) {
        if (this.gameState.lang === langCode) return;
        this.gameState.lang = langCode;
        this.updateUIText();
        if (!this.screens.game.classList.contains('hidden') && this.currentLevelModule) {
            this.currentLevelModule.render();
            if (this.currentLevelModule.attachEvents) this.currentLevelModule.attachEvents();
        }
    }

    getText(key) {
        const entry = LANG[key];
        return entry ? (entry[this.gameState.lang] || entry['en']) : `[${key}]`;
    }

    updateUIText() {
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (el.children.length === 0) el.innerText = this.getText(key);
        });
        document.querySelectorAll('[data-key-placeholder]').forEach(el => {
            el.placeholder = this.getText(el.getAttribute('data-key-placeholder'));
        });
        this.updateHUD();
    }

    updateHUD() {
        if (this.hud.level) this.hud.level.innerText = String(this.gameState.currentLevel).padStart(2, '0');
        if (this.hud.score) this.hud.score.innerText = String(this.gameState.score).padStart(4, '0');

        if (this.hud.playerName) this.hud.playerName.innerText = this.gameState.playerName;
        if (this.hud.levelSm) this.hud.levelSm.innerText = 'Lvl ' + this.gameState.currentLevel;
        if (this.hud.xpVal) this.hud.xpVal.innerText = this.gameState.xp;
        if (this.hud.scoreVal) this.hud.scoreVal.innerText = this.gameState.score;

        if (this.hud.xpBar) {
            const progress = (this.gameState.xp % 2000) / 20;
            this.hud.xpBar.style.width = `${Math.min(100, Math.max(5, progress))}%`;
        }
    }

    /* Game Actions */
    startGame(skipCheck = false) {
        if (!skipCheck) {
            const name = document.getElementById('player-name').value.trim();
            if (!name) {
                this.showFeedback(this.getText('ERROR_NO_NAME_TITLE'), this.getText('ERROR_NO_NAME_MSG'));
                return;
            }
            this.gameState.playerName = name;
            // Admin Check
            if (name.toUpperCase() === 'ADMIN') this.gameState.maxLevel = 8;
        }

        if (!skipCheck) this.gameState.currentLevel = this.gameState.maxLevel;

        if (this.hud.statsPanel) this.hud.statsPanel.classList.remove('hidden');
        this.saveData();
        this.loadLevel(this.gameState.currentLevel);
    }

    async loadLevel(levelNum) {
        this.showScreen('game');
        this.levelContainer.innerHTML = `
            <div class="h-full w-full flex flex-col items-center justify-center text-muted animate-pulse">
                <iconify-icon icon="solar:hourglass-line-linear" class="text-4xl mb-2"></iconify-icon>
                <span>Loading Mission Data...</span>
            </div>
        `;

        try {
            const module = await import(`./levels/level${levelNum}.js`);
            this.levelContainer.innerHTML = '';

            this.currentLevelModule = module.default;

            const wrapper = document.createElement('div');
            wrapper.className = "w-full h-full overflow-y-auto p-4 md:p-8 relative level-wrapper";
            this.levelContainer.appendChild(wrapper);

            module.default.init(wrapper, this);
            this.startLevelTimer();

        } catch (error) {
            console.error(error);
            this.levelContainer.innerHTML = `<div class="p-8 text-center text-rose">Error Loading Level: ${error.message}</div>`;
        }
    }

    renderLevelSelect() {
        const list = document.getElementById('mission-list');
        list.innerHTML = '';
        const totalLevels = 8;

        for (let i = 1; i <= totalLevels; i++) {
            const isLocked = i > this.gameState.maxLevel;
            const btn = document.createElement('div');

            // Vanilla CSS Classes
            let baseClass = "relative overflow-hidden rounded-xl p-5 border transition-all cursor-pointer shadow-lg hover:shadow-xl ";
            if (isLocked) baseClass += "bg-dark border-subtle opacity-60 grayscale cursor-not-allowed";
            else baseClass += "glass-panel border-subtle hover:border-focus bg-panel";

            btn.className = baseClass;
            btn.innerHTML = `
                <div class="flex items-start justify-between mb-4">
                     <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl border ${isLocked ? 'bg-dark border-subtle text-muted' : 'bg-indigo-900/20 border-focus text-indigo'}">
                        <iconify-icon icon="${isLocked ? 'solar:lock-keyhole-linear' : 'solar:code-square-linear'}"></iconify-icon>
                    </div>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-white mb-1">${this.getText('LBL_LEVEL')} ${i}</h4>
                    <p class="text-xs text-muted">${isLocked ? this.getText('LBL_LOCKED') : this.getText('L' + i + '_TITLE') || 'Ready'}</p>
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

    completeLevel(results) {
        this.stopLevelTimer();
        this.gameState.score += (results.score || 0);
        this.gameState.xp += (results.xp || 100);

        if (results.success && this.gameState.currentLevel === this.gameState.maxLevel) {
            this.gameState.maxLevel++;
        }
        this.saveData();

        const outcomeEl = document.getElementById('mission-outcome');
        outcomeEl.innerText = this.getText(results.success ? 'RES_SUCCESS' : 'RES_FAIL');

        // Note: Gradient text classes in vanilla needed? 
        // We defined .text-main, but for gradients we might keep Tailwind utils in style.css or add to utils.css
        // For now, let's just set color.
        outcomeEl.className = results.success ? "text-3xl font-extrabold text-emerald mb-6" : "text-3xl font-extrabold text-rose mb-6";

        document.getElementById('res-accuracy').innerText = (results.accuracy || 0) + '%';
        document.getElementById('res-time').innerText = '+' + (results.timeBonus || 0);
        document.getElementById('res-xp').innerText = this.gameState.xp;

        this.showScreen('results');
    }

    nextLevel() {
        this.gameState.currentLevel++;
        if (this.gameState.currentLevel > 8) {
            this.showFeedback("CAMPAIGN COMPLETE", "You have completed all missions.");
            this.showScreen('select');
            return;
        }
        this.loadLevel(this.gameState.currentLevel);
    }

    /* Timers & Modals */
    startLevelTimer() {
        this.stopLevelTimer();
        this.levelStartTime = Date.now();
        this.timerInterval = setInterval(() => { if (!this.isPaused) this.updateTimerDisplay(); }, 1000);
        this.updateTimerDisplay();
    }

    stopLevelTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    updateTimerDisplay() {
        if (!this.levelStartTime) return;
        const elapsed = Math.floor((Date.now() - this.levelStartTime) / 1000);
        const min = Math.floor(elapsed / 60);
        const sec = elapsed % 60;
        if (this.hud.timer) this.hud.timer.innerText = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    togglePause() {
        if (this.screens.game.classList.contains('hidden')) return;
        this.isPaused = !this.isPaused;
        const pm = document.getElementById('pause-modal');
        if (this.isPaused) pm.classList.remove('hidden');
        else pm.classList.add('hidden');
    }

    quitToMenu() {
        this.togglePause();
        this.stopLevelTimer();
        this.showScreen('intro');
    }

    showFeedback(title, msg) {
        document.getElementById('feedback-title').innerText = title;
        document.getElementById('feedback-msg').innerHTML = msg;
        this.toggleModal(true);
    }

    toggleModal(show) {
        const el = document.getElementById('feedback-modal');
        const ov = document.getElementById('overlay');
        if (show) { el.classList.remove('hidden'); ov.classList.remove('hidden'); }
        else { el.classList.add('hidden'); ov.classList.add('hidden'); }
    }
}

const game = new GameEngine();
export default game;
