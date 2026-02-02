import LabSimulation from './LabSimulation.js';

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
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Rotating Drum -->
                <circle cx="200" cy="100" r="60" fill="none" stroke="#475569" stroke-width="4" stroke-dasharray="10,5">
                    <animateTransform attributeName="transform" type="rotate" from="0 200 100" to="360 200 100" dur="5s" repeatCount="indefinite" />
                </circle>
                <!-- Laser beam -->
                <line x1="50" y1="100" x2="140" y2="100" stroke="#f43f5e" stroke-width="2" opacity="0.8" />
                <!-- Charging area -->
                <path d="M 140 70 A 60 60 0 0 1 200 40" stroke="#fbbf24" stroke-width="4" fill="none" stroke-opacity="${v / 1000}" />
                <text x="200" y="190" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">ELECTROSTATIC FUSION PROCESS</text>
            </svg>
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
