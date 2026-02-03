import LabSimulation from './LabSimulation.js';
import ThreeDComponents from '../ThreeDComponents.js';

export default class ThermalLab extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.palette = 'iron';
    }

    cacheControls() {
        super.cacheControls();
        this.controls.range = document.getElementById('ctrl-temp-range');
        this.controls.paletteBtns = document.querySelectorAll('.palette-btn');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.paletteBtns.forEach(btn => {
            btn.onclick = () => {
                this.controls.paletteBtns.forEach(b => b.classList.remove('bg-rose-600', 'bg-emerald-600', 'text-white'));
                this.palette = btn.dataset.palette;
                const activeClass = this.palette === 'iron' ? 'bg-rose-600' : 'bg-emerald-600';
                btn.classList.add(activeClass, 'text-white');
                this.update();
            };
        });
        this.controls.range.oninput = () => this.update();
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Range Sensitivity</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-temp-range" min="0" max="100" value="50">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Color Palette</label>
                    <div class="flex gap-2">
                        <button class="palette-btn w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-[9px] text-slate-400 hover:bg-rose-600 hover:text-white transition-all font-black uppercase ${this.palette === 'iron' ? 'bg-rose-600 text-white' : ''}" data-palette="iron">Iron</button>
                        <button class="palette-btn w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-[9px] text-slate-400 hover:bg-emerald-600 hover:text-white transition-all font-black uppercase ${this.palette === 'night' ? 'bg-emerald-600 text-white' : ''}" data-palette="night">Night</button>
                    </div>
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;
        const r = this.controls.range.value;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root, r);
        } else {
            this.renderFunctional(root, r);
        }

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>PEAK TEMP:</span> <span class="text-white">${Math.floor(r * 1.5 + 20)} °C</span></div>
            <div class="flex justify-between text-slate-400"><span>DETECTION:</span> <span class="text-rose-400">HEAT SOURCE ALPHA</span></div>
            <div class="flex justify-between text-slate-400"><span>MODE:</span> <span class="text-emerald-400">${this.palette.toUpperCase()} SCAN</span></div>
        `;
    }

    renderFunctional(root, r) {
        const color1 = this.palette === 'iron' ? '#1e1b4b' : '#064e3b';
        const color2 = this.palette === 'iron' ? '#dc2626' : '#22c55e';

        root.innerHTML = `
            <div class="flex flex-col items-center gap-8 w-full h-full">
                <div class="relative w-64 h-64">
                    <div class="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full"></div>
                    ${ThreeDComponents.getIPCamSVG(color2)}
                    
                    <!-- Thermal Overlay -->
                    <div class="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                         <svg viewBox="0 0 400 200" class="w-full h-full opacity-60">
                            <defs>
                                <radialGradient id="heatGradient">
                                    <stop offset="0%" stop-color="${color2}" stop-opacity="${r / 100}" />
                                    <stop offset="100%" stop-color="${color1}" stop-opacity="0" />
                                </radialGradient>
                            </defs>
                            <circle cx="200" cy="100" r="${40 + r / 2}" fill="url(#heatGradient)">
                                <animate attributeName="r" values="${40 + r / 2}; ${50 + r / 2}; ${40 + r / 2}" dur="3s" repeatCount="indefinite" />
                            </circle>
                        </svg>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div class="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                        <span class="text-[8px] text-slate-500 uppercase font-black">Sensitiity</span>
                        <span class="text-xs font-mono text-white">${r}%</span>
                    </div>
                    <div class="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center">
                        <span class="text-[8px] text-slate-500 uppercase font-black">Payload</span>
                        <span class="text-xs font-mono text-rose-400 capitalize">${this.palette}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCircuitry(root, r) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Microbolometer Array -->
                <rect x="30" y="60" width="60" height="80" rx="4" fill="#0f172a" stroke="#475569" />
                <text x="60" y="55" text-anchor="middle" fill="#94a3b8" font-size="8">BOLOMETER ARRAY</text>
                <path d="M 40 70 L 80 70 M 40 85 L 80 85 M 40 100 L 80 100" stroke="#4338ca" stroke-width="1" opacity="0.3" />

                <!-- ROIC (Readout IC) -->
                <rect x="120" y="75" width="70" height="50" rx="4" fill="#1e293b" />
                <text x="155" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">ROIC</text>

                <!-- DSP / FPGA -->
                <rect x="230" y="60" width="100" height="80" rx="8" fill="#1e1b4b" stroke="#4338ca" />
                <text x="280" y="105" text-anchor="middle" fill="white" font-size="12" font-weight="black">DSP</text>
                <text x="280" y="55" text-anchor="middle" fill="#94a3b8" font-size="8">THERMAL ENGINE</text>

                <!-- Signal Path -->
                <path d="M 90 100 L 120 100" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow)" />
                <path d="M 190 100 L 230 100" stroke="#fbbf24" stroke-width="2" stroke-dasharray="2,2">
                     <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite" />
                </path>

                <text x="200" y="180" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">PRACTICAL: LWIR ENERGY -> RESISTANCE CHANGE -> DATA</text>
            </svg>
        `;
    }
}
