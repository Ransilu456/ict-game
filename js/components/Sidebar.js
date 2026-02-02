export default class Sidebar {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <aside class="w-full md:w-64 border-r border-slate-800 bg-slate-900/40 flex flex-col justify-between h-auto md:h-screen shrink-0 z-20 transition-all duration-300" id="main-sidebar">
                <div>
                    <!-- Logo Area -->
                    <div class="p-6 flex items-center gap-3 border-b border-slate-800/50">
                        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-950 font-semibold tracking-tighter shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            IQ
                        </div>
                        <div>
                            <h1 class="text-sm font-semibold tracking-tight text-white" data-key="INTRO_TITLE_TOP">ICT QUEST</h1>
                            <p class="text-xs text-slate-500" data-key="INTRO_TITLE_SUB">Cyber City Portal</p>
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="p-4 space-y-1">
                        <button id="nav-map" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all text-sm font-medium text-left">
                            <iconify-icon icon="solar:gamepad-linear" class="text-lg"></iconify-icon>
                            <span data-key="MENU_TITLE_SELECT">Campaign Map</span>
                        </button>
                        <button id="nav-profile" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all text-sm font-medium text-left">
                            <iconify-icon icon="solar:user-circle-linear" class="text-lg"></iconify-icon>
                            <span data-key="MENU_TITLE_PROFILE">Profile / Login</span>
                        </button>

                        <!-- Language Toggle -->
                        <div class="pt-4 mt-4 border-t border-slate-800/50">
                            <div class="flex gap-2 px-3">
                                <button id="lang-en" class="text-xs font-mono px-2 py-1 rounded border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">EN</button>
                                <button id="lang-si" class="text-xs font-mono px-2 py-1 rounded border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">සිං</button>
                            </div>
                        </div>
                    </nav>
                </div>

                <!-- User Stats -->
                <div class="p-4 border-t border-slate-800/50 bg-slate-900/20 hidden" id="user-stats-panel">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-semibold border border-indigo-500/30">
                            <span data-key="SB_ID">ID</span>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-end mb-1">
                                <span class="text-xs font-medium text-slate-300" id="hud-player-name">Agent</span>
                                <span class="text-xs text-indigo-400 font-mono" id="hud-level-sm">Lvl 1</span>
                            </div>
                            <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-indigo-500 w-[0%]" id="hud-xp-bar" style="transition: width 0.5s;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mt-4">
                        <div class="glass-panel p-2 rounded flex flex-col items-center">
                            <span class="text-xs text-slate-500" data-key="SB_XP">XP</span>
                            <span class="text-sm font-semibold text-white tracking-tight" id="hud-xp-val">0</span>
                        </div>
                        <div class="glass-panel p-2 rounded flex flex-col items-center">
                            <span class="text-xs text-slate-500" data-key="SB_SCORE">Score</span>
                            <span class="text-sm font-semibold text-white tracking-tight" id="hud-score-val">0</span>
                        </div>
                    </div>
                </div>
            </aside>
        `;

    }

    attachEvents() {
        // App.js usually handles global nav, but we can bind simple clicks here if we pass callbacks
        // For now, we rely on IDs matching what app.js expects, OR we rewrite app.js to use this class logic.
        // Let's keep it simple: App.js will attach listeners to these IDs after render.

        document.getElementById('nav-map')?.addEventListener('click', () => this.game.showScreen('select'));
        document.getElementById('nav-profile')?.addEventListener('click', () => this.game.showScreen('intro'));

        document.getElementById('lang-en')?.addEventListener('click', () => window.setLang('en'));
        document.getElementById('lang-si')?.addEventListener('click', () => window.setLang('si'));
    }
}
