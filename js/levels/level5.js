import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentPhase = 1;
        this.score = 0;
        this.results = [];

        this.osiLayers = [
            { num: 7, name: 'Application', desc: 'User Services' },
            { num: 6, name: 'Presentation', desc: 'Formatting' },
            { num: 5, name: 'Session', desc: 'Communication' },
            { num: 4, name: 'Transport', desc: 'Reliability' },
            { num: 3, name: 'Network', desc: 'Routing' },
            { num: 2, name: 'Data Link', desc: 'Physical Addressing' },
            { num: 1, name: 'Physical', desc: 'Binary' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full items-center";

        if (this.currentPhase === 1) this.renderPhase1(content);
        else if (this.currentPhase === 2) this.renderPhase2(content);
        else if (this.currentPhase === 3) this.renderPhase3(content);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());
    },

    renderPhase1(content) {
        if (!this.scrambledLayers) {
            this.scrambledLayers = [...this.osiLayers].sort(() => Math.random() - 0.5);
        }

        const header = new Card({
            title: "OSI Architecture",
            subtitle: "Reconstruct the Model from Top (7) to Bottom (1).",
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const statusFeedback = new Feedback({
            title: "Transmission Check",
            message: "Reorder layers into the correct hierarchical sequence.",
            type: "neutral"
        });
        content.appendChild(statusFeedback.render());

        const stackContainer = document.createElement('div');
        stackContainer.className = "flex flex-col gap-2 w-full max-w-md mx-auto";

        this.scrambledLayers.forEach(layer => {
            const el = document.createElement('div');
            el.className = "glass-panel p-4 rounded-xl flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-500 transition-all draggable-layer select-none bg-slate-900/60 touch-none";
            el.draggable = true;
            el.dataset.num = layer.num;
            el.innerHTML = `
                <div class="flex items-center gap-3">
                    <iconify-icon icon="solar:hamburger-menu-linear" class="text-slate-500"></iconify-icon>
                    <span class="font-bold text-white text-sm sm:text-base">${layer.name} <span class="text-slate-500 text-[10px] font-normal tracking-wide">(${layer.num})</span></span>
                </div>
            `;

            el.addEventListener('dragstart', e => { this.draggedEl = el; el.classList.add('opacity-50'); });
            el.addEventListener('dragend', () => el.classList.remove('opacity-50'));
            el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('border-indigo-500'); });
            el.addEventListener('dragleave', () => el.classList.remove('border-indigo-500'));
            el.addEventListener('drop', e => {
                e.preventDefault();
                el.classList.remove('border-indigo-500');
                if (this.draggedEl && this.draggedEl !== el) {
                    const parent = el.parentNode;
                    const next = (el.nextSibling === this.draggedEl) ? el : el.nextSibling;
                    parent.insertBefore(this.draggedEl, next);
                }
            });
            stackContainer.appendChild(el);
        });

        const mainCard = new Card({
            content: stackContainer,
            variant: 'glass',
            footer: new GameButton({
                text: "Initialize Stack",
                icon: "solar:check-read-bold",
                customClass: "w-full",
                onClick: () => this.checkPhase1(stackContainer)
            }).render(),
            customClass: "w-full"
        });
        content.appendChild(mainCard.render());
    },

    checkPhase1(container) {
        const domLayers = Array.from(container.querySelectorAll('.draggable-layer'));
        const currentOrder = domLayers.map(el => parseInt(el.dataset.num));
        const correctOrder = [7, 6, 5, 4, 3, 2, 1];
        const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);

        this.results.push({
            question: "OSI Layer Ordering",
            selected: isCorrect ? "Correct Sequence" : "Fixed Sequence",
            correct: "7-Layer Descending",
            isCorrect: isCorrect,
            explanation: "Model follows 7 (App) down to 1 (Phys)."
        });

        this.currentPhase = 2;
        this.render();
    },

    renderPhase2(content) {
        this.protocols = [
            { id: 'http', label: 'HTTP / HTTPS', layer: 7, icon: 'solar:globe-bold' },
            { id: 'tcp', label: 'TCP / UDP', layer: 4, icon: 'solar:transfer-vertical-bold' },
            { id: 'ip', label: 'IP Address', layer: 3, icon: 'solar:routing-2-bold' }
        ];

        const header = new Card({
            title: "Protocol Mapping",
            subtitle: "Assign protocols to operational layers.",
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const layout = document.createElement('div');
        layout.className = "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full";

        // Targets
        const targetsGrid = document.createElement('div');
        targetsGrid.className = "space-y-3";

        [7, 4, 3].forEach(lNum => {
            const layer = this.osiLayers.find(l => l.num === lNum);
            const dropZone = document.createElement('div');
            dropZone.className = "drop-target p-4 sm:p-6 bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] transition-all relative group touch-none";
            dropZone.dataset.layer = lNum;
            dropZone.innerHTML = `
                <div class="absolute top-2 left-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">L${lNum}</div>
                <div class="text-xs font-bold text-slate-400 mb-2">${layer.name}</div>
                <div class="slot pointer-events-none flex flex-col items-center gap-1">
                    <iconify-icon icon="solar:download-square-bold" class="text-xl text-slate-800 group-hover:text-indigo-500 transition-colors"></iconify-icon>
                    <span class="text-[8px] uppercase font-black text-slate-700">Awaiting Assignment</span>
                </div>
            `;

            dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('border-indigo-500', 'bg-indigo-500/5'); });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/5'));
            dropZone.addEventListener('drop', e => {
                e.preventDefault();
                this.handlePhase2Drop(dropZone, e.dataTransfer.getData('protoId'));
            });
            dropZone.addEventListener('click', () => {
                const active = document.querySelector('.proto-item.active-choice');
                if (active) this.handlePhase2Drop(dropZone, active.dataset.id);
            });
            targetsGrid.appendChild(dropZone);
        });

        // Tray
        const tray = document.createElement('div');
        tray.className = "flex flex-col gap-3";
        this.protocols.forEach(p => {
            const el = document.createElement('div');
            el.className = "proto-item p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-500 transition-all group touch-none";
            el.draggable = true;
            el.dataset.id = p.id;
            el.innerHTML = `
                <div class="flex items-center gap-3">
                    <iconify-icon icon="${p.icon}" class="text-2xl text-indigo-400"></iconify-icon>
                    <span class="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest">${p.label}</span>
                </div>
                <iconify-icon icon="solar:menu-dots-bold" class="text-slate-700"></iconify-icon>
            `;
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('protoId', p.id);
                el.classList.add('opacity-50');
            });
            el.addEventListener('dragend', () => el.classList.remove('opacity-50'));
            el.addEventListener('click', () => {
                this.container.querySelectorAll('.proto-item').forEach(i => i.classList.remove('active-choice', 'ring-2', 'ring-indigo-500'));
                el.classList.add('active-choice', 'ring-2', 'ring-indigo-500');
            });
            tray.appendChild(el);
        });

        layout.appendChild(new Card({ title: "Working Model", content: targetsGrid, variant: 'glass' }).render());
        layout.appendChild(new Card({ title: "Protocol Suite", content: tray, variant: 'glass' }).render());
        content.appendChild(layout);

        const filledCount = this.container.querySelectorAll('.drop-target[data-dropped-id]').length;
        const confirmBtn = new GameButton({
            text: filledCount >= 3 ? "Confirm Topology" : "Assign All Protocols",
            variant: filledCount >= 3 ? 'primary' : 'disabled',
            customClass: 'w-full max-w-sm',
            onClick: filledCount >= 3 ? () => this.finishPhase2() : null
        });
        content.appendChild(confirmBtn.render());
    },

    handlePhase2Drop(zone, protoId) {
        if (!protoId) return;
        const p = this.protocols.find(x => x.id === protoId);
        zone.dataset.droppedId = protoId;
        zone.classList.remove('border-dashed', 'bg-slate-950/50');
        zone.classList.add('border-indigo-500/50', 'bg-indigo-500/10');
        zone.innerHTML = `
            <div class="absolute top-2 left-4 text-[8px] font-black text-indigo-500 opacity-40 uppercase tracking-widest">L${zone.dataset.layer} Resolved</div>
            <div class="flex flex-col items-center gap-1 animate-bounce-in">
                <iconify-icon icon="${p.icon}" class="text-3xl text-indigo-400"></iconify-icon>
                <span class="text-[10px] font-black text-white uppercase">${p.label}</span>
            </div>
        `;
        const trayItem = this.container.querySelector(`.proto-item[data-id="${protoId}"]`);
        if (trayItem) trayItem.classList.add('hidden');
        this.render(); // Re-render to update Confirm button state
    },

    finishPhase2() {
        const slots = Array.from(this.container.querySelectorAll('.drop-target'));
        slots.forEach(slot => {
            const lNum = parseInt(slot.dataset.layer);
            const droppedId = slot.dataset.droppedId;
            const p = this.protocols.find(x => x.layer === lNum);
            this.results.push({
                question: `L${lNum} Protocol`,
                selected: droppedId,
                correct: p.id,
                isCorrect: p.id === droppedId
            });
        });
        this.currentPhase = 3;
        this.render();
    },

    renderPhase3(content) {
        const header = new Card({
            title: "Packet Tracer",
            subtitle: "Sender (7 to 1) -> Receiver (1 to 7).",
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const stacksLayout = document.createElement('div');
        stacksLayout.className = "flex flex-col sm:flex-row gap-6 w-full";

        this.pathSelection = [];
        stacksLayout.appendChild(this.createSelectableStack('Sender', [7, 6, 5, 4, 3, 2, 1]));
        stacksLayout.appendChild(this.createSelectableStack('Receiver', [1, 2, 3, 4, 5, 6, 7]));

        const main = new Card({
            title: "Routing Interface",
            content: stacksLayout,
            variant: 'glass',
            customClass: 'w-full',
            footer: new GameButton({
                text: "Execute Trace",
                variant: 'primary',
                customClass: 'w-full',
                onClick: () => this.finishPhase3()
            }).render()
        });
        content.appendChild(main.render());
    },

    createSelectableStack(side, order) {
        const wrap = document.createElement('div');
        wrap.className = "flex-1 flex flex-col gap-2";
        wrap.innerHTML = `<h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-1">${side}</h4>`;
        order.forEach(n => {
            const b = document.createElement('button');
            b.className = "w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-500 hover:border-indigo-500 transition-all text-left uppercase";
            b.innerText = `L${n}: ${this.osiLayers.find(l => l.num === n).name}`;
            b.onclick = () => {
                const id = `${side}-${n}`;
                if (b.classList.contains('bg-indigo-500/10')) {
                    b.classList.remove('bg-indigo-500/10', 'border-indigo-500', 'text-indigo-400');
                    this.pathSelection = this.pathSelection.filter(x => x !== id);
                } else {
                    b.classList.add('bg-indigo-500/10', 'border-indigo-500', 'text-indigo-400');
                    this.pathSelection.push(id);
                }
            };
            wrap.appendChild(b);
        });
        return wrap;
    },

    finishPhase3() {
        const correct = [
            'Sender-7', 'Sender-6', 'Sender-5', 'Sender-4', 'Sender-3', 'Sender-2', 'Sender-1',
            'Receiver-1', 'Receiver-2', 'Receiver-3', 'Receiver-4', 'Receiver-5', 'Receiver-6', 'Receiver-7'
        ];
        const isCorrect = JSON.stringify(this.pathSelection) === JSON.stringify(correct);
        this.results.push({
            question: "Routing Path",
            selected: isCorrect ? "Valid Route" : "Broken Route",
            correct: "Sender 7-1, Receiver 1-7",
            isCorrect: isCorrect
        });
        this.finishLevel();
    },

    finishLevel() {
        const correctCount = this.results.filter(r => r.isCorrect).length;
        this.game.completeLevel({
            success: correctCount >= 3,
            score: correctCount * 500,
            xp: 1500,
            accuracy: Math.round((correctCount / this.results.length) * 100),
            detailedResults: this.results
        });
    }
};

