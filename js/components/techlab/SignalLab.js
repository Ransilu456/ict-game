import LabSimulation from './LabSimulation.js';
import ThreeDComponents from '../ThreeDComponents.js';

export default class SignalLab extends LabSimulation {
    cacheControls() {
        super.cacheControls();
        this.controls.freq = document.getElementById('ctrl-freq');
        this.controls.bits = document.getElementById('ctrl-bits');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.freq.oninput = () => this.update();
        this.controls.bits.oninput = () => this.update();
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Frequency (GHz)</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-freq" min="2" max="60" value="5">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Packet Density</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-bits" min="10" max="1000" value="200">
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;
        const f = this.controls.freq.value;
        const b = this.controls.bits.value;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root, f, b);
        } else {
            this.renderFunctional(root, f, b);
        }

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>BANDWIDTH:</span> <span class="text-white">${f * 10} MHz</span></div>
            <div class="flex justify-between text-slate-400"><span>DATA RATE:</span> <span class="text-indigo-400">${b} Mbps</span></div>
            <div class="flex justify-between text-slate-400"><span>LINK STATUS:</span> <span class="text-emerald-400">BROADCASTING</span></div>
        `;
    }

    renderFunctional(root, f, b) {
        root.innerHTML = `
            <div class="flex flex-col items-center gap-10 w-full">
                <div class="relative w-64 h-64">
                    <div class="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
                    ${ThreeDComponents.getAntennaSVG('#6366f1')}
                    
                    <!-- Signal Waves Visualization -->
                    <svg viewBox="0 0 200 200" class="absolute inset-0 z-20 pointer-events-none">
                        <path d="M 100 40 ${Array.from({ length: 20 }, (_, i) => `Q ${100 + i * 5 + 2.5} ${40 - (b / 40) * (i % 2 ? 1 : -1)} ${100 + i * 5 + 5} 40`).join(' ')}" 
                            stroke="#fbbf24" stroke-width="2" fill="none" opacity="0.6">
                             <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="${20 / f}s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
                
                <div class="glass-panel px-6 py-4 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        <span class="text-[10px] font-black text-white uppercase tracking-widest">${f} GHz</span>
                    </div>
                    <div class="w-px h-4 bg-slate-800"></div>
                    <div class="flex items-center gap-2">
                        <iconify-icon icon="solar:transmission-bold" class="text-indigo-400"></iconify-icon>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${b} MBPS</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCircuitry(root, f, b) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Baseband Processor -->
                <rect x="30" y="70" width="80" height="60" rx="4" fill="#1e293b" stroke="#475569" />
                <text x="70" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">DSP / SoC</text>
                <text x="70" y="60" text-anchor="middle" fill="#94a3b8" font-size="8">BASEBAND</text>

                <!-- Mixer / Modulator -->
                <circle cx="160" cy="100" r="25" fill="#334155" stroke="#475569" />
                <text x="160" y="105" text-anchor="middle" fill="white" font-size="20">×</text>
                <text x="160" y="65" text-anchor="middle" fill="#94a3b8" font-size="8">MODULATOR</text>

                <!-- Local Oscillator -->
                <rect x="140" y="140" width="40" height="20" rx="2" fill="#1e1b4b" stroke="#4338ca" />
                <text x="160" y="153" text-anchor="middle" fill="#818cf8" font-size="7">OSC: ${f}GHz</text>

                <!-- RF Amplifier -->
                <path d="M 230 70 L 290 100 L 230 130 Z" fill="#4338ca" />
                <text x="260" y="140" text-anchor="middle" fill="#94a3b8" font-size="8">PA (POWER AMP)</text>

                <!-- Antenna Output -->
                <line x1="290" y1="100" x2="350" y2="100" stroke="#fbbf24" stroke-width="2" />
                <line x1="350" y1="100" x2="350" y2="60" stroke="#fbbf24" stroke-width="3" />
                <line x1="330" y1="60" x2="370" y2="60" stroke="#fbbf24" stroke-width="3" />

                <!-- Traces -->
                <path d="M 110 100 L 135 100" stroke="#fbbf24" stroke-width="2" />
                <path d="M 160 140 L 160 125" stroke="#fbbf24" stroke-width="2" />
                <path d="M 185 100 L 230 100" stroke="#fbbf24" stroke-width="2" />

                <text x="200" y="185" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace" class="uppercase">PRACTICAL: RAW DATA -> MIXING -> RADIATION</text>
            </svg>
        `;
    }
}
