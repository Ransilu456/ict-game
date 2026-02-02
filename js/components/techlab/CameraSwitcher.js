import LabSimulation from './LabSimulation.js';

export default class CameraSwitcher extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.programSource = 1;
        this.previewSource = 2;
        this.isTransitioning = false;
    }

    cacheControls() {
        super.cacheControls();
        this.controls.pgmBtns = document.querySelectorAll('.pgm-btn');
        this.controls.pvwBtns = document.querySelectorAll('.pvw-btn');
        this.controls.cutBtn = document.getElementById('ctrl-cut');
        this.controls.autoBtn = document.getElementById('ctrl-auto');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.pgmBtns.forEach(btn => {
            btn.onclick = () => {
                this.programSource = parseInt(btn.dataset.src);
                this.update();
            };
        });

        this.controls.pvwBtns.forEach(btn => {
            btn.onclick = () => {
                this.previewSource = parseInt(btn.dataset.src);
                this.update();
            };
        });

        this.controls.cutBtn.onclick = () => this.performCut();
        this.controls.autoBtn.onclick = () => this.performAuto();
    }

    performCut() {
        const temp = this.programSource;
        this.programSource = this.previewSource;
        this.previewSource = temp;
        this.update();
    }

    performAuto() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.update();
        setTimeout(() => {
            this.performCut();
            this.isTransitioning = false;
            this.update();
        }, 1000);
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-bold text-rose-500 uppercase mb-3">Program Bus</label>
                    <div class="grid grid-cols-4 gap-2">
                        ${[1, 2, 3, 4].map(s => `
                            <button class="pgm-btn p-2 rounded-lg border border-slate-700 text-xs font-mono transition-all ${this.programSource === s ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}" data-src="${s}">${s}</button>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-emerald-500 uppercase mb-3">Preview Bus</label>
                    <div class="grid grid-cols-4 gap-2">
                        ${[1, 2, 3, 4].map(s => `
                            <button class="pvw-btn p-2 rounded-lg border border-slate-700 text-xs font-mono transition-all ${this.previewSource === s ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}" data-src="${s}">${s}</button>
                        `).join('')}
                    </div>
                </div>
                <div class="flex gap-2">
                    <button id="ctrl-cut" class="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cut</button>
                    <button id="ctrl-auto" class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Auto</button>
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root);
        } else {
            this.renderFunctional(root);
        }

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>ACTIVE BUS:</span> <span class="text-rose-500 font-bold">PGM ${this.programSource}</span></div>
            <div class="flex justify-between text-slate-400"><span>PREVIEW BUS:</span> <span class="text-emerald-500 font-bold">PVW ${this.previewSource}</span></div>
            <div class="flex justify-between text-slate-400"><span>CROSSPOINT:</span> <span class="text-white">HARDWARE LOCK</span></div>
        `;
    }

    renderFunctional(root) {
        root.innerHTML = `
            <div class="w-full h-full flex flex-col gap-4 p-4">
                <div class="grid grid-cols-2 gap-4 flex-1">
                    <div class="border-4 border-rose-600 rounded-2xl relative overflow-hidden bg-slate-900 group">
                        <div class="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-[10px] font-black text-white rounded">PGM ${this.programSource}</div>
                        <div class="w-full h-full flex items-center justify-center text-rose-500/20 text-4xl">
                            <iconify-icon icon="solar:videocamera-bold"></iconify-icon>
                        </div>
                        ${this.isTransitioning ? '<div class="absolute inset-0 bg-white/20 animate-pulse"></div>' : ''}
                    </div>
                    <div class="border-4 border-emerald-600 rounded-2xl relative overflow-hidden bg-slate-900">
                        <div class="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-[10px] font-black text-white rounded">PVW ${this.previewSource}</div>
                        <div class="w-full h-full flex items-center justify-center text-emerald-500/20 text-4xl">
                            <iconify-icon icon="solar:videocamera-bold"></iconify-icon>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-4 gap-2 shrink-0">
                    ${[1, 2, 3, 4].map(s => `
                        <div class="aspect-video bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center justify-center gap-1">
                            <span class="text-[8px] font-mono text-slate-500 font-bold uppercase">CAM ${s}</span>
                            <iconify-icon icon="solar:camera-bold" class="text-slate-600"></iconify-icon>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderCircuitry(root) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Input Processors -->
                ${[1, 2, 3, 4].map(i => `
                    <rect x="20" y="${30 + (i - 1) * 35}" width="60" height="25" rx="2" fill="#1e293b" />
                    <text x="50" y="${46 + (i - 1) * 35}" text-anchor="middle" fill="#94a3b8" font-size="7">SDI ${i}</text>
                `).join('')}

                <!-- Crosspoint Matrix -->
                <rect x="120" y="30" width="160" height="130" rx="8" fill="#1e1b4b" stroke="#4338ca" />
                <text x="200" y="25" text-anchor="middle" fill="#94a3b8" font-size="8">L-CROSSPOINT ASIC</text>
                
                <!-- Internal Grid Traces -->
                ${[1, 2, 3, 4].map(i => `
                    <line x1="120" y1="${42 + (i - 1) * 35}" x2="280" y2="${42 + (i - 1) * 35}" stroke="#ffffff" stroke-opacity="0.1" />
                    <line x1="${140 + (i - 1) * 40}" y1="30" x2="${140 + (i - 1) * 40}" y2="160" stroke="#ffffff" stroke-opacity="0.1" />
                `).join('')}

                <!-- Active Routing Paths -->
                <path d="M 80 ${42 + (this.programSource - 1) * 35} L 120 ${42 + (this.programSource - 1) * 35} L 200 ${42 + (this.programSource - 1) * 35} L 200 170" stroke="#f43f5e" stroke-width="2" fill="none" opacity="0.6" />
                <path d="M 80 ${42 + (this.previewSource - 1) * 35} L 120 ${42 + (this.previewSource - 1) * 35} L 240 ${42 + (this.previewSource - 1) * 35} L 240 170" stroke="#10b981" stroke-width="2" fill="none" opacity="0.4" />

                <!-- Output Buffers -->
                <rect x="180" y="170" width="40" height="15" fill="#334155" />
                <text x="200" y="181" text-anchor="middle" fill="white" font-size="6">PGM BUS</text>
                <rect x="225" y="170" width="40" height="15" fill="#334155" />
                <text x="245" y="181" text-anchor="middle" fill="white" font-size="6">PVW BUS</text>

                <text x="340" y="100" text-anchor="middle" fill="#64748b" font-size="8" transform="rotate(90, 340, 100)">HARDWARE FABRIC</text>
            </svg>
        `;
    }
}
