/**
 * Level 11: Smart Network (IoT)
 * Mechanic: Connect sensors to the Gateway.
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

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

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full items-center";

        const header = new Card({
            title: this.game.getText('L11_TITLE'),
            subtitle: this.game.getText('L11_DESC'),
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const statusFeedback = new Feedback({
            title: "Network Synchronization",
            message: "Identify and link active IoT nodes to the central hub.",
            type: "neutral"
        });
        content.appendChild(statusFeedback.render());

        const playground = document.createElement('div');
        playground.className = "relative min-h-[350px] w-full max-w-2xl mx-auto flex flex-col items-center justify-between p-6 sm:p-10 bg-slate-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl";

        playground.innerHTML = `
            <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#6366f1 1px, transparent 1px); background-size: 20px 20px;"></div>
            <svg class="absolute inset-0 w-full h-full pointer-events-none z-0" id="iot-connections-svg"></svg>
        `;

        const hub = document.createElement('div');
        hub.id = "iot-hub";
        hub.className = "w-24 h-24 sm:w-32 sm:h-32 bg-slate-900 border-2 border-indigo-500/50 rounded-3xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.2)] z-10 relative group bg-gradient-to-b from-slate-800 to-slate-900";
        hub.innerHTML = `
            <div class="absolute inset-0 border border-indigo-500/20 rounded-3xl animate-ping group-hover:scale-110 transition-transform"></div>
            <iconify-icon icon="solar:globus-bold-duotone" class="text-3xl sm:text-4xl text-indigo-400 mb-1"></iconify-icon>
            <span class="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-widest">${this.game.getText('L11_HUB')}</span>
        `;
        playground.appendChild(hub);

        const sensorContainer = document.createElement('div');
        sensorContainer.className = "flex flex-wrap justify-center gap-6 sm:gap-12 w-full mt-8 relative z-10";

        this.sensors.forEach(sensor => {
            const isConnected = this.results.find(r => r.id === sensor.id);
            const el = document.createElement('div');
            el.className = "flex flex-col items-center gap-2";
            el.innerHTML = `
                <button id="sensor-${sensor.id}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border-2 transition-all shadow-lg active:scale-90 group/sensor ${isConnected ? 'bg-emerald-500/10 border-emerald-500/50 shadow-emerald-500/10' : 'bg-slate-900/80 border-white/10 hover:border-indigo-500/50'}" ${isConnected ? 'disabled' : ''}>
                    <iconify-icon icon="${sensor.icon}" class="text-2xl sm:text-3xl ${isConnected ? 'text-emerald-400' : `text-${sensor.color}-400`} group-hover/sensor:scale-110 transition-transform"></iconify-icon>
                </button>
                <span class="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">${sensor.name}</span>
            `;
            sensorContainer.appendChild(el);
        });

        playground.appendChild(sensorContainer);
        content.appendChild(playground);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());

        this.attachEvents();

        // Initial SVG resize to ensure it's correct
        requestAnimationFrame(() => this.updateAllConnections());
        window.addEventListener('resize', () => this.updateAllConnections());
    },

    attachEvents() {
        this.sensors.forEach(sensor => {
            const btn = this.container.querySelector(`#sensor-${sensor.id}`);
            if (!btn || btn.disabled) return;
            btn.onclick = () => this.handleConnect(sensor.id);
        });
    },

    handleConnect(id) {
        const sensor = this.sensors.find(s => s.id === id);
        this.results.push({ id, question: `Connect ${sensor.name}`, isCorrect: true });
        this.connectedCount++;
        this.render();

        if (this.connectedCount === this.sensors.length) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    updateAllConnections() {
        const svg = this.container.querySelector('#iot-connections-svg');
        if (!svg) return;
        svg.innerHTML = '';
        this.results.forEach(res => {
            if (res.isCorrect) this.drawConnection(res.id);
        });
    },

    drawConnection(id) {
        const svg = this.container.querySelector('#iot-connections-svg');
        const hub = this.container.querySelector('#iot-hub');
        const sensorEl = this.container.querySelector(`#sensor-${id}`);
        if (!svg || !hub || !sensorEl) return;

        const svgRect = svg.getBoundingClientRect();
        const hubRect = hub.getBoundingClientRect();
        const sensorRect = sensorEl.getBoundingClientRect();

        const x1 = sensorRect.left + sensorRect.width / 2 - svgRect.left;
        const y1 = sensorRect.top + sensorRect.height / 2 - svgRect.top;
        const x2 = hubRect.left + hubRect.width / 2 - svgRect.left;
        const y2 = hubRect.top + hubRect.height / 2 - svgRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1); line.setAttribute('y1', y1);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#6366f1');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '4');
        line.setAttribute('class', 'animate-dash opacity-60');
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

