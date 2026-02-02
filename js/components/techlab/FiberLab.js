import LabSimulation from './LabSimulation.js';

export default class FiberLab extends LabSimulation {
    cacheControls() {
        this.controls.angle = document.getElementById('ctrl-angle');
        this.controls.lux = document.getElementById('ctrl-lux');
    }

    attachEvents() {
        this.controls.angle.oninput = () => this.update();
        this.controls.lux.oninput = () => this.update();
    }

    renderControls() {
        return `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Incident Angle</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-angle" min="10" max="80" value="30">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Light Intensity</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-lux" min="0" max="100" value="80">
            </div>
        `;
    }

    update() {
        const a = parseInt(this.controls.angle.value);
        const l = this.controls.lux.value;
        const reflected = a < 42;
        const root = this.container.querySelector('#canvas-root') || this.container;

        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Cladding -->
                <rect x="0" y="70" width="400" height="60" fill="#4338ca" fill-opacity="0.1" stroke="#4338ca" stroke-opacity="0.3" />
                <!-- Core -->
                <rect x="0" y="85" width="400" height="30" fill="white" fill-opacity="0.05" />
                <!-- Light Path -->
                <path d="M 0 100 L 100 ${100 - a} L 200 100 L 300 ${100 + a} L 400 100" 
                    stroke="cyan" stroke-width="3" fill="none" class="${reflected ? '' : 'opacity-20'}">
                    <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" repeatCount="indefinite" />
                </path>
                ${!reflected ? `<path d="M 100 ${100 - a} L 150 0" stroke="#f43f5e" stroke-width="2" stroke-dasharray="5,5" />` : ''}
            </svg>
        `;

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>REFRACTION:</span> <span class="${reflected ? 'text-emerald-400' : 'text-rose-400'}">${reflected ? 'INTERNAL REFLECTION' : 'SIGNAL LOSS'}</span></div>
            <div class="flex justify-between text-slate-400"><span>ATTENUATION:</span> <span class="text-white">${reflected ? '0.2 dB/km' : 'INFINITY'}</span></div>
            <div class="flex justify-between text-slate-400"><span>LIGHT POWER:</span> <span class="text-indigo-400">${l} mW</span></div>
        `;
    }
}
