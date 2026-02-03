import LabSimulation from './LabSimulation.js';
import ThreeDComponents from '../ThreeDComponents.js';

export default class StreamingLab extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.isLive = false;
        this.bitrate = 6000;
        this.resolution = '1080p';
        this.protocol = 'RTMP';
        this.encoder = 'H.264';
        this.flowStage = 0; // 0: Idle, 1: Camera, 2: Wireless, 3: Switcher, 4: Encoder, 5: Cloud
    }

    cacheControls() {
        super.cacheControls();
        this.controls.bitrate = document.getElementById('ctrl-bitrate');
        this.controls.resBtns = document.querySelectorAll('.res-btn');
        this.controls.protocolBtns = document.querySelectorAll('.proto-btn');
        this.controls.goLiveBtn = document.getElementById('ctrl-golive');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.bitrate.oninput = (e) => {
            this.bitrate = parseInt(e.target.value);
            this.update();
        };

        this.controls.resBtns.forEach(btn => {
            btn.onclick = () => {
                this.resolution = btn.dataset.res;
                this.updateUIState();
                this.update();
            };
        });

        this.controls.protocolBtns.forEach(btn => {
            btn.onclick = () => {
                this.protocol = btn.dataset.proto;
                this.updateUIState();
                this.update();
            };
        });

        this.controls.goLiveBtn.onclick = () => this.toggleLive();
    }

    updateUIState() {
        this.controls.resBtns.forEach(btn => {
            const active = btn.dataset.res === this.resolution;
            btn.classList.toggle('bg-indigo-600', active);
            btn.classList.toggle('text-white', active);
            btn.classList.toggle('bg-slate-800', !active);
        });

        this.controls.protocolBtns.forEach(btn => {
            const active = btn.dataset.proto === this.protocol;
            btn.classList.toggle('bg-indigo-600', active);
            btn.classList.toggle('text-white', active);
            btn.classList.toggle('bg-slate-800', !active);
        });
    }

    toggleLive() {
        if (this.isLive) {
            this.isLive = false;
            this.flowStage = 0;
            this.update();
        } else {
            this.startFlowSequence();
        }
    }

    startFlowSequence() {
        this.isLive = true;
        this.flowStage = 1;
        this.update();

        const sequence = [
            { stage: 2, delay: 1000 },
            { stage: 3, delay: 2000 },
            { stage: 4, delay: 3000 },
            { stage: 5, delay: 4000 }
        ];

        sequence.forEach(item => {
            setTimeout(() => {
                if (this.isLive) {
                    this.flowStage = item.stage;
                    this.update();
                }
            }, item.delay);
        });
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Transmission Pipeline</label>
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-bold text-slate-400 uppercase">Target Bitrate</label>
                                <span class="text-[10px] font-mono text-indigo-400">${this.bitrate} Kbps</span>
                            </div>
                            <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-bitrate" min="1000" max="15000" step="500" value="${this.bitrate}">
                        </div>

                        <div>
                            <label class="block text-[9px] font-bold text-slate-400 uppercase mb-2">Resolution</label>
                            <div class="grid grid-cols-3 gap-1.5">
                                ${['720p', '1080p', '4K'].map(res => `
                                    <button class="res-btn p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[9px] font-black transition-all ${this.resolution === res ? 'bg-indigo-600 text-white' : 'text-slate-500'}" data-res="${res}">${res}</button>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <label class="block text-[9px] font-bold text-slate-400 uppercase mb-2">Stream Protocol</label>
                            <div class="grid grid-cols-3 gap-1.5">
                                ${['RTMP', 'SRT', 'HLS'].map(proto => `
                                    <button class="proto-btn p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[9px] font-black transition-all ${this.protocol === proto ? 'bg-indigo-600 text-white' : 'text-slate-500'}" data-proto="${proto}">${proto}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-4">
                    <button id="ctrl-golive" class="w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg ${this.isLive ? 'bg-rose-600 text-white shadow-rose-500/20' : 'bg-emerald-600 text-white shadow-emerald-500/20 hover:scale-[1.02]'}">
                        ${this.isLive ? 'Stop Stream' : 'Go Live'}
                    </button>
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#sim-viewport') || this.container;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root);
        } else {
            this.renderFunctional(root);
        }

        if (this.stats) {
            this.stats.innerHTML = `
                <div class="flex justify-between text-slate-400"><span>STATUS:</span> <span class="${this.isLive ? 'text-rose-500 animate-pulse' : 'text-slate-600'} font-bold">${this.isLive ? 'LIVE' : 'OFFLINE'}</span></div>
                <div class="flex justify-between text-slate-400"><span>DROPPED FRAMES:</span> <span class="text-white">0</span></div>
                <div class="flex justify-between text-slate-400"><span>UPLINK:</span> <span class="text-indigo-400">${this.isLive ? (this.bitrate / 1000).toFixed(1) + ' Mbps' : '0 Mbps'}</span></div>
            `;
        }
    }

    renderFunctional(root) {
        const s = this.flowStage;

        root.innerHTML = `
            <div class="w-full h-full relative flex items-center justify-center p-8 bg-slate-950/50 rounded-[2.5rem] overflow-hidden">
                <!-- Background Flow Grid -->
                <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#6366f1 1px, transparent 1px); background-size: 40px 40px;"></div>

                <!-- Signal Flow Canvas -->
                <svg viewBox="0 0 800 400" class="w-full h-full relative z-10">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    <!-- Path Lines -->
                    <g opacity="0.2">
                        <path d="M 150 200 L 250 200" stroke="white" stroke-width="2" stroke-dasharray="4 4" />
                        <path d="M 330 200 L 400 200" stroke="white" stroke-width="2" stroke-dasharray="4 4" />
                        <path d="M 480 200 L 550 200" stroke="white" stroke-width="2" stroke-dasharray="4 4" />
                        <path d="M 630 200 L 700 200" stroke="white" stroke-width="2" stroke-dasharray="4 4" />
                    </g>

                    <!-- Active Signal Flow -->
                    ${this.isLive ? `
                        <path d="M 150 200 L 250 200" stroke="#6366f1" stroke-width="3" filter="url(#glow)" stroke-dasharray="10 10" class="${s >= 1 ? 'opacity-100' : 'opacity-0'}">
                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite" />
                        </path>
                        <path d="M 330 200 L 400 200" stroke="#6366f1" stroke-width="3" filter="url(#glow)" stroke-dasharray="10 10" class="${s >= 2 ? 'opacity-100' : 'opacity-0'}">
                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite" />
                        </path>
                        <path d="M 480 200 L 550 200" stroke="#10b981" stroke-width="3" filter="url(#glow)" stroke-dasharray="10 10" class="${s >= 3 ? 'opacity-100' : 'opacity-0'}">
                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite" />
                        </path>
                        <path d="M 630 200 L 700 200" stroke="#f43f5e" stroke-width="4" filter="url(#glow)" stroke-dasharray="15 5" class="${s >= 4 ? 'opacity-100' : 'opacity-0'}">
                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.5s" repeatCount="indefinite" />
                        </path>
                    ` : ''}

                    <!-- Nodes -->
                    <!-- 1. Source (Camera) -->
                    <g transform="translate(70, 160)" class="transition-all duration-500 ${s >= 1 ? 'scale-110' : 'opacity-40'}">
                        <foreignObject width="80" height="80">
                            <div class="w-full h-full flex flex-col items-center">
                                ${ThreeDComponents.getCameraSVG('#6366f1')}
                                <span class="text-[7px] font-black text-slate-400 uppercase mt-1">Source</span>
                            </div>
                        </foreignObject>
                    </g>

                    <!-- 2. Processing (Switcher) -->
                    <g transform="translate(250, 160)" class="transition-all duration-500 ${s >= 2 ? 'scale-110' : 'opacity-40'}">
                        <foreignObject width="80" height="80">
                            <div class="w-full h-full flex flex-col items-center">
                                ${ThreeDComponents.getSwitchSVG('#6366f1')}
                                <span class="text-[7px] font-black text-slate-400 uppercase mt-1">Production</span>
                            </div>
                        </foreignObject>
                    </g>

                    <!-- 3. Encoder -->
                    <g transform="translate(400, 160)" class="transition-all duration-500 ${s >= 3 ? 'scale-110' : 'opacity-40'}">
                        <foreignObject width="80" height="80">
                            <div class="w-full h-full flex flex-col items-center">
                                ${ThreeDComponents.getEncoderSVG('#10b981')}
                                <span class="text-[7px] font-black text-slate-400 uppercase mt-1">Encoder</span>
                            </div>
                        </foreignObject>
                    </g>

                    <!-- 4. Network (Router) -->
                    <g transform="translate(550, 160)" class="transition-all duration-500 ${s >= 4 ? 'scale-110' : 'opacity-40'}">
                        <foreignObject width="80" height="80">
                            <div class="w-full h-full flex flex-col items-center">
                                ${ThreeDComponents.getRouterSVG('#10b981')}
                                <span class="text-[7px] font-black text-slate-400 uppercase mt-1">Uplink</span>
                            </div>
                        </foreignObject>
                    </g>

                    <!-- 5. Cloud/CDN -->
                    <g transform="translate(700, 160)" class="transition-all duration-500 ${s >= 5 ? 'scale-110 animate-pulse' : 'opacity-40'}">
                        <foreignObject width="80" height="80">
                            <div class="w-full h-full flex flex-col items-center justify-center">
                                <iconify-icon icon="solar:cloud-bold" class="text-4xl ${s >= 5 ? 'text-rose-500' : 'text-slate-800'}"></iconify-icon>
                                <span class="text-[7px] font-black text-slate-400 uppercase mt-1">CDN</span>
                            </div>
                        </foreignObject>
                    </g>
                </svg>

                <!-- Live Status Badge -->
                <div class="absolute top-10 right-10 flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full transition-all duration-500 ${this.isLive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}">
                    <div class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <span class="text-[10px] font-black text-white tracking-[0.2em] uppercase">ON AIR</span>
                </div>
            </div>
        `;
    }

    renderCircuitry(root) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Buffer Input -->
                <rect x="20" y="70" width="60" height="40" rx="4" fill="#1e293b" />
                <text x="50" y="95" text-anchor="middle" fill="#94a3b8" font-size="8">BUFFER</text>

                <!-- Compressor Engine -->
                <rect x="100" y="60" width="100" height="60" rx="8" fill="#1e1b4b" stroke="#4338ca" />
                <text x="150" y="95" text-anchor="middle" fill="white" font-size="12" font-weight="black">${this.encoder}</text>
                <text x="150" y="50" text-anchor="middle" fill="#94a3b8" font-size="8">COMPRESSION ENGINE</text>

                <!-- Packetizer -->
                <rect x="220" y="70" width="80" height="40" rx="4" fill="#334155" />
                <text x="260" y="95" text-anchor="middle" fill="white" font-size="9" font-weight="bold">${this.protocol}</text>

                <!-- Network Stack -->
                <path d="M 320 60 L 380 90 L 320 120 Z" fill="#4338ca" opacity="0.6" />
                <text x="350" y="140" text-anchor="middle" fill="#94a3b8" font-size="8">TX STACK</text>

                <!-- Traces -->
                <line x1="80" y1="90" x2="100" y2="90" stroke="#6366f1" stroke-width="2" />
                <line x1="200" y1="90" x2="220" y2="90" stroke="#6366f1" stroke-width="2" />
                <line x1="300" y1="90" x2="320" y2="90" stroke="#6366f1" stroke-width="2" />

                <text x="200" y="180" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">FLOW: BUFFER -> COMPRESS -> PACKETIZE -> EMIT</text>
            </svg>
        `;
    }
}
