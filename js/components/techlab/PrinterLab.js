import LabSimulation from './LabSimulation.js';
import ThreeDComponents from '../ThreeDComponents.js';

export default class PrinterLab extends LabSimulation {
    cacheControls() {
        super.cacheControls();
        this.controls.voltage = document.getElementById('ctrl-voltage');
        this.controls.temp = document.getElementById('ctrl-temp');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.voltage.oninput = () => this.update();
        this.controls.temp.oninput = () => this.update();
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Drum Voltage (V)</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-voltage" min="0" max="1000" step="50" value="600">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Fuser Temp (°C)</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-temp" min="100" max="250" value="180">
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;
        const v = this.controls.voltage.value;
        const t = this.controls.temp.value;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root, v, t);
        } else {
            this.renderFunctional(root, v, t);
        }

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>DRUM CHARGE:</span> <span class="text-white">${v}V DC</span></div>
            <div class="flex justify-between text-slate-400"><span>FUSER STATUS:</span> <span class="${t > 200 ? 'text-amber-400' : 'text-emerald-400'}">${t}°C ACTIVE</span></div>
            <div class="flex justify-between text-slate-400"><span>TONER YIELD:</span> <span class="text-indigo-400">OPTIMAL</span></div>
        `;
    }

    renderFunctional(root, v, t) {
        root.innerHTML = `
            <div class="flex flex-col items-center gap-10 w-full">
                <div class="relative w-64 h-64">
                    <div class="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full"></div>
                    ${ThreeDComponents.getPrinterSVG('#f43f5e')}
                    
                    <!-- Fusion Process Visualization -->
                    <svg viewBox="0 0 200 200" class="absolute inset-0 z-20 pointer-events-none">
                        <!-- Laser Path -->
                        <line x1="20" y1="100" x2="80" y2="100" stroke="#f43f5e" stroke-width="2" class="animate-pulse" />
                        
                        <!-- Electrostatic Drum Interaction -->
                        <circle cx="100" cy="110" r="40" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="10,5" opacity="${v / 1000}">
                            <animateTransform attributeName="transform" type="rotate" from="0 100 110" to="360 100 110" dur="3s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                </div>
                
                <div class="flex gap-4">
                    <div class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-400">
                        DRUM: <span class="text-white">${v}V</span>
                    </div>
                    <div class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-400">
                        FUSER: <span class="${t > 200 ? 'text-amber-400' : 'text-emerald-400'}">${t}°C</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCircuitry(root, v, t) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Controller Board -->
                <rect x="30" y="40" width="340" height="120" rx="8" fill="#064e3b" stroke="#065f46" stroke-width="2" />
                
                <!-- Main Soc -->
                <rect x="150" y="70" width="80" height="50" rx="4" fill="#1e293b" />
                <text x="190" y="100" text-anchor="middle" fill="white" font-size="10" font-weight="bold">PRINTER-ASIC</text>

                <!-- High Voltage PSU -->
                <rect x="50" y="60" width="60" height="80" rx="4" fill="#334155" />
                <text x="80" y="105" text-anchor="middle" fill="white" font-size="8">HV PSU</text>
                <text x="80" y="55" text-anchor="middle" fill="#94a3b8" font-size="7">DRUM CHARGE: ${v}V</text>

                <!-- Fuser Controller -->
                <rect x="270" y="60" width="70" height="80" rx="4" fill="#334155" />
                <text x="305" y="105" text-anchor="middle" fill="white" font-size="8">TEMP CTRL</text>
                <text x="305" y="55" text-anchor="middle" fill="#f43f5e" font-size="7">HEATER: ${t}°C</text>

                <!-- Signal Traces -->
                <path d="M 110 100 L 150 100" stroke="#fbbf24" stroke-width="1" />
                <path d="M 230 100 L 270 100" stroke="#fbbf24" stroke-width="1" />

                <text x="200" y="185" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">PRACTICAL: VOLTAGE MODULATION -> THERMAL FIXING</text>
            </svg>
        `;
    }
}
