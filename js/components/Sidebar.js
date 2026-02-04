export default class Sidebar {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <aside class="w-full md:w-64 border-r border-slate-800 bg-slate-900/40 flex flex-col justify-between h-auto md:h-screen shrink-0 z-20 transition-all duration-300 glass-panel" id="main-sidebar">
                <div class="overflow-y-auto flex-1 scanlines custom-scrollbar">
                    <!-- Logo Area -->
                    <div class="p-6 flex items-center gap-3 border-b border-slate-800/50 relative overflow-hidden group">
                        <div class="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black tracking-tighter shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/30">
                            IQ
                        </div>
                        <div class="relative z-10">
                            <h1 class="text-sm font-black tracking-widest text-white leading-none mb-1" data-key="INTRO_TITLE_TOP">ICT QUEST</h1>
                            <p class="text-[9px] uppercase font-bold text-indigo-400 tracking-[0.3em] opacity-70" data-key="INTRO_TITLE_SUB">Terminal v3.0</p>
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="p-4 space-y-2" id="sidebar-nav">
                        <div class="px-3 mb-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]" data-key="SB_NAV_TITLE">${this.game.getText('SB_NAV_TITLE')}</div>
                        
                        <button id="nav-map" data-screen="select" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold text-left group border border-transparent hover:border-slate-700/50">
                            <iconify-icon icon="solar:map-point-wave-bold" class="text-xl group-hover:scale-110 group-hover:text-indigo-400 transition-all"></iconify-icon>
                            <span data-key="MENU_TITLE_SELECT" class="tracking-wide">${this.game.getText('MENU_TITLE_SELECT')}</span>
                        </button>
                        
                        <button id="nav-profile" data-screen="intro" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold text-left group border border-transparent hover:border-slate-700/50">
                            <iconify-icon icon="solar:shield-user-bold" class="text-xl group-hover:scale-110 group-hover:text-indigo-400 transition-all"></iconify-icon>
                            <span data-key="MENU_TITLE_PROFILE" class="tracking-wide">${this.game.getText('MENU_TITLE_PROFILE')}</span>
                        </button>
                    </nav>

                    <!-- Language Switcher -->
                    <div class="px-4 mt-8">
                        <div class="px-3 mb-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]" data-key="SB_LANG_TITLE">${this.game.getText('SB_LANG_TITLE')}</div>
                        <div class="flex p-1 bg-slate-950/50 rounded-xl border border-slate-800/50 gap-1">
                            <button id="lang-en" class="lang-btn flex-1 py-2 text-[10px] font-black rounded-lg transition-all tracking-widest uppercase">EN</button>
                            <button id="lang-si" class="lang-btn flex-1 py-2 text-[10px] font-black rounded-lg transition-all tracking-widest uppercase">සිං</button>
                        </div>
                    </div>
                </div>

                <!-- User Stats (HUD Style) -->
                <div class="p-6 border-t border-slate-800/50 bg-slate-950/30 hidden" id="user-stats-panel">
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <div class="w-12 h-12 rounded-full border-2 border-indigo-500/30 p-1">
                                    <div class="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)] overflow-hidden">
                                        <iconify-icon icon="solar:user-bold" class="text-2xl"></iconify-icon>
                                    </div>
                                </div>
                                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full border-2 border-slate-900 flex items-center justify-center text-[8px] font-black text-white shadow-lg" id="hud-level-sm">1</div>
                            </div>
                            <div class="flex-1 overflow-hidden">
                                <span class="text-[9px] font-black text-slate-500 uppercase tracking-tighter block mb-0.5" data-key="SB_AGENT_LBL">${this.game.getText('SB_AGENT_LBL')}</span>
                                <span class="text-xs font-black text-white tracking-wider truncate block" id="hud-player-name">Agent</span>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <div class="flex justify-between items-center text-[9px] font-black text-slate-500 tracking-widest uppercase">
                                <span data-key="SB_XP_LBL">${this.game.getText('SB_XP_LBL')}</span>
                                <span class="text-indigo-400" id="hud-xp-val">0</span>
                            </div>
                            <div class="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                                <div class="h-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" id="hud-xp-bar" style="width: 5%; transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                            </div>
                        </div>
                        
                        <div class="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10 flex justify-between items-center group/score">
                            <span class="text-[9px] text-slate-500 uppercase font-black tracking-widest group-hover/score:text-indigo-400 transition-colors" data-key="SB_SCORE">${this.game.getText('SB_SCORE')}</span>
                            <span class="text-xs font-mono font-black text-white" id="hud-score-val">0</span>
                        </div>
                    </div>
                </div>
            </aside>
            
            <style>
                .nav-item.active {
                    background: rgba(99, 102, 241, 0.1);
                    border-left: 3px solid #6366f1;
                    color: white;
                    padding-left: 13px !important;
                }
                .nav-item.active iconify-icon {
                    color: #818cf8;
                    filter: drop-shadow(0 0 5px rgba(129, 140, 248, 0.5));
                }
                .lang-btn {
                    color: #64748b;
                    background: transparent;
                }
                .lang-btn:hover {
                    color: #94a3b8;
                    background: rgba(255,255,255,0.02);
                }
                .lang-btn.active {
                    background: #6366f1;
                    color: white;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 10px;
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
        if (levelVal) levelVal.innerText = gameState.currentLevel;

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
