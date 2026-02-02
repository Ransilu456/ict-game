export default class LandingPage {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <div class="flex flex-col items-center justify-center h-screen w-full relative overflow-hidden animate-fade-in bg-slate-950">
                
                <!-- Background Grid -->
                <div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                    style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 50px 50px;">
                </div>

                <!-- Sonar Scan Effect -->
                <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
                    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan"></div>
                </div>

                <div class="z-10 text-center flex flex-col items-center gap-8 p-6 relative">
                    
                    <!-- Decorative Particles (CSS purely) -->
                    <div class="absolute -top-20 -left-20 w-40 h-40 bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
                    <div class="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>

                    <div class="flex flex-col items-center gap-6 group">
                        <div class="w-28 h-28 bg-slate-900 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.2)] mb-2 border border-slate-800 transition-all duration-500 group-hover:scale-105 group-hover:border-indigo-500/50 relative overflow-hidden">
                             <!-- Pulse ring -->
                            <div class="absolute inset-0 border-2 border-indigo-500/20 rounded-3xl animate-ping opacity-20"></div>
                            <span class="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">IQ</span>
                        </div>
                        <div>
                            <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter m-0 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">ICT QUEST</h1>
                            <p class="text-sm md:text-base text-slate-500 max-w-md mt-4 font-medium uppercase tracking-[0.2em]" data-key="INTRO_TITLE_SUB">Cyber City Portal</p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 w-full max-w-xs mt-4">
                        <button id="btn-start-game" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 text-lg group overflow-hidden relative">
                            <span class="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            <iconify-icon icon="solar:bolt-bold" class="text-2xl group-hover:rotate-12 transition-transform"></iconify-icon>
                            <span>INITIALIZE SESSION</span>
                        </button>

                        <button id="btn-settings" class="w-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold py-4 rounded-xl transition-all border border-slate-800 flex items-center justify-center gap-3 text-lg backdrop-blur-md">
                            <iconify-icon icon="solar:settings-minimalistic-bold" class="text-xl"></iconify-icon>
                            <span>SYSTEM CONFIG</span>
                        </button>
                    </div>

                    <!-- Ticker Feed -->
                    <div class="w-full max-w-md overflow-hidden h-6 mt-4 relative">
                        <div class="flex gap-8 whitespace-nowrap animate-ticker text-[10px] font-mono text-indigo-500/60 uppercase tracking-widest">
                            <span>> Secure link established...</span>
                            <span>> Encrypting data streams...</span>
                            <span>> Monitoring neural activity...</span>
                            <span>> Loading core modules...</span>
                            <span>> Ready for transmission...</span>
                        </div>
                    </div>

                    <div class="text-[10px] text-slate-700 font-mono tracking-widest">
                        EST. 2024 // VERSION 3.0.0_ALPHA
                    </div>

                </div>
            </div>

            <style>
                @keyframes scan {
                    from { transform: translateY(0); }
                    to { transform: translateY(100vh); }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
                @keyframes ticker {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-ticker {
                    animation: ticker 15s linear infinite;
                }
            </style>
        `;

    }


    attachEvents(container) {
        const btnStart = container.querySelector('#btn-start-game');
        if (btnStart) {
            btnStart.addEventListener('click', () => {
                this.game.showScreen('intro'); // Go to Name Input
            });
        }
    }
}
