import LabSimulation from './LabSimulation.js';

export default class OpticsLab extends LabSimulation {
    cacheControls() {
        super.cacheControls();
        this.controls.aperture = document.getElementById('ctrl-aperture');
        this.controls.iso = document.getElementById('ctrl-iso');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.aperture.oninput = () => this.update();
        this.controls.iso.oninput = () => this.update();
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3 text-center">Optics Parameters</label>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-2">Lens Aperture</label>
                            <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-aperture" min="1" max="100" value="50">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-2">Sensor Gain (ISO)</label>
                            <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-iso" min="100" max="6400" step="100" value="400">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;
        const v = this.controls.aperture.value;
        const i = this.controls.iso.value;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root, v, i);
        } else {
            this.renderFunctional(root, v, i);
        }

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>PHOTON COUNT:</span> <span class="text-white">${v * 1000} LUX</span></div>
            <div class="flex justify-between text-slate-400"><span>SIGNAL NOISE:</span> <span class="text-rose-400">${Math.floor(i / 100)} dB</span></div>
            <div class="flex justify-between text-slate-400"><span>SENSOR STATUS:</span> <span class="text-emerald-400">STABLE</span></div>
        `;
    }

    renderFunctional(root, v, i) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full max-w-sm">
                <!-- Light Rays -->
                <path d="M 0 50 L 150 100 L 250 100 L 400 100" stroke="yellow" stroke-width="${v / 10}" fill="none" class="animate-pulse">
                     <animate attributeName="stroke-opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                </path>
                <!-- Lens -->
                <ellipse cx="150" cy="100" rx="10" ry="${v}" fill="cyan" fill-opacity="0.3" stroke="white" />
                <!-- Mirror -->
                <line x1="200" y1="50" x2="250" y2="150" stroke="white" stroke-width="4" stroke-opacity="0.5" />
                <!-- Sensor -->
                <rect x="350" y="50" width="10" height="100" fill="#333" stroke="white" />
                <rect x="350" y="50" width="10" height="100" fill="#10b981" fill-opacity="${i / 10000}" />
            </svg>
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
