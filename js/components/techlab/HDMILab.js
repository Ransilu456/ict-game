import LabSimulation from './LabSimulation.js';

export default class HDMILab extends LabSimulation {
    cacheControls() {
        this.controls.bandwidth = document.getElementById('ctrl-bandwidth');
        this.controls.refresh = document.getElementById('ctrl-refresh');
    }

    attachEvents() {
        this.controls.bandwidth.oninput = () => this.update();
        this.controls.refresh.onchange = () => this.update();
    }

    renderControls() {
        return `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Bandwidth (Gbps)</label>
                <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-bandwidth" min="10" max="48" step="1" value="18">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Refresh Rate (Hz)</label>
                <select id="ctrl-refresh" class="w-full bg-slate-800 border-none rounded-lg text-xs text-white p-3 outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="60">60 Hz</option>
                    <option value="120">120 Hz</option>
                    <option value="144">144 Hz</option>
                </select>
            </div>
        `;
    }

    update() {
        const bw = this.controls.bandwidth.value;
        const hz = this.controls.refresh.value;
        const chroma = bw > 30 ? '4:4:4' : '4:2:2';
        const root = this.container.querySelector('#canvas-root') || this.container;

        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- HDMI Data Streams -->
                ${Array.from({ length: 4 }, (_, i) => `
                    <path d="M 0 ${60 + i * 30} L 400 ${60 + i * 30}" stroke="#4338ca" stroke-width="4" stroke-opacity="0.3" />
                    <path d="M 0 ${60 + i * 30} L 400 ${60 + i * 30}" stroke="#22d3ee" stroke-width="2">
                        <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="${100 / bw}s" repeatCount="indefinite" />
                    </path>
                `).join('')}
                <text x="200" y="180" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">TMDS LINK ACTIVE: 48-BIT DEPTH</text>
            </svg>
        `;

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>THROUGHPUT:</span> <span class="text-white">${bw} Gbps</span></div>
            <div class="flex justify-between text-slate-400"><span>FRAME RATE:</span> <span class="text-indigo-400">${hz} FPS</span></div>
            <div class="flex justify-between text-slate-400"><span>CHROMA:</span> <span class="text-emerald-400">${chroma}</span></div>
        `;
    }
}
