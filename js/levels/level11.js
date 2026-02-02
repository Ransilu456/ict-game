/**
 * Level 11: Smart Network (IoT)
 * Mechanic: Connect sensors to the Gateway.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.connectedCount = 0;
        this.totalSensors = 3;

        this.sensors = [
            { id: 'temp', name: this.game.getText('L11_SENSOR_TEMP'), icon: 'solar:thermometer-bold-duotone', color: 'text-orange-400' },
            { id: 'light', name: this.game.getText('L11_SENSOR_LIGHT'), icon: 'solar:sun-bold-duotone', color: 'text-yellow-400' },
            { id: 'motion', name: this.game.getText('L11_SENSOR_MOTION'), icon: 'solar:walking-bold-duotone', color: 'text-blue-400' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto flex flex-col items-center">
                <div class="text-center mb-12">
                    <h2 class="text-2xl font-bold text-white mb-2">${this.game.getText('L11_TITLE')}</h2>
                    <p class="text-slate-400">${this.game.getText('L11_DESC')}</p>
                </div>

                <!-- Central Hub -->
                <div class="relative w-64 h-64 mb-16 flex items-center justify-center">
                    <!-- Rotating rings -->
                    <div class="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full animate-spin-slow"></div>
                    <div class="absolute inset-4 border border-indigo-500/10 rounded-full animate-spin-reverse-slow"></div>
                    
                    <div id="iot-hub" class="w-32 h-32 bg-slate-900 border-2 border-indigo-500 flex flex-col items-center justify-center rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] z-10">
                        <iconify-icon icon="solar:globus-bold-duotone" class="text-4xl text-indigo-400 mb-1"></iconify-icon>
                        <span class="text-[10px] font-black text-white uppercase tracking-tighter">${this.game.getText('L11_HUB')}</span>
                    </div>

                    <!-- Connection Lines (SVG) -->
                    <svg class="absolute inset-0 w-full h-full pointer-events-none" id="connections-svg">
                    </svg>
                </div>

                <!-- Sensors -->
                <div class="grid grid-cols-3 gap-8 w-full">
                    ${this.sensors.map(sensor => `
                        <div class="sensor-node flex flex-col items-center gap-3 group" data-id="${sensor.id}">
                            <div class="w-20 h-20 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-all shadow-lg active:scale-95" id="sensor-${sensor.id}">
                                <iconify-icon icon="${sensor.icon}" class="text-3xl ${sensor.color} group-hover:scale-110 transition-transform"></iconify-icon>
                            </div>
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${sensor.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <style>
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes spin-reverse-slow { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                .animate-spin-slow { animation: spin-slow 10s linear infinite; }
                .animate-spin-reverse-slow { animation: spin-reverse-slow 15s linear infinite; }
                
                .connection-line {
                    stroke: #6366f1;
                    stroke-width: 2;
                    stroke-dasharray: 5;
                    animation: dash 2s linear infinite;
                    opacity: 0.5;
                }
                @keyframes dash {
                    to { stroke-dashoffset: -20; }
                }
            </style>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const hub = document.getElementById('iot-hub');
        const hubRect = hub.getBoundingClientRect();
        const hubCenter = {
            x: hubRect.left + hubRect.width / 2,
            y: hubRect.top + hubRect.height / 2
        };

        this.sensors.forEach(sensor => {
            const el = document.getElementById(`sensor-${sensor.id}`);
            el.onclick = () => {
                if (el.dataset.connected) return;

                el.dataset.connected = "true";
                el.classList.replace('border-slate-800', 'border-emerald-500');
                el.classList.add('bg-emerald-500/10');

                this.drawConnection(el, sensor.id);
                this.connectedCount++;
                this.score += 500;

                if (this.connectedCount === this.totalSensors) {
                    setTimeout(() => this.finishLevel(), 1000);
                }
            };
        });
    },

    drawConnection(sensorEl, id) {
        const svg = document.getElementById('connections-svg');
        const hub = document.getElementById('iot-hub');

        const hubRect = hub.getBoundingClientRect();
        const sensorRect = sensorEl.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        const x1 = sensorRect.left + sensorRect.width / 2 - svgRect.left;
        const y1 = sensorRect.top + sensorRect.height / 2 - svgRect.top;
        const x2 = hubRect.left + hubRect.width / 2 - svgRect.left;
        const y2 = hubRect.top + hubRect.height / 2 - svgRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'connection-line');

        svg.appendChild(line);
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.score,
            xp: 1500,
            accuracy: 100
        });
    }
};
