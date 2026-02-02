import LabSimulation from './LabSimulation.js';

export default class ThermalLab extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.palette = 'iron';
    }

    cacheControls() {
        this.controls.range = document.getElementById('ctrl-temp-range');
        this.controls.paletteBtns = document.querySelectorAll('.palette-btn');
    }

    attachEvents() {
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
        `;
    }

    update() {
        const r = this.controls.range.value;
        const color1 = this.palette === 'iron' ? '#1e1b4b' : '#064e3b';
        const color2 = this.palette === 'iron' ? '#dc2626' : '#22c55e';
        const root = this.container.querySelector('#canvas-root') || this.container;

        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <defs>
                    <radialGradient id="heatGradient">
                        <stop offset="0%" stop-color="${color2}" stop-opacity="${r / 100}" />
                        <stop offset="100%" stop-color="${color1}" />
                    </radialGradient>
                </defs>
                <rect width="400" height="200" fill="${color1}" />
                <!-- Detected Heat Source -->
                <circle cx="200" cy="100" r="${40 + r / 2}" fill="url(#heatGradient)">
                    <animate attributeName="r" values="${40 + r / 2}; ${50 + r / 2}; ${40 + r / 2}" dur="3s" repeatCount="indefinite" />
                </circle>
                <rect x="0" y="0" width="400" height="200" fill="none" stroke="white" stroke-width="2" stroke-opacity="0.1" />
            </svg>
        `;

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>PEAK TEMP:</span> <span class="text-white">${Math.floor(r * 1.5 + 20)} °C</span></div>
            <div class="flex justify-between text-slate-400"><span>DETECTION:</span> <span class="text-rose-400">HEAT SOURCE ALPHA</span></div>
            <div class="flex justify-between text-slate-400"><span>MODE:</span> <span class="text-emerald-400">${this.palette.toUpperCase()} SCAN</span></div>
        `;
    }
}
