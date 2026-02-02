import LabSimulation from './LabSimulation.js';

export default class OpticsLab extends LabSimulation {
    cacheControls() {
        this.controls.aperture = document.getElementById('ctrl-aperture');
        this.controls.iso = document.getElementById('ctrl-iso');
    }

    attachEvents() {
        this.controls.aperture.oninput = () => this.update();
        this.controls.iso.oninput = () => this.update();
    }

    renderControls() {
        return `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Lens Aperture</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-aperture" min="1" max="100" value="50">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Sensor Gain (ISO)</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-iso" min="100" max="6400" step="100" value="400">
            </div>
        `;
    }

    update() {
        const v = this.controls.aperture.value;
        const i = this.controls.iso.value;

        const root = this.container.querySelector('#canvas-root') || this.container;
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
                <rect x="350" y="50" width="10" height="100" fill="emerald" fill-opacity="${i / 10000}" />
            </svg>
        `;

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>PHOTON COUNT:</span> <span class="text-white">${v * 1000} LUX</span></div>
            <div class="flex justify-between text-slate-400"><span>SIGNAL NOISE:</span> <span class="text-rose-400">${Math.floor(i / 100)} dB</span></div>
            <div class="flex justify-between text-slate-400"><span>SENSOR STATUS:</span> <span class="text-emerald-400">STABLE</span></div>
        `;
    }
}
