/**
 * Level 14: Transmission History & Ports
 * Mechanic: Timeline Sorting + Port Matching.
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
        this.itemsMatched = 0;
        this.results = [];

        this.timeline = [
            { id: 'h1', text: 'ARPANET Protocol', year: '1969', target: 'pos1' },
            { id: 'h2', text: 'Creation of WWW', year: '1989', target: 'pos2' },
            { id: 'h3', text: 'IPv6 Launch', year: '2012', target: 'pos3' }
        ];

        this.ports = [
            { id: 'p1', port: '80', service: 'HTTP (Web)', target: 'target-p1' },
            { id: 'p2', port: '443', service: 'HTTPS (Secure)', target: 'target-p2' },
            { id: 'p3', port: '22', service: 'SSH (Remote)', target: 'target-p3' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';

        const header = new Card({
            title: this.game.getText('L14_TITLE'),
            subtitle: this.game.getText('L14_DESC'),
            variant: 'flat',
            customClass: 'text-center mb-8'
        });

        const statusFeedback = new Feedback({
            title: "Network Evolution Audit",
            message: "Restore the chronological sequence of networking milestones and map their port assignments.",
            type: "neutral"
        });

        const timelineContainer = document.createElement('div');
        timelineContainer.className = "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative isolate";
        timelineContainer.innerHTML = `
            <div class="absolute top-1/2 left-0 w-full h-px bg-slate-800 -z-10 hidden md:block"></div>
            ${[1, 2, 3].map(i => `
                <div class="env-zone h-32 rounded-3xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center gap-2 transition-all relative" data-target="pos${i}">
                    <span class="text-[9px] font-black text-slate-700 uppercase tracking-widest">Epoch 0${i}</span>
                    <div class="slot w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-800 transition-all">
                        <iconify-icon icon="solar:history-bold" class="text-xl"></iconify-icon>
                    </div>
                </div>
            `).join('')}
        `;

        const portGrid = document.createElement('div');
        portGrid.className = "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12";
        this.ports.forEach(p => {
            const zone = document.createElement('div');
            zone.className = "env-zone h-32 rounded-3xl border-2 border-dashed border-emerald-500/10 bg-emerald-500/5 flex flex-col items-center justify-center gap-2 transition-all relative"
            zone.dataset.target = p.target;
            zone.innerHTML = `
                <span class="text-2xl font-black text-slate-800 font-mono tracking-tighter">${p.port}</span>
                <div class="slot w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-800 transition-all">
                    <iconify-icon icon="solar:plug-circle-bold" class="text-xl"></iconify-icon>
                </div>
            `;
            portGrid.appendChild(zone);
        });

        const tray = document.createElement('div');
        tray.className = "flex flex-wrap justify-center gap-4";

        this.timeline.forEach(item => {
            if (this.results.find(r => r.id === item.id && r.isCorrect)) return;
            const el = this.createTrayItem(item.id, `${item.text} (${item.year})`, item.target, 'indigo');
            tray.appendChild(el);
        });

        this.ports.forEach(item => {
            if (this.results.find(r => r.id === item.id && r.isCorrect)) return;
            const el = this.createTrayItem(item.id, item.service, item.target, 'emerald');
            tray.appendChild(el);
        });

        const trayCard = new Card({
            title: "Transmission Buffer",
            content: tray,
            variant: 'glass'
        });

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render());
        this.container.appendChild(new Card({ title: this.game.getText('L14_HIST_LBL'), content: timelineContainer, variant: 'flat', customClass: "mb-8 bg-slate-950/20 border-slate-800" }).render());
        this.container.appendChild(new Card({ title: this.game.getText('L14_PORT_LBL'), content: portGrid, variant: 'flat', customClass: "mb-8 bg-slate-950/20 border-slate-800" }).render());
        this.container.appendChild(trayCard.render());

        this.attachEvents();
    },

    createTrayItem(id, text, target, color) {
        const el = document.createElement('div');
        el.className = `node-item px-6 py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl cursor-grab active:cursor-grabbing text-[10px] font-black uppercase tracking-widest hover:border-${color}-500 transition-all shadow-xl`;
        el.draggable = true;
        el.dataset.id = id;
        el.dataset.target = target;
        el.innerText = text;
        return el;
    },

    attachEvents() {
        const nodes = this.container.querySelectorAll('.node-item');
        const zones = this.container.querySelectorAll('.env-zone');

        nodes.forEach(node => {
            node.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('nodeId', node.dataset.id);
                e.dataTransfer.setData('targetId', node.dataset.target);
                node.classList.add('opacity-50');
            });
            node.addEventListener('dragend', () => node.classList.remove('opacity-50'));
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('border-indigo-500', 'bg-indigo-500/10');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('border-indigo-500', 'bg-indigo-500/10');

                const nodeId = e.dataTransfer.getData('nodeId');
                const targetId = e.dataTransfer.getData('targetId');
                const zoneTarget = zone.dataset.target;

                this.handleDrop(nodeId, targetId, zoneTarget, zone);
            });
        });
    },

    handleDrop(nodeId, targetId, zoneTarget, zone) {
        const isMatch = targetId === zoneTarget;
        const itemText = this.container.querySelector(`[data-id="${nodeId}"]`).innerText;

        this.results.push({
            id: nodeId,
            question: "Fragment Identification",
            selected: itemText,
            correct: itemText,
            isCorrect: isMatch
        });

        if (isMatch) {
            this.itemsMatched++;
            const slot = zone.querySelector('.slot');
            slot.innerHTML = `<iconify-icon icon="solar:check-circle-bold" class="text-3xl text-emerald-400 animate-bounce-in"></iconify-icon>`;
            slot.classList.add('border-emerald-500/50', 'bg-emerald-500/10');
            this.render();
        } else {
            zone.classList.add('animate-shake');
            setTimeout(() => zone.classList.remove('animate-shake'), 500);
        }

        if (this.itemsMatched === 6) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.itemsMatched * 300,
            xp: 1500,
            accuracy: Math.round((this.itemsMatched / this.results.length) * 100),
            detailedResults: this.results
        });
    }
};
