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

                <div class="z-10 text-center flex flex-col items-center gap-8 p-6">
                    
                    <div class="flex flex-col items-center gap-4">
                        <div class="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.15)] mb-4 border border-slate-800">
                            <span class="text-4xl font-bold text-white tracking-tighter">IQ</span>
                        </div>
                        <h1 class="text-4xl md:text-6xl font-bold text-white tracking-tight">ICT QUEST</h1>
                        <p class="text-lg text-slate-400 max-w-md">Master the digital realm. Learn Hardware, Networking, and Logic in a cyber-simulation.</p>
                    </div>

                    <div class="flex flex-col gap-4 w-full max-w-xs">
                        <button id="btn-start-game" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 text-lg">
                            <iconify-icon icon="solar:play-circle-bold" class="text-2xl"></iconify-icon>
                            <span>ENTER SIMULATION</span>
                        </button>

                        <button id="btn-settings" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-all border border-slate-700 flex items-center justify-center gap-2 text-lg">
                            <iconify-icon icon="solar:settings-linear" class="text-xl"></iconify-icon>
                            <span>SETTINGS</span>
                        </button>
                    </div>

                    <div class="text-xs text-slate-600 font-mono mt-8">
                        v2.1.0 • SECURE CONNECTION ESTABLISHED
                    </div>

                </div>
            </div>
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
