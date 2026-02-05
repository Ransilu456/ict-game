import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.itemsMatched = 0;
        this.results = [];
        this.selectedItemId = null;

        this.timeline_data = [
            { id: 'h1', text: 'ARPANET Protocol', year: '1969', target: 'pos1' },
            { id: 'h2', text: 'Creation of WWW', year: '1989', target: 'pos2' },
            { id: 'h3', text: 'IPv6 Launch', year: '2012', target: 'pos3' }
        ];

        this.ports_data = [
            { id: 'p1', port: '80', service: 'HTTP (Web)', target: 'target-p1' },
            { id: 'p2', port: '443', service: 'HTTPS (Secure)', target: 'target-p2' },
            { id: 'p3', port: '22', service: 'SSH (Remote)', target: 'target-p3' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';

        const content = document.createElement('div');
        content.className = "flex flex-col gap-8 w-full";

        const header = new Card({
            title: this.game.getText('L14_TITLE'),
            subtitle: this.game.getText('L14_DESC'),
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const statusFeedback = new Feedback({
            title: "Network Audit Protocol",
            message: this.selectedItemId ? "Now select the correct target slot for the active fragment." : "Restore the chronological sequence and map port assignments.",
            type: "neutral"
        });
        content.appendChild(statusFeedback.render());

        // Timeline Section
        const timelineGrid = document.createElement('div');
        timelineGrid.className = "grid grid-cols-1 md:grid-cols-3 gap-4 relative isolate";
        timelineGrid.innerHTML = `<div class="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-10 hidden md:block"></div>`;

        [1, 2, 3].forEach(i => {
            const posId = `pos${i}`;
            const matched = this.results.find(r => r.target === posId);
            const zone = document.createElement('div');
            zone.className = `env-zone h-32 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all relative cursor-pointer
                ${matched ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-950/40 border-slate-800 hover:border-indigo-500/30'}`;
            zone.dataset.target = posId;
            zone.innerHTML = `
                <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">Epoch 0${i}</span>
                <div class="slot w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-800 transition-all shadow-inner">
                    ${matched ? '<iconify-icon icon="solar:check-circle-bold" class="text-3xl text-emerald-400 animate-bounce-in"></iconify-icon>' : '<iconify-icon icon="solar:history-bold" class="text-2xl opacity-20"></iconify-icon>'}
                </div>
            `;
            zone.onclick = () => this.handleInteraction(posId, zone);
            timelineGrid.appendChild(zone);
        });

        const timelineCard = new Card({ title: this.game.getText('L14_HIST_LBL'), content: timelineGrid, variant: 'flat', customClass: "bg-slate-900/30 border border-white/5 p-6 rounded-3xl" });
        content.appendChild(timelineCard.render());

        // Port Section
        const portGrid = document.createElement('div');
        portGrid.className = "grid grid-cols-1 md:grid-cols-3 gap-4";
        this.ports_data.forEach(p => {
            const matched = this.results.find(r => r.target === p.target);
            const zone = document.createElement('div');
            zone.className = `env-zone h-32 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all relative cursor-pointer
                ${matched ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-950/40 border-slate-800 hover:border-emerald-500/30'}`;
            zone.dataset.target = p.target;
            zone.innerHTML = `
                <span class="text-3xl font-black text-slate-800 font-mono tracking-tighter opacity-50">${p.port}</span>
                <div class="slot w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-800 transition-all shadow-inner">
                    ${matched ? '<iconify-icon icon="solar:shield-check-bold" class="text-3xl text-emerald-400 animate-bounce-in"></iconify-icon>' : '<iconify-icon icon="solar:plug-circle-bold" class="text-2xl opacity-20"></iconify-icon>'}
                </div>
            `;
            zone.onclick = () => this.handleInteraction(p.target, zone);
            portGrid.appendChild(zone);
        });

        const portCard = new Card({ title: this.game.getText('L14_PORT_LBL'), content: portGrid, variant: 'flat', customClass: "bg-slate-900/30 border border-white/5 p-6 rounded-3xl" });
        content.appendChild(portCard.render());

        // Tray Section
        const tray = document.createElement('div');
        tray.className = "flex flex-wrap justify-center gap-4";

        const availableItems = [
            ...this.timeline_data.map(i => ({ ...i, type: 'timeline', color: 'indigo' })),
            ...this.ports_data.map(i => ({ ...i, type: 'port', color: 'emerald', text: i.service }))
        ].filter(item => !this.results.find(r => r.id === item.id));

        availableItems.forEach(item => {
            const isSelected = this.selectedItemId === item.id;
            const el = document.createElement('div');
            el.className = `node-item px-5 py-4 rounded-2xl border-2 text-[9px] font-black uppercase tracking-widest transition-all shadow-xl cursor-pointer select-none touch-none
                ${isSelected ? `bg-${item.color}-600 border-${item.color}-400 scale-105 shadow-${item.color}-500/20 text-white` : `bg-slate-900 border-slate-800 text-slate-400 hover:border-${item.color}-500/50`}`;
            el.draggable = true;
            el.dataset.id = item.id;
            el.dataset.target = item.target;
            el.innerText = item.text;

            el.onclick = (e) => {
                e.stopPropagation();
                this.selectedItemId = isSelected ? null : item.id;
                this.render();
            };

            tray.appendChild(el);
        });

        const trayCard = new Card({
            title: "Data Fragment Buffer",
            subtitle: "Select a fragment then tap its destination",
            content: tray,
            variant: 'glass'
        });
        content.appendChild(trayCard.render());

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());

        this.attachDragEvents();
    },

    attachDragEvents() {
        const nodes = this.container.querySelectorAll('.node-item');
        const zones = this.container.querySelectorAll('.env-zone');

        nodes.forEach(node => {
            node.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('nodeId', node.dataset.id);
                e.dataTransfer.setData('targetId', node.dataset.target);
                this.selectedItemId = node.dataset.id;
                node.classList.add('opacity-50');
            });
            node.addEventListener('dragend', () => node.classList.remove('opacity-50'));
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('border-indigo-500/50', 'bg-indigo-500/5');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('border-indigo-500/50', 'bg-indigo-500/5');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('border-indigo-500/50', 'bg-indigo-500/5');
                const nodeId = e.dataTransfer.getData('nodeId');
                const targetId = e.dataTransfer.getData('targetId');
                this.handleDrop(nodeId, targetId, zone.dataset.target, zone);
            });
        });
    },

    handleInteraction(zoneTarget, zoneEl) {
        if (!this.selectedItemId) return;
        const item = [...this.timeline_data, ...this.ports_data].find(i => i.id === this.selectedItemId);
        this.handleDrop(item.id, item.target, zoneTarget, zoneEl);
    },

    handleDrop(nodeId, targetId, zoneTarget, zone) {
        const isMatch = targetId === zoneTarget;
        if (!isMatch) {
            zone.classList.add('animate-shake', 'border-rose-500');
            setTimeout(() => zone.classList.remove('animate-shake', 'border-rose-500'), 500);
            return;
        }

        this.results.push({ id: nodeId, target: zoneTarget, isCorrect: true });
        this.itemsMatched++;
        this.selectedItemId = null;
        this.render();

        if (this.itemsMatched === 6) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.itemsMatched * 300,
            xp: 1500,
            accuracy: 100,
            detailedResults: this.results
        });
    }
};

