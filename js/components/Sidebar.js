export default class Sidebar {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <aside class="w-full md:w-64 border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col justify-between h-auto md:h-screen shrink-0 z-20 transition-all duration-300 left-0 top-0 fixed md:relative" id="main-sidebar">
                <div class="overflow-y-auto flex-1 custom-scrollbar">
                    <!-- Logo Area -->
                    <div class="p-6 flex items-center gap-3 border-b border-slate-800/50">
                        <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                            IQ
                        </div>
                        <div class="flex-1">
                            <h1 class="text-sm font-bold tracking-widest text-white leading-none mb-1">ICT QUEST</h1>
                            <p class="text-[10px] font-mono text-slate-500 tracking-wider">v3.0.0 Stable</p>
                        </div>
                        
                        <!-- Mobile Close -->
                        <button id="btn-sidebar-close" class="md:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                            <iconify-icon icon="solar:close-circle-bold" class="text-xl"></iconify-icon>
                        </button>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="p-4 space-y-1" id="sidebar-nav">
                        <div class="px-3 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-70" data-key="SB_NAV_TITLE">${this.game.getText('SB_NAV_TITLE')}</div>
                        
                        <button id="nav-map" data-screen="select" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium text-left group">
                            <iconify-icon icon="solar:map-point-wave-bold" class="text-lg group-hover:text-indigo-400 transition-colors"></iconify-icon>
                            <span data-key="MENU_TITLE_SELECT">${this.game.getText('MENU_TITLE_SELECT')}</span>
                        </button>
                        
                        <button id="nav-profile" data-screen="intro" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium text-left group">
                            <iconify-icon icon="solar:user-circle-bold" class="text-lg group-hover:text-indigo-400 transition-colors"></iconify-icon>
                            <span data-key="MENU_TITLE_PROFILE">${this.game.getText('MENU_TITLE_PROFILE')}</span>
                        </button>
                    </nav>

                    <!-- Language Switcher -->
                    <div class="px-4 mt-8">
                        <div class="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-70" data-key="SB_LANG_TITLE">${this.game.getText('SB_LANG_TITLE')}</div>
                        <div class="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
                            <button id="lang-en" class="lang-btn flex-1 py-1.5 text-[10px] font-bold rounded hover:bg-slate-800 text-slate-400 transition-all">EN</button>
                            <button id="lang-si" class="lang-btn flex-1 py-1.5 text-[10px] font-bold rounded hover:bg-slate-800 text-slate-400 transition-all">සිං</button>
                        </div>
                    </div>
                </div>

                <!-- User Stats (Bottom) -->
                <div class="p-6 border-t border-slate-800/50 bg-slate-900/50" id="user-stats-panel">
                     <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                            <iconify-icon icon="solar:user-bold"></iconify-icon>
                        </div>
                        <div class="overflow-hidden">
                            <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Agent</div>
                            <div class="text-sm font-bold text-white truncate" id="hud-player-name">Guest</div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Level <span id="hud-level-sm" class="text-white">1</span></span>
                            <span class="text-indigo-400"><span id="hud-xp-val">0</span> XP</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-indigo-500 transition-all duration-500" id="hud-xp-bar" style="width: 0%"></div>
                        </div>
                         <div class="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                            <span class="text-[10px] font-bold text-slate-500 uppercase">Score</span>
                            <span class="text-sm font-mono font-bold text-white" id="hud-score-val">0</span>
                        </div>
                    </div>
                </div>
            </aside>
            <style>
                .nav-item.active {
                    background: rgba(99, 102, 241, 0.1);
                    color: white;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }
                .nav-item.active iconify-icon {
                    color: #818cf8;
                }
                .lang-btn.active {
                    background: #475569;
                    color: white;
                }
            </style>
        `;
    }

    attachEvents() {
        document.getElementById('nav-map')?.addEventListener('click', () => {
            this.game.showScreen('select');
            if (window.innerWidth <= 1024) this.game.toggleSidebar(false);
        });
        document.getElementById('nav-profile')?.addEventListener('click', () => {
            this.game.showScreen('intro');
            if (window.innerWidth <= 1024) this.game.toggleSidebar(false);
        });

        document.getElementById('btn-sidebar-close')?.addEventListener('click', () => {
            this.game.toggleSidebar(false);
        });

        document.getElementById('lang-en')?.addEventListener('click', () => window.setLang('en'));
        document.getElementById('lang-si')?.addEventListener('click', () => window.setLang('si'));
    }

    update(gameState, currentScreen) {
        const xpBar = document.getElementById('hud-xp-bar');
        const xpVal = document.getElementById('hud-xp-val');
        const scoreVal = document.getElementById('hud-score-val');
        const nameVal = document.getElementById('hud-player-name');
        const levelVal = document.getElementById('hud-level-sm');

        if (xpBar) {
            const progress = (gameState.xp % 2000) / 20;
            xpBar.style.width = `${Math.min(100, Math.max(5, progress))}%`;
        }
        if (xpVal) xpVal.innerText = gameState.xp;
        if (scoreVal) scoreVal.innerText = gameState.score;
        if (nameVal) nameVal.innerText = gameState.playerName || 'Guest';
        if (levelVal) levelVal.innerText = gameState.currentLevel;

        document.querySelectorAll('.nav-item').forEach(btn => {
            if (btn.dataset.screen === currentScreen) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.id === `lang-${gameState.lang}`) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
}
