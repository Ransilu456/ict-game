import LabSimulation from './LabSimulation.js';

export default class WiFiLab extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.view = 'network'; // 'circuit' or 'network'
        this.frequency = 2.4;
        this.beamforming = false;
        this.txPower = 20;
    }

    cacheControls() {
        this.controls.viewBtns = document.querySelectorAll('.view-btn');
        this.controls.freqBtns = document.querySelectorAll('.freq-btn');
        this.controls.powerRange = document.getElementById('ctrl-tx-power');
        this.controls.beamToggle = document.getElementById('ctrl-beamforming');
    }

    attachEvents() {
        this.controls.viewBtns.forEach(btn => {
            btn.onclick = () => {
                this.view = btn.dataset.view;
                this.updateUIState();
                this.update();
            };
        });

        this.controls.freqBtns.forEach(btn => {
            btn.onclick = () => {
                this.frequency = parseFloat(btn.dataset.freq);
                this.updateUIState();
                this.update();
            };
        });

        this.controls.powerRange.oninput = () => {
            this.txPower = parseInt(this.controls.powerRange.value);
            this.update();
        };

        this.controls.beamToggle.onchange = () => {
            this.beamforming = this.controls.beamToggle.checked;
            this.update();
        };
    }

    updateUIState() {
        this.controls.viewBtns.forEach(b => {
            const active = b.dataset.view === this.view;
            b.classList.toggle('bg-indigo-600', active);
            b.classList.toggle('text-white', active);
            b.classList.toggle('bg-slate-800', !active);
            b.classList.toggle('text-slate-400', !active);
        });

        this.controls.freqBtns.forEach(b => {
            const active = parseFloat(b.dataset.freq) === this.frequency;
            b.classList.toggle('bg-amber-600', active);
            b.classList.toggle('text-white', active);
            b.classList.toggle('bg-slate-800', !active);
            b.classList.toggle('text-slate-400', !active);
        });
    }

    renderControls() {
        return `
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3 text-center">Simulation View</label>
                    <div class="flex gap-2">
                        <button class="view-btn w-full p-2 rounded-lg bg-indigo-600 text-white border border-slate-700 text-[9px] font-black uppercase tracking-wider transition-all" data-view="network">Network</button>
                        <button class="view-btn w-full p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-black uppercase tracking-wider transition-all" data-view="circuit">Circuitry</button>
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Operating Frequency</label>
                    <div class="flex gap-2">
                        <button class="freq-btn w-full p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-black tracking-wider transition-all" data-freq="2.4">2.4 GHz</button>
                        <button class="freq-btn w-full p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-black tracking-wider transition-all" data-freq="5.0">5.0 GHz</button>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-3">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">TX Power (dBm)</label>
                        <span class="text-[10px] font-mono text-indigo-400">${this.txPower} dBm</span>
                    </div>
                    <input type="range" id="ctrl-tx-power" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" min="5" max="30" value="${this.txPower}">
                </div>

                <div class="flex items-center justify-between p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <div class="flex flex-col">
                        <span class="text-[10px] font-bold text-white uppercase">MIMO Beamforming</span>
                        <span class="text-[8px] text-slate-500 uppercase">Targeted Signal</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="ctrl-beamforming" class="sr-only peer">
                        <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;

        if (this.view === 'network') {
            this.renderNetworkView(root);
        } else {
            this.renderCircuitView(root);
        }

        this.updateStats();
    }

    renderNetworkView(root) {
        const waveCount = 5;
        const speed = this.frequency === 2.4 ? 3 : 1.5;
        const color = this.frequency === 2.4 ? '#fbbf24' : '#6366f1';

        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Router Core -->
                <rect x="185" y="140" width="30" height="40" rx="4" fill="#1e293b" />
                <rect x="175" y="170" width="50" height="10" rx="2" fill="#0f172a" />
                
                <!-- Antennas -->
                <line x1="190" y1="140" x2="180" y2="100" stroke="#334155" stroke-width="3" />
                <line x1="210" y1="140" x2="220" y2="100" stroke="#334155" stroke-width="3" />

                <!-- Signal Waves -->
                ${Array.from({ length: waveCount }, (_, i) => {
            const radius = 20 + i * 30;
            if (this.beamforming) {
                return `
                            <path d="M 200 120 Q 250 ${120 - radius} 350 120" stroke="${color}" stroke-width="2" fill="none" opacity="${(this.txPower / 30) * (1 - i / waveCount)}">
                                <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="${speed}s" repeatCount="indefinite" />
                            </path>
                        `;
            }
            return `
                        <circle cx="200" cy="120" r="${radius}" stroke="${color}" stroke-width="2" fill="none" opacity="${(this.txPower / 30) * (1 - i / waveCount)}">
                            <animate attributeName="r" from="${radius}" to="${radius + 30}" dur="${speed}s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="${(this.txPower / 30) * (1 - i / waveCount)}" to="0" dur="${speed}s" repeatCount="indefinite" />
                        </circle>
                    `;
        }).join('')}

                <!-- Devices -->
                <iconify-icon icon="solar:smartphone-bold" x="350" y="80" class="text-slate-700 text-xl"></iconify-icon>
                <iconify-icon icon="solar:laptop-bold" x="50" y="60" class="text-slate-700 text-xl"></iconify-icon>
                
                <text x="200" y="195" text-anchor="middle" fill="#64748b" font-size="8" font-family="monospace" class="uppercase tracking-widest">PROPAGATION: ${this.frequency}GHZ BAND</text>
            </svg>
        `;
    }

    renderCircuitView(root) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- PCB -->
                <rect x="50" y="40" width="300" height="120" rx="8" fill="#064e3b" stroke="#065f46" stroke-width="4" />
                
                <!-- SoC (CPU/WIFI) -->
                <rect x="160" y="80" width="80" height="40" rx="4" fill="#334155" />
                <text x="200" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">WIFI-SOC</text>

                <!-- RAM -->
                <rect x="260" y="80" width="40" height="40" rx="2" fill="#1e293b" />
                
                <!-- Ethernet Ports -->
                ${Array.from({ length: 4 }, (_, i) => `
                    <rect x="${70 + i * 20}" y="35" width="15" height="15" fill="#facc15" opacity="0.8" />
                `).join('')}

                <!-- RF Chain -->
                <rect x="140" y="130" width="120" height="20" rx="2" fill="#94a3b8" />
                <text x="200" y="145" text-anchor="middle" fill="#0f172a" font-size="8">802.11ax FEM</text>

                <!-- Heat Warning -->
                ${this.txPower > 25 ? `
                    <circle cx="330" cy="60" r="5" fill="#f43f5e" class="animate-pulse" />
                    <text x="320" y="50" text-anchor="middle" fill="#f43f5e" font-size="8" font-weight="bold">OVERHEAT</text>
                ` : ''}

                <!-- Traces -->
                <path d="M 160 100 L 100 100 L 100 50" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.3" />
                <path d="M 240 100 L 260 100" stroke="#fbbf24" stroke-width="1" fill="none" opacity="0.3" />
            </svg>
        `;
    }

    updateStats() {
        const penetration = this.frequency === 2.4 ? 'HIGH' : 'LOW';
        const throughput = this.frequency === 2.4 ? '600 Mbps' : '2400 Mbps';
        const range = Math.floor(this.txPower * (this.frequency === 2.4 ? 5 : 2));

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>SIGNAL BAND:</span> <span class="text-white">${this.frequency} GHz</span></div>
            <div class="flex justify-between text-slate-400"><span>THROUGHPUT:</span> <span class="text-indigo-400 font-bold">${throughput}</span></div>
            <div class="flex justify-between text-slate-400"><span>WALL PENETRATION:</span> <span class="${penetration === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'}">${penetration}</span></div>
            <div class="flex justify-between text-slate-400"><span>EST. RANGE:</span> <span class="text-white font-mono">${range} METERS</span></div>
        `;
    }
}
