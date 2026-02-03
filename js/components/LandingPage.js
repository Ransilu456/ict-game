import ThreeDComponents from './ThreeDComponents.js';

export default class LandingPage {
    constructor(game) {
        this.game = game;
    }

    render() {
        const serverSVG = ThreeDComponents.getServerSVG('#6366f1');
        const cpuSVG = ThreeDComponents.getCPUSVG();

        return `
            <div class="flex flex-col items-center justify-center h-screen w-full relative overflow-hidden animate-fade-in bg-slate-950 scanlines">
                
                <!-- Background Grid with Parallax Effect -->
                <div class="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
                    style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 40px 40px;">
                </div>

                <!-- Glow Orbs -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>

                <div class="z-10 text-center flex flex-col items-center gap-12 p-6 relative max-w-4xl w-full">
                    
                    <!-- Single 3D Centerpiece: The Cyber Core -->
                    <div class="relative w-72 h-72 md:w-96 md:h-96 group transition-transform duration-700 hover:scale-105">
                        <div class="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/15 transition-colors"></div>
                        <div class="relative z-10 w-full h-full animate-float drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                            ${serverSVG}
                        </div>
                    </div>

                    <div class="flex flex-col items-center gap-4">
                        <div class="flex items-center gap-3 mb-2">
                             <div class="h-[2px] w-12 bg-gradient-to-r from-transparent to-indigo-500"></div>
                             <span class="text-xs font-black text-indigo-400 tracking-[0.5em] uppercase" data-key="LP_SYS_STATUS">System Online</span>
                             <div class="h-[2px] w-12 bg-gradient-to-l from-transparent to-indigo-500"></div>
                        </div>
                        <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter m-0 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 neon-text-indigo">
                            ICT QUEST
                        </h1>
                        <p class="text-slate-400 max-w-md mt-2 font-mono text-sm tracking-widest uppercase opacity-70" data-key="LP_DESC">
                            Deep Dive into Cyber Architecture
                        </p>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6 w-full max-w-lg mt-4">
                        <button id="btn-start-game" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-3 text-xl group overflow-hidden relative active:scale-95">
                            <span class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            <iconify-icon icon="solar:bolt-bold" class="text-2xl"></iconify-icon>
                            <span class="relative z-10" data-key="LP_BTN_BOOT">INITIATE BOOT</span>
                        </button>

                        <button id="btn-settings" class="flex-1 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold py-5 px-8 rounded-2xl transition-all border border-slate-800 flex items-center justify-center gap-3 text-xl backdrop-blur-md hover:border-indigo-500/50 active:scale-95">
                            <iconify-icon icon="solar:settings-minimalistic-bold" class="text-2xl"></iconify-icon>
                            <span data-key="LP_BTN_CONFIG">CORE CONFIG</span>
                        </button>
                    </div>

                    <!-- System Status Ticker -->
                    <div class="mt-8 pt-8 border-t border-slate-800/50 w-full flex flex-wrap justify-center gap-8 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span data-key="LP_STAT_SATELLITE">Satellite: Active</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span data-key="LP_STAT_UPLINK">Uplink: Secure</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span>v3.0.0_STABLE</span>
                        </div>
                    </div>

                </div>
            </div>

            <style>
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(15px) rotate(-5deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
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

        container.querySelector('#btn-settings')?.addEventListener('click', () => {
            this.game.showScreen('intro'); // For now, both go to intro/name input
        });
    }
}
