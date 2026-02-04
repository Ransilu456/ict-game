/**
 * Level 11: Smart Network (IoT)
 * Mechanic: Connect sensors to the Gateway.
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.connectedCount = 0;
        this.results = [];

        this.sensors = [
            { id: 'temp', name: this.game.getText('L11_SENSOR_TEMP'), icon: 'solar:thermometer-bold-duotone', color: 'orange' },
            { id: 'light', name: this.game.getText('L11_SENSOR_LIGHT'), icon: 'solar:sun-bold-duotone', color: 'yellow' },
            { id: 'motion', name: this.game.getText('L11_SENSOR_MOTION'), icon: 'solar:walking-bold-duotone', color: 'blue' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';

        const header = new Card({
            title: this.game.getText('L11_TITLE'),
            subtitle: this.game.getText('L11_DESC'),
            variant: 'flat',
            customClass: 'text-center mb-8'
        });

        const statusFeedback = new Feedback({
            title: "Network Synchronization",
            message: "Identify and link active IoT nodes to the central processing hub.",
            type: "neutral"
        });

        const playground = document.createElement('div');
        playground.className = "relative h-[400px] w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden";

        playground.innerHTML = `
            <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#6366f1 1px, transparent 1px); background-size: 30px 30px;"></div>
            <svg class="absolute inset-0 w-full h-full pointer-events-none" id="iot-connections-svg"></svg>
        `;

        const hub = document.createElement('div');
        hub.id = "iot-hub";
        hub.className = "w-32 h-32 bg-slate-950 border-2 border-indigo-500 rounded-3xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] z-50 relative group";
        hub.innerHTML = `
            <div class="absolute inset-0 border border-indigo-500/20 rounded-3xl animate-ping group-hover:scale-110 transition-transform"></div>
            <iconify-icon icon="solar:globus-bold-duotone" class="text-4xl text-indigo-400 mb-1"></iconify-icon>
            <span class="text-[10px] font-black text-white uppercase tracking-tighter">${this.game.getText('L11_HUB')}</span>
        `;
        playground.appendChild(hub);

        const sensorContainer = document.createElement('div');
        sensorContainer.className = "flex justify-center gap-12 w-full mt-16 relative z-10";

        this.sensors.forEach(sensor => {
            const isConnected = this.results.find(r => r.id === sensor.id);
            const el = document.createElement('div');
            el.className = "flex flex-col items-center gap-3";
            el.innerHTML = `
                <button id="sensor-${sensor.id}" class="w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all shadow-lg active:scale-95 group/sensor ${isConnected ? `bg-emerald-500/10 border-emerald-500 shadow-emerald-500/20` : 'bg-slate-950 border-slate-800 hover:border-indigo-500'}" ${isConnected ? 'disabled' : ''}>
                    <iconify-icon icon="${sensor.icon}" class="text-3xl ${isConnected ? 'text-emerald-400' : `text-${sensor.color}-400`} group-hover/sensor:scale-110 transition-transform"></iconify-icon>
                </button>
                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">${sensor.name}</span>
            `;
            sensorContainer.appendChild(el);
        });

        playground.appendChild(sensorContainer);

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render());
        this.container.appendChild(playground);

        this.attachEvents();
    },

    attachEvents() {
        this.sensors.forEach(sensor => {
            const btn = document.getElementById(`sensor-${sensor.id}`);
            if (!btn || btn.disabled) return;

            btn.onclick = () => {
                this.handleConnect(sensor.id);
            };
        });
    },

    handleConnect(id) {
        const sensor = this.sensors.find(s => s.id === id);

        this.results.push({
            id: id,
            question: `Link ${sensor.name}`,
            selected: "Handshake Established",
            correct: "Handshake Established",
            isCorrect: true
        });

        this.connectedCount++;
        this.render();
        this.drawConnection(id);

        if (this.connectedCount === this.sensors.length) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    drawConnection(id) {
        const svg = document.getElementById('iot-connections-svg');
        const hub = document.getElementById('iot-hub');
        const sensorEl = document.getElementById(`sensor-${id}`);
        if (!svg || !hub || !sensorEl) return;

        const svgRect = svg.getBoundingClientRect();
        const hubRect = hub.getBoundingClientRect();
        const sensorRect = sensorEl.getBoundingClientRect();

        const x1 = sensorRect.left + sensorRect.width / 2 - svgRect.left;
        const y1 = sensorRect.top + sensorRect.height / 2 - svgRect.top;
        const x2 = hubRect.left + hubRect.width / 2 - svgRect.left;
        const y2 = hubRect.top + hubRect.height / 2 - svgRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#6366f1');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5');
        line.setAttribute('class', 'animate-dash');
        svg.appendChild(line);
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.connectedCount * 500,
            xp: 1500,
            accuracy: 100,
            detailedResults: this.results
        });
    }
};
