/**
 * ICT Quest - Main Game Engine
 * Refactored for Component Architecture
 */

import { LANG } from './lang.js';
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import LandingPage from './components/LandingPage.js';
import ResultSummary from './components/ResultSummary.js';


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

        // Session Auto-Redirect or Show Landing
        if (this.gameState.playerName) {
            this.startGame(true); // Jump to last level / map
            this.checkResume();
        } else {
            this.showLanding();
        }
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
            landing: document.getElementById('landing-container'),

        };

        // HUD (Common game elements, not component internals)
        this.hud = {
            level: document.getElementById('hud-level'),
            score: document.getElementById('hud-score'),
            timer: document.getElementById('hud-timer'),
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

        // Mobile Sidebar Backdrop Click
        this.overlay?.addEventListener('click', () => this.toggleSidebar(false));
    }

    toggleSidebar(forceState) {
        const sidebar = document.getElementById('main-sidebar');
        const isCurrentlyActive = sidebar?.classList.contains('active');
        const nextState = forceState !== undefined ? forceState : !isCurrentlyActive;

        if (nextState) {
            sidebar?.classList.add('active');
        } else {
            sidebar?.classList.remove('active');
        }
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
        this.currentScreen = screenName;

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
            this.header.updateMission('Sector Map');
        } else if (screenName === 'intro') {
            this.header.updateMission('Authentication');
        }

        this.updateHUD();
    }

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
                if (data.lang) this.gameState.lang = data.lang;

                if (this.gameState.playerName) {
                    const el = document.getElementById('player-name');
                    if (el) el.value = this.gameState.playerName;
                }
            } catch (e) {
                console.error("Failed to load game data:", e);
            }
        }
    }

    checkResume() {
        if (this.gameState.playerName) {
            if (this.hud.statsPanel) {
                this.hud.statsPanel.classList.remove('hidden');
            }
            this.updateHUD();
        }
    }

    /* Logic (Same as before) */
    setLanguage(langCode) {
        if (this.gameState.lang === langCode) return;
        this.gameState.lang = langCode;
        this.saveData(); // Persist language choice
        this.updateUIText();

        // Refresh Current Screen if needed
        if (this.currentScreen === 'landing') {
            this.showLanding();
        } else if (this.currentScreen === 'game' && this.currentLevelModule) {
            this.currentLevelModule.render();
            if (this.currentLevelModule.attachEvents) this.currentLevelModule.attachEvents();
        } else if (this.currentScreen === 'select') {
            this.renderLevelSelect();
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

        // Delegate to Components
        this.sidebar.update(this.gameState, this.currentScreen);
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
            if (name.toUpperCase() === 'ADMIN') this.gameState.maxLevel = 16;
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

            // Update Header Mission Context
            const levelTitle = this.getText(`L${levelNum}_TITLE`);
            this.header.updateMission(levelTitle);

        } catch (error) {
            console.error(error);
            this.levelContainer.innerHTML = `<div class="p-8 text-center text-rose">Error Loading Level: ${error.message}</div>`;
        }
    }

    renderLevelSelect() {
        const list = document.getElementById('mission-list');
        list.innerHTML = '';

        const categories = [
            { name: 'Core Foundations', levels: [1, 2, 3, 4], icon: 'solar:cpu-bold', color: 'indigo' },
            { name: 'Systems & Data', levels: [5, 6, 7, 8], icon: 'solar:database-bold', color: 'blue' },
            { name: 'Cloud & Cyber', levels: [9, 10, 11, 12], icon: 'solar:shield-keyhole-bold', color: 'emerald' },
            { name: 'Advanced Mastery', levels: [13, 14, 15, 16], icon: 'solar:fire-bold', color: 'rose' }
        ];

        categories.forEach(cat => {
            const catHeader = document.createElement('div');
            catHeader.className = "col-span-full mt-12 mb-6 flex items-center gap-4 animate-fade-in";
            catHeader.innerHTML = `
                <div class="p-3 rounded-2xl bg-${cat.color}-500/10 border border-${cat.color}-500/20 text-${cat.color}-400 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                    <iconify-icon icon="${cat.icon}" class="text-2xl"></iconify-icon>
                </div>
                <div class="flex-1">
                    <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-40 mb-1">${cat.name}</h3>
                    <div class="h-px bg-gradient-to-r from-${cat.color}-500/30 to-transparent w-full"></div>
                </div>
            `;
            list.appendChild(catHeader);

            cat.levels.forEach(i => {
                const isLocked = i > this.gameState.maxLevel;
                const difficulty = Math.ceil(i / 3);
                const btn = document.createElement('div');

                let baseClass = "relative overflow-hidden rounded-[2.5rem] p-8 border-2 transition-all cursor-pointer group/card animate-fade-in ";
                if (isLocked) {
                    baseClass += "bg-slate-900/40 border-slate-800/50 opacity-40 grayscale pointer-events-none";
                } else {
                    baseClass += `bg-slate-900/60 border-slate-800/80 hover:border-${cat.color}-500/50 hover:bg-slate-800/60 shadow-2xl hover:shadow-${cat.color}-500/10`;
                }

                btn.className = baseClass + " isometric-card";
                btn.innerHTML = `
                    <div class="absolute inset-0 bg-gradient-to-br from-${cat.color}-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    
                    <div class="relative z-10">
                        <div class="flex items-start justify-between mb-8">
                            <div class="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-3xl border-2 ${isLocked ? 'bg-slate-950/80 border-slate-800 text-slate-700' : `bg-${cat.color}-500/10 border-${cat.color}-500/20 text-${cat.color}-400 shadow-[0_0_20px_rgba(0,0,0,0.4)] group-hover/card:scale-110 transition-transform`}">
                                <iconify-icon icon="${isLocked ? 'solar:lock-bold' : 'solar:play-circle-bold'}"></iconify-icon>
                            </div>
                            <div class="flex gap-1 pt-2">
                                ${Array(5).fill(0).map((_, idx) => `
                                    <div class="w-1.5 h-1.5 rounded-full ${idx < difficulty ? `bg-${cat.color}-500 shadow-[0_0_8px_${cat.color}]` : 'bg-slate-800'}"></div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-[9px] font-black text-slate-500 bg-slate-950/80 px-2 py-1 rounded-lg uppercase tracking-widest border border-slate-800 group-hover/card:border-${cat.color}-500/30 transition-colors">SECTOR ${String(i).padStart(2, '0')}</span>
                            </div>
                            <h4 class="text-lg font-black text-white group-hover/card:text-${cat.color}-300 transition-colors truncate tracking-tight uppercase">${isLocked ? 'CLASSIFIED' : this.getText('L' + i + '_TITLE').replace('MISSION:', '').trim()}</h4>
                        </div>
                    </div>


                    <!-- Decorative elements -->
                    <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-${cat.color}-500/5 rounded-full blur-2xl group-hover/card:bg-${cat.color}-500/10 transition-colors"></div>
                `;

                if (!isLocked) {
                    btn.onclick = () => {
                        this.gameState.currentLevel = i;
                        this.startGame(true);
                    };
                }
                list.appendChild(btn);
            });
        });
    }


    completeLevel(results) {
        this.stopLevelTimer();
        this.gameState.score += (results.score || 0);
        this.gameState.xp += (results.xp || 100);

        if (results.success && this.gameState.currentLevel === this.gameState.maxLevel) {
            this.gameState.maxLevel++;
        }
        this.saveData();

        // Check if we have detailed results for the new summary view
        if (results.detailedResults) {
            this.showResultSummary(results);
        } else {
            // Legacy Result View
            const outcomeEl = document.getElementById('mission-outcome');
            outcomeEl.innerText = this.getText(results.success ? 'RES_SUCCESS' : 'RES_FAIL');

            outcomeEl.className = results.success
                ? "text-3xl font-extrabold text-emerald-400 mb-6 neon-text-emerald"
                : "text-3xl font-extrabold text-rose-500 mb-6 neon-text-rose";

            document.getElementById('res-accuracy').innerText = (results.accuracy || 0) + '%';
            document.getElementById('res-time').innerText = '+' + (results.timeBonus || 0);
            document.getElementById('res-xp').innerText = this.gameState.xp;

            this.showScreen('results');
        }
    }

    showResultSummary(results) {
        this.showScreen('results');
        // Clear legacy content overrides or use a container
        // Since we want to replace the hardcoded HTML with our component:
        this.screens.results.innerHTML = ''; // Wipe clean

        const summary = new ResultSummary({
            results: results.detailedResults,
            onNext: () => this.nextLevel(),
            onRestart: () => {
                this.loadLevel(this.gameState.currentLevel);
            }
        });

        this.screens.results.innerHTML = summary.render();
        summary.attach(this.screens.results);
    }

    nextLevel() {
        this.gameState.currentLevel++;
        if (this.gameState.currentLevel > 16) {
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
        if (this.hud.timer) {
            this.hud.timer.innerText = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
            if (elapsed > 120) {
                this.hud.timer.classList.add('text-rose-500', 'animate-pulse', 'font-black');
            } else {
                this.hud.timer.classList.remove('text-rose-500', 'animate-pulse', 'font-black');
            }
        }
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
        if (show) {
            el.classList.remove('hidden');
            ov.classList.add('active');
            setTimeout(() => {
                el.classList.remove('scale-95');
                el.classList.add('scale-100');
            }, 10);
        } else {
            el.classList.add('scale-95');
            el.classList.remove('scale-100');
            ov.classList.remove('active');
            setTimeout(() => el.classList.add('hidden'), 300);
        }
    }
}

const game = new GameEngine();
export default game;
