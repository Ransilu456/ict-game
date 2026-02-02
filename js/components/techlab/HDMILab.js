import LabSimulation from './LabSimulation.js';

export default class HDMILab extends LabSimulation {
    cacheControls() {
        super.cacheControls();
        this.controls.bandwidth = document.getElementById('ctrl-bandwidth');
        this.controls.refresh = document.getElementById('ctrl-refresh');
    }

    attachEvents() {
        super.attachEvents();
        this.controls.bandwidth.oninput = () => this.update();
        this.controls.refresh.onchange = () => this.update();
    }

    renderControls() {
        return `
            ${this.renderViewToggle()}
            <div class="space-y-6">
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
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;
        const bw = this.controls.bandwidth.value;
        const hz = this.controls.refresh.value;

        if (this.view === 'circuitry') {
            this.renderCircuitry(root, bw, hz);
        } else {
            this.renderFunctional(root, bw, hz);
        }

        const chroma = bw > 30 ? '4:4:4' : '4:2:2';
        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>THROUGHPUT:</span> <span class="text-white">${bw} Gbps</span></div>
            <div class="flex justify-between text-slate-400"><span>FRAME RATE:</span> <span class="text-indigo-400">${hz} FPS</span></div>
            <div class="flex justify-between text-slate-400"><span>CHROMA:</span> <span class="text-emerald-400">${chroma}</span></div>
        `;
    }

    renderFunctional(root, bw, hz) {
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
    }

    renderCircuitry(root, bw, hz) {
        root.innerHTML = `
            <svg viewBox="0 0 400 200" class="w-full">
                <!-- Transmitter IC -->
                <rect x="40" y="60" width="100" height="80" rx="8" fill="#1e1b4b" stroke="#4338ca" />
                <text x="90" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="black">HDMI TX</text>

                <!-- Transition Minimized Encoding Logic -->
                <rect x="160" y="70" width="80" height="60" rx="4" fill="#334155" />
                <text x="200" y="105" text-anchor="middle" fill="white" font-size="8">TMDS CORE</text>

                <!-- Connector Pins -->
                ${Array.from({ length: 19 }, (_, i) => `
                    <rect x="300" y="${40 + i * 6}" width="30" height="3" fill="#fbbf24" opacity="0.8" />
                `).join('')}
                <text x="315" y="30" text-anchor="middle" fill="#94a3b8" font-size="8">TYPE-A PINOUT</text>

                <!-- Differential Pairs -->
                <path d="M 140 90 L 160 90" stroke="#fbbf24" stroke-width="1" />
                <path d="M 240 100 L 300 100" stroke="#fbbf24" stroke-width="2">
                    <animate attributeName="stroke-dasharray" from="0,10" to="10,0" dur="0.2s" repeatCount="indefinite" />
                </path>

                <text x="200" y="185" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">PRACTICAL: 8B/10B ENCODING -> PHYSICAL PINS</text>
            </svg>
        `;
    }
}
