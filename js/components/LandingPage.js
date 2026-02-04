import ThreeDComponents from './ThreeDComponents.js';

export default class LandingPage {
    constructor(game) {
        this.game = game;
    }

    render() {
        const hasSession = !!this.game.gameState.playerName;

        return `
            <div class="flex flex-col items-center justify-center h-screen w-full relative overflow-hidden animate-fade-in bg-slate-950 noise-overlay">
                
                <!-- Background Grid with Subtle Effect -->
                <div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                    style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 40px 40px;">
                </div>

                <!-- Soft Glow Orbs -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>

                <div class="z-10 text-center flex flex-col items-center gap-12 p-6 relative max-w-4xl w-full">
                    
                    <div class="flex flex-col items-center gap-4">
                        <div class="flex items-center gap-3 mb-2">
                             <div class="h-px w-12 bg-indigo-500/30"></div>
                             <span class="text-[10px] font-black text-indigo-400 tracking-[0.6em] uppercase">${this.game.getText('LP_SYS_STATUS')}</span>
                             <div class="h-px w-12 bg-indigo-500/30"></div>
                        </div>
                        <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter m-0 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
                            ICT QUEST
                        </h1>
                        <p class="text-slate-500 max-w-md mt-2 font-mono text-xs tracking-widest uppercase opacity-70">
                            ${this.game.getText('LP_DESC')}
                        </p>
                    </div>

                    <div class="flex flex-col gap-4 w-full max-w-lg mt-4">
                        ${hasSession ? `
                            <button id="btn-resume-session" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-3 text-xl group overflow-hidden relative active:scale-95">
                                <span class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                <iconify-icon icon="solar:user-bold" class="text-2xl"></iconify-icon>
                                <span class="relative z-10 uppercase">RESUME AS ${this.game.gameState.playerName}</span>
                            </button>
                            <button id="btn-start-fresh" class="w-full text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
                                (NOT YOU? START NEW SESSION)
                            </button>
                        ` : `
                            <button id="btn-start-game" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-3 text-xl group overflow-hidden relative active:scale-95">
                                <span class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                <iconify-icon icon="solar:bolt-bold" class="text-2xl"></iconify-icon>
                                <span class="relative z-10">${this.game.getText('LP_BTN_BOOT')}</span>
                            </button>
                        `}
                    </div>

                    <!-- System Status Ticker -->
                    <div class="mt-8 pt-8 border-t border-slate-800/50 w-full flex flex-wrap justify-center gap-8 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span>${this.game.getText('LP_STAT_SATELLITE')}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span>${this.game.getText('LP_STAT_UPLINK')}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span>v3.0.0_STABLE</span>
                        </div>
                    </div>

                </div>
            </div>
            
            <style>
                .animate-float-delayed {
                    animation: float-delayed 5s ease-in-out infinite;
                }
            </style>
        `;
    }

    attachEvents(container) {
        container.querySelector('#btn-start-game')?.addEventListener('click', () => {
            this.game.showScreen('intro');
        });

        container.querySelector('#btn-resume-session')?.addEventListener('click', () => {
            this.game.startGame(true);
        });

        container.querySelector('#btn-start-fresh')?.addEventListener('click', () => {
            this.game.gameState.playerName = '';
            this.game.gameState.xp = 0;
            this.game.gameState.score = 0;
            this.game.gameState.maxLevel = 1;
            this.game.saveData();
            this.game.showScreen('intro');
        });
    }
}
