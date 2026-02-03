import LabSimulation from './LabSimulation.js';
import ThreeDComponents from '../ThreeDComponents.js';

export default class OpticsLab extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.frameRate = 24;
        this.zoom = 100;
        this.focus = 50;
        this.whiteBalance = 5600; // Kelvin
    }

    cacheControls() {
        super.cacheControls();
        this.controls.aperture = document.getElementById('ctrl-aperture');
        this.controls.iso = document.getElementById('ctrl-iso');
        this.controls.focus = document.getElementById('ctrl-focus');
        this.controls.zoom = document.getElementById('ctrl-zoom');
        this.controls.wb = document.getElementById('ctrl-wb');
        this.controls.fpsBtns = document.querySelectorAll('.fps-btn');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.aperture.oninput = () => this.update();
        this.controls.iso.oninput = () => this.update();
        this.controls.focus.oninput = () => this.update();
        this.controls.zoom.oninput = () => this.update();
        this.controls.wb.oninput = () => this.update();

        this.controls.fpsBtns.forEach(btn => {
            btn.onclick = () => {
                this.frameRate = parseInt(btn.dataset.fps);
                this.updateUIState();
                this.update();
            };
        });

        this.updateUIState();
    }

    updateUIState() {
        this.controls.fpsBtns.forEach(btn => {
            const active = parseInt(btn.dataset.fps) === this.frameRate;
            btn.classList.toggle('bg-indigo-600', active);
            btn.classList.toggle('text-white', active);
            btn.classList.toggle('bg-slate-800', !active);
        });
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Acousto-Optics</label>
                    <div class="space-y-5">
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-bold text-slate-400 uppercase">Focus Range</label>
                                <span class="text-[10px] font-mono text-indigo-400">${this.focus}%</span>
                            </div>
                            <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-focus" min="0" max="100" value="${this.focus}">
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-bold text-slate-400 uppercase">Optical Zoom</label>
                                <span class="text-[10px] font-mono text-indigo-400">${this.zoom}%</span>
                            </div>
                            <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-zoom" min="50" max="200" value="${this.zoom}">
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-bold text-slate-400 uppercase">Aperture Size</label>
                                <span class="text-[10px] font-mono text-indigo-400">f/${(1.4 + (this.controls.aperture?.value ? this.controls.aperture.value / 20 : 2.5)).toFixed(1)}</span>
                            </div>
                            <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-aperture" min="1" max="100" value="50">
                        </div>
                    </div>
                </div>

                <div class="h-px bg-slate-800/50"></div>

                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Electronic Imaging</label>
                    <div class="space-y-5">
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-bold text-slate-400 uppercase">ISO / Gain</label>
                                <span class="text-[10px] font-mono text-rose-400">${this.controls.iso?.value || 400}</span>
                            </div>
                            <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" id="ctrl-iso" min="100" max="12800" step="100" value="400">
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-bold text-slate-400 uppercase">White Balance</label>
                                <span class="text-[10px] font-mono text-amber-400">${this.whiteBalance}K</span>
                            </div>
                            <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" id="ctrl-wb" min="2000" max="10000" step="100" value="${this.whiteBalance}">
                        </div>

                        <div>
                            <label class="block text-[9px] font-bold text-slate-400 uppercase mb-3">Frame Rate (FPS)</label>
                            <div class="grid grid-cols-3 gap-2">
                                ${[24, 30, 60].map(fps => `
                                    <button class="fps-btn p-2 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-black uppercase transition-all ${this.frameRate === fps ? 'bg-indigo-600 text-white' : 'text-slate-400'}" data-fps="${fps}">${fps}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#sim-viewport') || this.container;
        const v = this.controls.aperture.value;
        const i = this.controls.iso.value;
        this.focus = this.controls.focus.value;
        this.zoom = this.controls.zoom.value;
        this.whiteBalance = this.controls.wb.value;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root, v, i);
        } else {
            this.renderFunctional(root, v, i);
        }

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>SIGNAL NOISE:</span> <span class="text-rose-400">${Math.floor(i / 100)} dB</span></div>
            <div class="flex justify-between text-slate-400"><span>DATA RATE:</span> <span class="text-white">${(this.frameRate * (i / 1000)).toFixed(1)} MB/s</span></div>
            <div class="flex justify-between text-slate-400"><span>LATENCY:</span> <span class="text-emerald-400">${(1000 / this.frameRate).toFixed(1)} ms</span></div>
        `;
    }

    renderFunctional(root, v, i) {
        const isIPCam = this.device.id === 'ip-cam';
        const modelSVG = isIPCam ? ThreeDComponents.getIPCamSVG('#10b981') : ThreeDComponents.getCameraSVG('#6366f1');

        // Calculate visual effects
        const blurEffect = Math.abs(50 - this.focus) / 5;
        const zoomScale = this.zoom / 100;
        const temp = this.whiteBalance;

        // Simple WB mapping
        const rTint = temp < 5000 ? 50 : 0;
        const bTint = temp > 6000 ? 50 : 0;

        root.innerHTML = `
            <div class="flex flex-col items-center gap-8 w-full p-10">
                <div class="relative w-72 h-72 transition-all duration-300" style="transform: scale(${zoomScale}); filter: blur(${blurEffect}px) opacity(0.9);">
                    <div class="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full animate-pulse"></div>
                    ${modelSVG}
                    
                    <!-- Color Balance Overlay -->
                    <div class="absolute inset-0 rounded-full pointer-events-none" style="background: rgba(${rTint}, 0, ${bTint}, 0.1);"></div>

                    <!-- Optical Path Visualization -->
                    <svg viewBox="0 0 200 200" class="absolute inset-0 z-20 pointer-events-none">
                        <path d="M 0 100 L 100 100" stroke="#fbbf24" stroke-width="${v / 10}" stroke-dasharray="4,2" opacity="0.4">
                            <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
                
                <div class="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div class="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                        <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Exposure</span>
                        <span class="text-xs font-mono text-white">${(v / 10).toFixed(1)} EV</span>
                    </div>
                    <div class="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                        <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Timing</span>
                        <span class="text-xs font-mono text-white">${this.frameRate} FPS</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCircuitry(root, v, i) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Photodiode Array -->
                <rect x="20" y="60" width="40" height="80" rx="4" fill="#1e293b" stroke="#475569" />
                <text x="40" y="50" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="bold">PHOTODIODES</text>
                
                <!-- A/D Converter -->
                <rect x="100" y="70" width="60" height="60" rx="4" fill="#334155" />
                <text x="130" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">ADC</text>
                <text x="130" y="60" text-anchor="middle" fill="#94a3b8" font-size="8">ANALOG-TO-DIGITAL</text>

                <!-- Gain Control (ISO) -->
                <circle cx="130" cy="115" r="5" fill="${i > 3200 ? '#f43f5e' : '#10b981'}" class="animate-pulse" />

                <!-- ISP (Processor) -->
                <rect x="220" y="60" width="100" height="80" rx="8" fill="#1e1b4b" stroke="#4338ca" />
                <text x="270" y="105" text-anchor="middle" fill="white" font-size="14" font-weight="black">ISP</text>
                <text x="270" y="50" text-anchor="middle" fill="#94a3b8" font-size="8">IMAGE SIGNAL PROCESSOR</text>

                <!-- Data Lines -->
                <path d="M 60 100 L 100 100" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow)" />
                <path d="M 160 100 L 220 100" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,2">
                    <animate attributeName="stroke-dashoffset" from="0" to="20" dur="0.5s" repeatCount="indefinite" />
                </path>

                <text x="200" y="180" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">PRACTICAL: PHOTONS -> ELECTRONS -> BITS</text>

                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                    </marker>
                </defs>
            </svg>
        `;
    }
}
