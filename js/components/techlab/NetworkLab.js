import LabSimulation from './LabSimulation.js';
import ThreeDComponents from '../ThreeDComponents.js';

export default class NetworkLab extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.currentPort = 1;
        this.mode = 'unicast';
    }

    cacheControls() {
        super.cacheControls();
        this.controls.portBtns = document.querySelectorAll('.port-btn');
        this.controls.modeSelect = document.getElementById('ctrl-mode');
    }

    attachEvents() {
        super.attachEvents();
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
            ${this.renderViewToggle()}
            <div class="space-y-6">
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
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root);
        } else {
            this.renderFunctional(root);
        }

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>MAC TABLE:</span> <span class="text-white">LEARNED: PORT ${this.currentPort}</span></div>
            <div class="flex justify-between text-slate-400"><span>VLAN ID:</span> <span class="text-indigo-400">DEFAULT (1)</span></div>
            <div class="flex justify-between text-slate-400"><span>PACKET MODE:</span> <span class="text-emerald-400 uppercase">${this.mode}</span></div>
        `;
    }

    renderFunctional(root) {
        root.innerHTML = `
            <div class="flex flex-col items-center gap-10 w-full">
                <div class="relative w-72 h-48">
                    <div class="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full"></div>
                    ${ThreeDComponents.getSwitchSVG('#6366f1')}
                    
                    <!-- Port Activity Visualization -->
                    <svg viewBox="0 0 200 200" class="absolute inset-0 z-20 pointer-events-none">
                        ${Array.from({ length: 8 }, (_, i) => {
            const x = 50 + i * 12 + 4;
            const active = (i + 1) === this.currentPort;
            if (!active) return '';
            return `
                                <circle cx="${x}" cy="114" r="2" fill="#fbbf24" class="animate-ping" />
                            `;
        }).join('')}
                    </svg>
                </div>
                
                <div class="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/20 w-full max-w-md">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <iconify-icon icon="solar:globus-bold"></iconify-icon>
                            </div>
                            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Route Analysis</span>
                        </div>
                        <span class="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">L2 Forwarding</span>
                    </div>
                    
                    <div class="flex items-center gap-4 text-xs font-mono">
                        <div class="flex-1 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center gap-1">
                            <span class="text-[8px] text-slate-600 uppercase">Ingress</span>
                            <span class="text-white">PORT 1</span>
                        </div>
                        <iconify-icon icon="solar:alt-arrow-right-bold" class="text-slate-700"></iconify-icon>
                        <div class="flex-1 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center gap-1">
                            <span class="text-[8px] text-slate-600 uppercase">Egress</span>
                            <span class="text-white">PORT ${this.currentPort}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCircuitry(root) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- PCB -->
                <rect x="40" y="40" width="320" height="120" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="2" />

                <!-- ASIC / Switching Fabric -->
                <rect x="150" y="75" width="100" height="50" rx="4" fill="#1e1b4b" stroke="#4338ca" />
                <text x="200" y="100" text-anchor="middle" fill="white" font-size="10" font-weight="black">L2-ASIC</text>
                <text x="200" y="65" text-anchor="middle" fill="#94a3b8" font-size="8">SWITCHING FABRIC</text>

                <!-- MAC Table Memory -->
                <rect x="270" y="85" width="30" height="30" rx="2" fill="#334155" />
                <text x="285" y="125" text-anchor="middle" fill="#64748b" font-size="7">SRAM (CAM)</text>

                <!-- PHY Controllers -->
                ${Array.from({ length: 4 }, (_, i) => `
                    <rect x="${60 + i * 20}" y="80" width="12" height="40" fill="#334155" opacity="0.6" />
                `).join('')}
                <text x="90" y="70" text-anchor="middle" fill="#94a3b8" font-size="7">PHY ICs</text>

                <!-- Data Path Highlight -->
                <path d="M 60 100 L 150 100" stroke="#fbbf24" stroke-width="1" opacity="0.3" />
                <path d="M 250 100 L 320 100" stroke="#fbbf24" stroke-width="2">
                     <animate attributeName="stroke-dasharray" from="0,20" to="20,0" dur="0.5s" repeatCount="indefinite" />
                </path>

                <text x="200" y="185" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace" class="uppercase">PRACTICAL: HARDWARE ADDRESS LOOKUP -> SILICON CROSSBAR</text>
            </svg>
        `;
    }
}
