export default class Header {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <header class="h-16 border-b border-white/5 flex items-center justify-between px-6 z-10 bg-slate-950/60 backdrop-blur-md shrink-0 sticky top-0">
                <div class="flex items-center gap-4">
                    <!-- Mobile Menu Trigger -->
                    <button id="btn-mobile-menu" class="lg:hidden w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center active:scale-95 shadow-lg shadow-black/20">
                        <iconify-icon icon="solar:hamburger-menu-bold" class="text-xl"></iconify-icon>
                    </button>

                    <!-- Title/Breadcrumb -->
                    <div class="flex items-center gap-3">
                        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] hidden sm:block"></div>
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block" data-key="HDR_SECTOR">Sector</span>
                        <div class="h-4 w-px bg-slate-800 hidden sm:block"></div>
                        <span class="text-xs font-bold text-white tracking-wide truncate max-w-[120px] md:max-w-none" id="header-mission-title">DASHBOARD</span>
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <!-- Time -->
                    <div class="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                        <iconify-icon icon="solar:clock-circle-linear" class="text-slate-500"></iconify-icon>
                        <span class="text-xs font-mono font-bold text-slate-300" id="header-clock">00:00:00</span>
                    </div>

                    <!-- Pause -->
                    <button id="btn-header-pause" class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all flex items-center justify-center active:scale-95" title="Pause Game">
                        <iconify-icon icon="solar:pause-bold" class="text-lg"></iconify-icon>
                    </button>
                </div>
            </header>
        `;
    }

    attachEvents() {
        document.getElementById('btn-header-pause')?.addEventListener('click', () => {
            this.game.togglePause();
        });

        document.getElementById('btn-mobile-menu')?.addEventListener('click', () => {
            this.game.toggleSidebar(true);
        });

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
            missionEl.innerText = title || 'Dashboard';
            missionEl.classList.add('animate-fade-in');
            setTimeout(() => missionEl.classList.remove('animate-fade-in'), 500);
        }
    }
}
