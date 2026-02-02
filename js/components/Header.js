export default class Header {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <header class="h-16 border-b border-slate-800 flex items-center justify-between px-6 z-10 bg-slate-950/80 backdrop-blur-sm shrink-0">
                <div class="flex items-center gap-8">
                    <div>
                        <h2 class="text-base font-semibold text-white tracking-tight" id="header-title" data-key="INTRO_TITLE_TOP">Mission Control</h2>
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                            <span class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest leading-none">System Online</span>
                        </div>
                    </div>

                    <div class="hidden md:flex flex-col border-l border-slate-800 pl-8">
                        <span class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Current Area</span>
                        <span class="text-xs font-mono text-indigo-400 font-bold" id="header-mission-title">Initializing...</span>
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <div class="hidden sm:flex flex-col items-end border-r border-slate-800 pr-6">
                        <span class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">System Clock</span>
                        <span class="text-xs font-mono text-slate-300 font-bold" id="header-clock">00:00:00</span>
                    </div>

                    <button id="btn-header-pause" class="p-2 text-slate-400 hover:text-white transition-colors relative group" title="Pause Game">
                        <iconify-icon icon="solar:pause-circle-linear" class="text-2xl group-hover:scale-110 transition-transform"></iconify-icon>
                    </button>
                </div>
            </header>
        `;
    }

    attachEvents() {
        document.getElementById('btn-header-pause')?.addEventListener('click', () => {
            this.game.togglePause();
        });

        // Start Clock
        this.updateClock();
        this.clockInterval = setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const clockEl = document.getElementById('header-clock');
        if (clockEl) {
            const now = new Date();
            clockEl.innerText = now.toTimeString().split(' ')[0];
        }
    }

    updateMission(title) {
        const missionEl = document.getElementById('header-mission-title');
        if (missionEl) {
            missionEl.innerText = title || 'Global Access';
            missionEl.classList.remove('animate-pulse');
            void missionEl.offsetWidth; // Trigger reflow
            missionEl.classList.add('animate-fade-in');
        }
    }
}

