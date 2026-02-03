import LabSimulation from './LabSimulation.js';

export default class CameraSwitcher extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.programSource = 1;
        this.previewSource = 2;
        this.isTransitioning = false;

        // Multi-view / Effects State
        this.transitionType = 'mix'; // 'mix', 'wipe', 'dip'
        this.transitionDuration = 500; // ms
        this.tBarPosition = 0; // 0 (PGM) to 1 (PVW)
        this.pipActive = false;
        this.ftbActive = false;
    }

    cacheControls() {
        super.cacheControls();
        this.controls.pgmBtns = document.querySelectorAll('.pgm-btn');
        this.controls.pvwBtns = document.querySelectorAll('.pvw-btn');
        this.controls.transBtns = document.querySelectorAll('.trans-btn');
        this.controls.cutBtn = document.getElementById('ctrl-cut');
        this.controls.autoBtn = document.getElementById('ctrl-auto');
        this.controls.tBar = document.getElementById('ctrl-tbar');
        this.controls.pipToggle = document.getElementById('ctrl-pip');
        this.controls.ftbToggle = document.getElementById('ctrl-ftb');
        this.controls.durationSlider = document.getElementById('ctrl-duration');
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

        this.controls.transBtns.forEach(btn => {
            btn.onclick = () => {
                this.transitionType = btn.dataset.type;
                this.updateUIState();
            };
        });

        this.controls.cutBtn.onclick = () => this.performCut();
        this.controls.autoBtn.onclick = () => this.performAuto();

        this.controls.tBar.oninput = (e) => {
            this.tBarPosition = parseFloat(e.target.value) / 100;
            this.update();

            // Check for completion
            if (this.tBarPosition >= 0.98) {
                this.finishTransition();
            }
        };

        this.controls.durationSlider.oninput = (e) => {
            this.transitionDuration = parseInt(e.target.value);
            this.update();
        };

        this.controls.pipToggle.onchange = (e) => {
            this.pipActive = e.target.checked;
            this.update();
        };

        this.controls.ftbToggle.onchange = (e) => {
            this.ftbActive = e.target.checked;
            this.update();
        };

        this.updateUIState();
    }

    updateUIState() {
        this.controls.transBtns.forEach(btn => {
            const active = btn.dataset.type === this.transitionType;
            btn.classList.toggle('bg-indigo-600', active);
            btn.classList.toggle('text-white', active);
            btn.classList.toggle('bg-slate-800', !active);
        });
    }

    performCut() {
        const temp = this.programSource;
        this.programSource = this.previewSource;
        this.previewSource = temp;
        this.tBarPosition = 0;
        this.controls.tBar.value = 0;
        this.update();
    }

    performAuto() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const start = performance.now();
        const duration = this.transitionDuration;

        const animate = (time) => {
            const progress = (time - start) / duration;
            if (progress < 1) {
                this.tBarPosition = progress;
                this.controls.tBar.value = progress * 100;
                this.update();
                requestAnimationFrame(animate);
            } else {
                this.finishTransition();
            }
        };
        requestAnimationFrame(animate);
    }

    finishTransition() {
        const temp = this.programSource;
        this.programSource = this.previewSource;
        this.previewSource = temp;
        this.tBarPosition = 0;
        this.controls.tBar.value = 0;
        this.isTransitioning = false;
        this.update();
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <!-- Transition Types -->
                <div>
                    <label class="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Transition Type</label>
                    <div class="grid grid-cols-3 gap-1.5">
                        ${['mix', 'wipe', 'dip'].map(type => `
                            <button class="trans-btn p-2 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-black uppercase transition-all ${this.transitionType === type ? 'bg-indigo-600 text-white' : 'text-slate-400'}" data-type="${type}">${type}</button>
                        `).join('')}
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-[9px] font-black text-rose-500 uppercase tracking-widest mb-3">Program Bus</label>
                        <div class="grid grid-cols-2 gap-1.5">
                            ${[1, 2, 3, 4].map(s => `
                                <button class="pgm-btn p-2 rounded-lg border border-slate-700 text-xs font-mono transition-all ${this.programSource === s ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}" data-src="${s}">${s}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <label class="block text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3">Preview Bus</label>
                        <div class="grid grid-cols-2 gap-1.5">
                            ${[1, 2, 3, 4].map(s => `
                                <button class="pvw-btn p-2 rounded-lg border border-slate-700 text-xs font-mono transition-all ${this.previewSource === s ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}" data-src="${s}">${s}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Transitions Controls -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                         <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Manual T-Bar</label>
                         <span class="text-[10px] font-mono text-indigo-400">${Math.round(this.tBarPosition * 100)}%</span>
                    </div>
                    <input type="range" id="ctrl-tbar" class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" min="0" max="100" value="${this.tBarPosition * 100}">
                    
                    <div class="flex gap-2">
                        <button id="ctrl-cut" class="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cut</button>
                        <button id="ctrl-auto" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">Auto</button>
                    </div>
                </div>

                <!-- Multi-layer Effects -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                        <span class="text-[9px] font-black text-slate-400 uppercase">PiP</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="ctrl-pip" class="sr-only peer" ${this.pipActive ? 'checked' : ''}>
                            <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                        <span class="text-[9px] font-black text-slate-400 uppercase">FTB</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="ctrl-ftb" class="sr-only peer" ${this.ftbActive ? 'checked' : ''}>
                            <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                        </label>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-[9px] font-black text-slate-500 uppercase">Duration</label>
                        <span class="text-[10px] font-mono text-slate-400">${this.transitionDuration}ms</span>
                    </div>
                    <input type="range" id="ctrl-duration" class="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-600" min="100" max="2000" step="100" value="${this.transitionDuration}">
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#sim-viewport') || this.container;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root);
        } else {
            this.renderFunctional(root);
        }

        if (this.stats) {
            this.stats.innerHTML = `
                <div class="flex justify-between text-slate-400"><span>ACTIVE BUS:</span> <span class="text-rose-500 font-bold">PGM ${this.programSource}</span></div>
                <div class="flex justify-between text-slate-400"><span>PREVIEW BUS:</span> <span class="text-emerald-500 font-bold">PVW ${this.previewSource}</span></div>
                <div class="flex justify-between text-slate-400"><span>TRANSITION:</span> <span class="text-white">${this.transitionType.toUpperCase()}</span></div>
            `;
        }
    }

    renderFunctional(root) {
        const p = this.tBarPosition;
        let overlayStyle = '';

        if (this.transitionType === 'mix') {
            overlayStyle = `opacity: ${p};`;
        } else if (this.transitionType === 'wipe') {
            overlayStyle = `clip-path: inset(0 ${100 - p * 100}% 0 0);`;
        } else if (this.transitionType === 'dip') {
            const dipProgress = p < 0.5 ? p * 2 : (1 - p) * 2;
            overlayStyle = `opacity: ${p > 0.5 ? 1 : 0};`;
        }

        root.innerHTML = `
            <div class="w-full h-full flex flex-col gap-6 p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                    <!-- PROGRAM VIEW -->
                    <div class="relative border-4 border-rose-600 rounded-[2rem] overflow-hidden bg-black shadow-2xl shadow-rose-900/20 group">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <!-- Background (PGM) -->
                            <div class="absolute inset-0 flex items-center justify-center bg-slate-900">
                                <iconify-icon icon="solar:videocamera-bold" class="text-6xl text-slate-800"></iconify-icon>
                                <span class="absolute bottom-4 left-4 px-3 py-1 bg-rose-600 text-[10px] font-black text-white rounded-full z-10">PGM ${this.programSource}</span>
                            </div>
                            
                            <!-- Transition Overlay (PVW) -->
                            <div class="absolute inset-0 flex items-center justify-center bg-slate-800 border-l-2 border-indigo-400/50" style="${overlayStyle}">
                                <iconify-icon icon="solar:videocamera-bold" class="text-6xl text-indigo-900/40"></iconify-icon>
                                <span class="absolute bottom-4 right-4 px-3 py-1 bg-indigo-600 text-[10px] font-black text-white rounded-full">TRANS ${this.previewSource}</span>
                            </div>

                            <!-- PiP Layer -->
                            ${this.pipActive ? `
                                <div class="absolute top-4 right-4 w-1/3 aspect-video bg-slate-950 border-2 border-white/20 rounded-xl overflow-hidden shadow-2xl z-20">
                                    <div class="w-full h-full flex items-center justify-center opacity-30">
                                        <iconify-icon icon="solar:videocamera-bold" class="text-2xl"></iconify-icon>
                                    </div>
                                    <span class="absolute top-1 left-2 text-[6px] font-black text-white bg-black/50 px-1 rounded">PIP ${this.previewSource}</span>
                                </div>
                            ` : ''}

                            <!-- FTB Overlay -->
                            <div class="absolute inset-0 bg-black transition-opacity duration-300 pointer-events-none z-50 ${this.ftbActive ? 'opacity-100' : 'opacity-0'}"></div>
                        </div>

                        <!-- Scanline and Vignette Effects -->
                        <div class="absolute inset-0 scanlines opacity-5 pointer-events-none"></div>
                        <div class="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                    </div>

                    <!-- PREVIEW VIEW -->
                    <div class="relative border-4 border-emerald-600 rounded-[2rem] overflow-hidden bg-slate-950/50 group">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <iconify-icon icon="solar:videocamera-record-bold" class="text-6xl text-emerald-950/40"></iconify-icon>
                            <span class="absolute bottom-4 left-4 px-3 py-1 bg-emerald-600 text-[10px] font-black text-white rounded-full">PVW ${this.previewSource}</span>
                        </div>
                        <div class="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
                    </div>
                </div>

                <!-- MULTI-VIEW THUMBNAILS -->
                <div class="grid grid-cols-4 gap-4 shrink-0 px-2">
                    ${[1, 2, 3, 4].map(s => {
            const isLive = this.programSource === s;
            const isPvw = this.previewSource === s;
            return `
                            <div class="aspect-video rounded-2xl border-2 transition-all overflow-hidden relative group cursor-pointer ${isLive ? 'border-rose-600 bg-rose-900/10' : isPvw ? 'border-emerald-500 bg-emerald-900/10' : 'border-slate-800 bg-slate-900'}">
                                <div class="w-full h-full flex flex-col items-center justify-center gap-2">
                                    <iconify-icon icon="solar:camera-bold" class="text-xl ${isLive ? 'text-rose-500' : isPvw ? 'text-emerald-500' : 'text-slate-700'}"></iconify-icon>
                                    <span class="text-[8px] font-black ${isLive ? 'text-rose-500' : isPvw ? 'text-emerald-500' : 'text-slate-600'} uppercase">Source ${s}</span>
                                </div>
                                ${isLive ? '<div class="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>' : ''}
                            </div>
                        `;
        }).join('')}
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
