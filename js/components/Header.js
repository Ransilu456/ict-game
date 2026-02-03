export default class Header {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <header class="h-16 border-b border-slate-800/50 flex items-center justify-between px-6 z-10 bg-slate-950/40 backdrop-blur-md shrink-0 relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent pointer-events-none"></div>
                
                <div class="flex items-center gap-12 relative z-10">
                    <div>
                        <div class="flex items-center gap-2 mb-0.5">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                            <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em] leading-none" id="header-title" data-key="INTRO_TITLE_TOP">ICT QUEST</h2>
                        </div>
                        <span class="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em] opacity-80" data-key="HDR_LINK">Link Established</span>
                    </div>

                    <div class="hidden md:flex flex-col border-l border-slate-800/50 pl-10 relative">
                        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500/20 rounded-full"></div>
                        <span class="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em] mb-1" data-key="HDR_SECTOR">Active Sector</span>
                        <span class="text-[11px] font-mono text-indigo-400 font-extrabold tracking-widest uppercase" id="header-mission-title" data-key="HDR_BOOTING">BOOTING...</span>
                    </div>
                </div>

                <div class="flex items-center gap-8 relative z-10">
                    <div class="hidden sm:flex flex-col items-end border-r border-slate-800/50 pr-8">
                        <span class="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em] mb-1" data-key="HDR_TIME">Local Node Time</span>
                        <span class="text-[11px] font-mono text-slate-300 font-black tracking-widest" id="header-clock">00:00:00</span>
                    </div>

                    <button id="btn-header-pause" class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all flex items-center justify-center group relative shadow-lg active:scale-95" title="INTERRUPT SESSION">
                        <iconify-icon icon="solar:pause-circle-bold" class="text-2xl group-hover:scale-110 transition-all"></iconify-icon>
                        <div class="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
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

