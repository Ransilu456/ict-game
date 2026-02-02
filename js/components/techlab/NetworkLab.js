import LabSimulation from './LabSimulation.js';

export default class NetworkLab extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.currentPort = 1;
        this.mode = 'unicast';
    }

    cacheControls() {
        this.controls.portBtns = document.querySelectorAll('.port-btn');
        this.controls.modeSelect = document.getElementById('ctrl-mode');
    }

    attachEvents() {
        this.controls.portBtns.forEach(btn => {
            btn.onclick = () => {
                this.controls.portBtns.forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
                btn.classList.add('bg-indigo-600', 'text-white');
                this.currentPort = parseInt(btn.dataset.port);
                this.update();
            };
        });

        this.controls.modeSelect.onchange = () => {
            this.mode = this.controls.modeSelect.value;
            this.update();
        };
    }

    renderControls() {
        return `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Target Port</label>
                <div class="grid grid-cols-4 gap-2">
                    ${[1, 2, 3, 4, 5, 6, 7, 8].map(p => `
                        <button class="port-btn p-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:bg-indigo-600 hover:text-white transition-all font-mono ${p === this.currentPort ? 'bg-indigo-600 text-white' : ''}" data-port="${p}">P${p}</button>
                    `).join('')}
                </div>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Transmission Mode</label>
                <select id="ctrl-mode" class="w-full bg-slate-800 border-none rounded-lg text-xs text-white p-3 outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="unicast" ${this.mode === 'unicast' ? 'selected' : ''}>Unicast (Targeted)</option>
                    <option value="broadcast" ${this.mode === 'broadcast' ? 'selected' : ''}>Broadcast (Flood)</option>
                </select>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;

        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Switch Chassis -->
                <rect x="50" y="70" width="300" height="60" rx="10" fill="#1e293b" stroke="#334155" stroke-width="2" />
                <!-- Ports -->
                ${Array.from({ length: 8 }, (_, i) => {
            const x = 75 + i * 35;
            const active = (i + 1) === this.currentPort;
            return `
                        <rect x="${x}" y="85" width="25" height="25" rx="4" fill="${active ? '#6366f1' : '#0f172a'}" stroke="${active ? '#818cf8' : '#334155'}" />
                        <circle cx="${x + 12.5}" cy="${85 - 8}" r="3" fill="${active ? '#fbbf24' : '#1e293b'}" />
                    `;
        }).join('')}
                <!-- Data Flow -->
                <circle r="5" fill="#fbbf24" class="animate-bounce">
                    <animateMotion path="M 200 130 L 200 100 L ${75 + (this.currentPort - 1) * 35 + 12.5} 100" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x="200" y="160" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">INGRESS: PORT 1 -> EGRESS: PORT ${this.currentPort}</text>
            </svg>
        `;

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>MAC TABLE:</span> <span class="text-white">LEARNED: PORT ${this.currentPort}</span></div>
            <div class="flex justify-between text-slate-400"><span>VLAN ID:</span> <span class="text-indigo-400">DEFAULT (1)</span></div>
            <div class="flex justify-between text-slate-400"><span>PACKET MODE:</span> <span class="text-emerald-400 uppercase">${this.mode}</span></div>
        `;
    }
}
