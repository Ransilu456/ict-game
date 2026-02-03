import LabSimulation from './LabSimulation.js';
import ThreeDComponents from '../ThreeDComponents.js';

export default class FiberLab extends LabSimulation {
    cacheControls() {
        super.cacheControls();
        this.controls.angle = document.getElementById('ctrl-angle');
        this.controls.intensity = document.getElementById('ctrl-intensity');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.angle.oninput = () => this.update();
        this.controls.intensity.oninput = () => this.update();
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Incident Angle (θ)</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-angle" min="20" max="80" value="45">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Light Intensity (mW)</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-intensity" min="10" max="100" value="50">
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;
        const a = this.controls.angle.value;
        const i = this.controls.intensity.value;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root, a, i);
        } else {
            this.renderFunctional(root, a, i);
        }

        const mode = a > 42 ? 'INTERNAL REFLECTION' : 'SIGNAL REFRACTION';
        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>SIGNAL PATH:</span> <span class="${a > 42 ? 'text-emerald-400' : 'text-rose-400'}">${mode}</span></div>
            <div class="flex justify-between text-slate-400"><span>POWER LOSS:</span> <span class="text-white">${Math.floor(100 - (a / 80) * 100)} %</span></div>
            <div class="flex justify-between text-slate-400"><span>CORE TYPE:</span> <span class="text-indigo-400">SINGLE MODE G.652</span></div>
        `;
    }

    renderFunctional(root, a, i) {
        root.innerHTML = `
            <div class="flex flex-col items-center gap-10 w-full">
                <div class="relative w-full h-48 bg-slate-950/50 rounded-[2rem] border border-slate-900 overflow-hidden">
                    <div class="absolute inset-0 scanlines opacity-10"></div>
                    
                    <!-- 3D Cable Cross-section -->
                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 opacity-30">
                        ${ThreeDComponents.getCableSVG('#22d3ee')}
                    </div>

                    <svg viewBox="0 0 400 200" class="absolute inset-0 z-20">
                        <!-- Cable Core Visualization -->
                        <rect x="0" y="95" width="400" height="10" fill="#22d3ee" fill-opacity="0.05" />
                        
                        <!-- Light path with TIR -->
                        <path d="M 0 100 ${Array.from({ length: 15 }, (_, i) => `L ${i * 26 + 13} ${100 + (i % 2 ? -1 : 1) * (100 - a)}`).join(' ')}" 
                            stroke="#22d3ee" stroke-width="${i / 20}" fill="none" filter="drop-shadow(0 0 5px #22d3ee)">
                            <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
                
                <div class="flex gap-4">
                    <div class="px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                        Reflectance: ${(a / 90 * 100).toFixed(1)}%
                    </div>
                    <div class="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Mode: ${a > 42 ? 'TIR ACTIVE' : 'REFRAC LOSS'}
                    </div>
                </div>
            </div>
        `;
    }

    renderCircuitry(root, a, i) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- SFP Module Internal -->
                <rect x="30" y="50" width="120" height="100" rx="4" fill="#1e293b" stroke="#334155" />
                <text x="90" y="40" text-anchor="middle" fill="#94a3b8" font-size="8">OPTICAL TRANSCEIVER</text>

                <!-- Driver IC -->
                <rect x="45" y="75" width="40" height="50" rx="2" fill="#334155" />
                <text x="65" y="105" text-anchor="middle" fill="white" font-size="7">DRIVER</text>

                <!-- Laser Diode -->
                <rect x="100" y="85" width="30" height="30" rx="2" fill="#1e1b4b" stroke="#4338ca" />
                <path d="M 115 85 L 115 70 M 115 70 L 105 75 M 115 70 L 125 75" stroke="#fbbf24" stroke-width="1" fill="none" />
                <text x="115" y="125" text-anchor="middle" fill="#94a3b8" font-size="7">LASER</text>

                <!-- Optical Interface -->
                <circle cx="250" cy="100" r="30" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="4,2" />
                <text x="250" y="145" text-anchor="middle" fill="#64748b" font-size="8">FC/UPC COUPLER</text>

                <!-- Light Wave out -->
                <path d="M 130 100 L 220 100" stroke="#22d3ee" stroke-width="2" stroke-dasharray="5,3">
                    <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.5s" repeatCount="indefinite" />
                </path>

                <text x="200" y="185" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace" class="uppercase">PRACTICAL: CURRENT -> PHOTONS -> REFLECTION</text>
            </svg>
        `;
    }
}
