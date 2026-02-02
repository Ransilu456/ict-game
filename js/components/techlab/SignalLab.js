import LabSimulation from './LabSimulation.js';

export default class SignalLab extends LabSimulation {
    cacheControls() {
        this.controls.freq = document.getElementById('ctrl-freq');
        this.controls.bits = document.getElementById('ctrl-bits');
    }

    attachEvents() {
        this.controls.freq.oninput = () => this.update();
        this.controls.bits.oninput = () => this.update();
    }

    renderControls() {
        return `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Frequency (GHz)</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-freq" min="2" max="60" value="5">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Packet Density</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-bits" min="10" max="1000" value="200">
            </div>
        `;
    }

    update() {
        const f = this.controls.freq.value;
        const b = this.controls.bits.value;
        const root = this.container.querySelector('#canvas-root') || this.container;

        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <path d="M 0 100 ${Array.from({ length: 40 }, (_, i) => `Q ${i * 10 + 5} ${100 - (b / 20) * (i % 2 ? 1 : -1)} ${i * 10 + 10} 100`).join(' ')}" 
                    stroke="indigo" stroke-width="2" fill="none">
                     <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="${20 / f}s" repeatCount="indefinite" />
                </path>
                <!-- Transmitter -->
                <circle cx="20" cy="100" r="10" fill="indigo" />
            </svg>
        `;

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>BANDWIDTH:</span> <span class="text-white">${f * 10} MHz</span></div>
            <div class="flex justify-between text-slate-400"><span>DATA RATE:</span> <span class="text-indigo-400">${b} Mbps</span></div>
            <div class="flex justify-between text-slate-400"><span>LINK STATUS:</span> <span class="text-emerald-400">BROADCASTING</span></div>
        `;
    }
}
