export default class Sidebar {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <aside class="w-full md:w-64 border-r border-slate-800 bg-slate-900/40 flex flex-col justify-between h-auto md:h-screen shrink-0 z-20 transition-all duration-300" id="main-sidebar">
                <div class="overflow-y-auto flex-1">
                    <!-- Logo Area -->
                    <div class="p-6 flex items-center gap-3 border-b border-slate-800/50">
                        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-950 font-semibold tracking-tighter shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            IQ
                        </div>
                        <div>
                            <h1 class="text-sm font-semibold tracking-tight text-white" data-key="INTRO_TITLE_TOP">ICT QUEST</h1>
                            <p class="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]" data-key="INTRO_TITLE_SUB">Cyber City</p>
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="p-4 space-y-1" id="sidebar-nav">
                        <button id="nav-map" data-screen="select" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all text-sm font-medium text-left group">
                            <iconify-icon icon="solar:gamepad-linear" class="text-lg group-hover:scale-110 transition-transform"></iconify-icon>
                            <span data-key="MENU_TITLE_SELECT">Campaign Map</span>
                        </button>
                        <button id="nav-profile" data-screen="intro" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all text-sm font-medium text-left group">
                            <iconify-icon icon="solar:user-circle-linear" class="text-lg group-hover:scale-110 transition-transform"></iconify-icon>
                            <span data-key="MENU_TITLE_PROFILE">Profile / Login</span>
                        </button>

                        <div class="pt-4 mt-4 border-t border-slate-800/50">
                            <div class="px-3 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest" data-key="LBL_LANGUAGE">Language</div>
                            <div class="flex gap-2 px-3">
                                <button id="lang-en" class="lang-btn text-xs font-mono px-2 py-1 rounded border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all">EN</button>
                                <button id="lang-si" class="lang-btn text-xs font-mono px-2 py-1 rounded border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all">සිං</button>
                            </div>
                        </div>
                    </nav>
                </div>

                <!-- User Stats -->
                <div class="p-4 border-t border-slate-800/50 bg-slate-900/40 hidden" id="user-stats-panel">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-semibold border border-indigo-500/20 shadow-inner">
                            <iconify-icon icon="solar:shield-user-bold" class="text-xl"></iconify-icon>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-end mb-1">
                                <span class="text-xs font-bold text-white tracking-wide truncate max-w-[80px]" id="hud-player-name">Agent</span>
                                <span class="text-[10px] text-indigo-400 font-mono font-bold px-1.5 py-0.5 bg-indigo-500/10 rounded" id="hud-level-sm">LVL 1</span>
                            </div>
                            <div class="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                                <div class="h-full bg-gradient-to-r from-indigo-500 to-blue-400 w-[5%] shadow-[0_0_10px_rgba(79,70,229,0.5)]" id="hud-xp-bar" style="transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2">
                        <div class="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 flex flex-col items-center">
                            <span class="text-[9px] text-slate-500 uppercase font-black tracking-tighter" data-key="SB_XP">XP</span>
                            <span class="text-xs font-mono font-bold text-white" id="hud-xp-val">0</span>
                        </div>
                        <div class="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 flex flex-col items-center">
                            <span class="text-[9px] text-slate-500 uppercase font-black tracking-tighter" data-key="SB_SCORE">Score</span>
                            <span class="text-xs font-mono font-bold text-white" id="hud-score-val">0</span>
                        </div>
                    </div>
                </div>
            </aside>
            
            <style>
                .nav-item.active {
                    background: rgba(79, 70, 229, 0.1);
                    border-right: 2px solid #6366f1;
                    color: white;
                }
                .nav-item.active iconify-icon {
                    color: #818cf8;
                }
                .lang-btn.active {
                    border-color: #6366f1;
                    background: rgba(79, 70, 229, 0.2);
                    color: white;
                }
            </style>
        `;
    }

    attachEvents() {
        document.getElementById('nav-map')?.addEventListener('click', () => this.game.showScreen('select'));
        document.getElementById('nav-profile')?.addEventListener('click', () => this.game.showScreen('intro'));

        document.getElementById('lang-en')?.addEventListener('click', () => window.setLang('en'));
        document.getElementById('lang-si')?.addEventListener('click', () => window.setLang('si'));
    }

    update(gameState, currentScreen) {
        // Update Stats
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
        if (nameVal) nameVal.innerText = gameState.playerName || 'Agent';
        if (levelVal) levelVal.innerText = `LVL ${gameState.currentLevel}`;

        // Update Active Nav
        document.querySelectorAll('.nav-item').forEach(btn => {
            if (btn.dataset.screen === currentScreen) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Update active Lang
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.id === `lang-${gameState.lang}`) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
}
