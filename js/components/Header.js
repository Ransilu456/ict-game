export default class Header {
    constructor(game) {
        this.game = game;
    }

    render() {
        return `
            <header class="h-16 border-b border-slate-800 flex items-center justify-between px-6 z-10 bg-slate-950/80 backdrop-blur-sm shrink-0">
                <div>
                    <h2 class="text-base font-semibold text-white tracking-tight" id="header-title" data-key="INTRO_TITLE_TOP">Mission Control</h2>
                    <div class="flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span class="text-xs text-emerald-500 font-medium">System Online</span>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <button id="btn-header-pause" class="p-2 text-slate-400 hover:text-white transition-colors relative" title="Pause Game">
                        <iconify-icon icon="solar:pause-circle-linear" class="text-xl"></iconify-icon>
                    </button>
                </div>
            </header>
        `;

    }

    attachEvents() {
        document.getElementById('btn-header-pause')?.addEventListener('click', () => {
            this.game.togglePause();
        });
    }
}
