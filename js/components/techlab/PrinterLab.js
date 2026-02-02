import LabSimulation from './LabSimulation.js';

export default class PrinterLab extends LabSimulation {
    cacheControls() {
        this.controls.charge = document.getElementById('ctrl-charge');
        this.controls.temp = document.getElementById('ctrl-temp');
    }

    attachEvents() {
        this.controls.charge.oninput = () => this.update();
        this.controls.temp.oninput = () => this.update();
    }

    renderControls() {
        return `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Drum Voltage</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-charge" min="10" max="100" value="70">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Fuser Temp (°C)</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-temp" min="150" max="220" value="180">
            </div>
        `;
    }

    update() {
        const c = this.controls.charge.value;
        const t = this.controls.temp.value;
        const root = this.container.querySelector('#canvas-root') || this.container;

        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Rotating Drum -->
                <circle cx="200" cy="100" r="60" fill="none" stroke="#444" stroke-width="4" stroke-dasharray="10,5">
                     <animateTransform attributeName="transform" type="rotate" from="0 200 100" to="360 200 100" dur="5s" repeatCount="indefinite" />
                </circle>
                <!-- Laser Charge -->
                <path d="M 200 0 L 200 40" stroke="cyan" stroke-width="2" class="animate-pulse" />
                <!-- Toner particles -->
                ${Array.from({ length: 20 }, (_, i) => `
                    <circle cx="${200 + 70 * Math.cos(i)}" cy="${100 + 70 * Math.sin(i)}" r="2" fill="black" opacity="${c / 100}">
                        <animateTransform attributeName="transform" type="rotate" from="0 200 100" to="360 200 100" dur="3s" repeatCount="indefinite" />
                    </circle>
                `).join('')}
                <!-- Heating Unit -->
                <rect x="280" y="80" width="40" height="40" fill="${t > 200 ? '#f43f5e' : '#f59e0b'}" fill-opacity="0.5" />
            </svg>
        `;

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>TONER ADHESION:</span> <span class="text-white">${c}%</span></div>
            <div class="flex justify-between text-slate-400"><span>FUSION QUALITY:</span> <span class="${t > 190 ? 'text-emerald-400' : 'text-amber-400'}">${t > 190 ? 'PERFECT' : 'LOW TEMP'}</span></div>
            <div class="flex justify-between text-slate-400"><span>PAGES/MIN:</span> <span class="text-indigo-400">45 PPM</span></div>
        `;
    }
}
