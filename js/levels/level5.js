/**
 * Level 5: Networking (OSI Model)
 * Mechanic: Sort Layers -> Protocol Match -> Packet Tracer
 * Refactored for Silent Feedback, Result Summary & Feedback Component
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentPhase = 1;
        this.score = 0;
        this.results = [];

        this.osiLayers = [
            { num: 7, name: 'Application', desc: 'End User Services' },
            { num: 6, name: 'Presentation', desc: 'Encryption & Formatting' },
            { num: 5, name: 'Session', desc: 'Communication Mgmt' },
            { num: 4, name: 'Transport', desc: 'Reliability & Flow' },
            { num: 3, name: 'Network', desc: 'Routing & Addressing' },
            { num: 2, name: 'Data Link', desc: 'Physical Addressing' },
            { num: 1, name: 'Physical', desc: 'Binary Transmission' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        if (this.currentPhase === 1) this.renderPhase1();
        else if (this.currentPhase === 2) this.renderPhase2();
        else if (this.currentPhase === 3) this.renderPhase3();
    },

    /* PHASE 1: SORT LAYERS */
    renderPhase1() {
        if (!this.scrambledLayers) {
            this.scrambledLayers = [...this.osiLayers].sort(() => Math.random() - 0.5);
        }

        const header = new Card({
            title: "Phase 1: OSI Architecture",
            subtitle: "Reconstruct the 7-Layer OSI Model from Top (7) to Bottom (1).",
            variant: 'flat',
            customClass: 'text-center mb-6'
        });

        const statusFeedback = new Feedback({
            title: "Transmission Check",
            message: "Drag and drop the layers into the correct hierarchical order.",
            type: "neutral"
        });

        const stackContainer = document.createElement('div');
        stackContainer.className = "flex flex-col gap-2 max-w-md mx-auto";

        this.scrambledLayers.forEach(layer => {
            const el = document.createElement('div');
            el.className = "glass-panel p-4 rounded-lg flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-500 transition-all draggable-layer select-none bg-slate-900/60";
            el.draggable = true;
            el.dataset.num = layer.num;
            el.innerHTML = `
                <div class="flex items-center gap-4">
                    <iconify-icon icon="solar:hamburger-menu-linear" class="text-slate-500"></iconify-icon>
                    <span class="font-bold text-white">${layer.name} <span class="text-slate-500 text-xs font-normal">(${layer.desc})</span></span>
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
                    const next = el.nextSibling === this.draggedEl ? el : el.nextSibling;
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
                onClick: () => this.checkPhase1(stackContainer),
                customClass: "w-full"
            }).render(),
            customClass: "max-w-xl mx-auto"
        });

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render());
        this.container.appendChild(mainCard.render());
    },

    checkPhase1(container) {
        const domLayers = Array.from(container.querySelectorAll('.draggable-layer'));
        const currentOrder = domLayers.map(el => parseInt(el.dataset.num));
        const correctOrder = [7, 6, 5, 4, 3, 2, 1];
        const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);

        this.results.push({
            question: "OSI Layer Ordering",
            selected: isCorrect ? "Correct Sequence" : "Incorrect Sequence",
            correct: "7-Layer Descending",
            isCorrect: isCorrect,
            explanation: "Logical top-to-bottom order from Application to Physical."
        });

        this.currentPhase = 2;
        this.render();
    },

    /* PHASE 2: PROTOCOLS */
    renderPhase2() {
        this.protocols = [
            { id: 'http', label: 'HTTP / HTTPS', layer: 7, icon: 'solar:globe-bold' },
            { id: 'tcp', label: 'TCP / UDP', layer: 4, icon: 'solar:transfer-vertical-bold' },
            { id: 'ip', label: 'IP Address', layer: 3, icon: 'solar:routing-2-bold' }
        ];

        const header = new Card({
            title: "Phase 2: Protocol Mapping",
            subtitle: "Assign protocols. Drag to target layers.",
            variant: 'flat',
            customClass: 'text-center mb-6'
        });

        const statusFeedback = new Feedback({
            title: "Network Synchronization",
            message: "Identify and match the network protocols to their respective operational layers.",
            type: "neutral"
        });

        const layout = document.createElement('div');
        layout.className = "grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto";

        const targetsGrid = document.createElement('div');
        targetsGrid.className = "space-y-4";

        [7, 4, 3].forEach(lNum => {
            const layer = this.osiLayers.find(l => l.num === lNum);
            const dropZone = document.createElement('div');
            dropZone.className = "drop-target p-6 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center min-h-[140px] transition-all relative group";
            dropZone.dataset.layer = lNum;
            dropZone.innerHTML = `
                <div class="absolute top-4 left-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">Layer ${lNum}</div>
                <div class="text-sm font-bold text-slate-400 mb-4">${layer.name}</div>
                <div class="slot pointer-events-none flex flex-col items-center gap-2">
                    <iconify-icon icon="solar:download-square-bold" class="text-2xl text-slate-800 group-hover:text-indigo-500 transition-colors"></iconify-icon>
                    <span class="text-[10px] uppercase font-black text-slate-700">Awaiting Assignment</span>
                </div>
            `;

            dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('border-indigo-500', 'bg-indigo-500/5'); });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/5'));
            dropZone.addEventListener('drop', e => {
                e.preventDefault();
                dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/5');
                const id = e.dataTransfer.getData('protoId');
                const label = e.dataTransfer.getData('protoLabel');
                const icon = e.dataTransfer.getData('protoIcon');

                dropZone.dataset.droppedId = id;
                dropZone.innerHTML = `
                    <div class="absolute top-4 left-6 text-[9px] font-black text-indigo-500 opacity-40 uppercase tracking-widest">Layer ${lNum} Resolved</div>
                    <div class="flex flex-col items-center gap-2 animate-bounce-in">
                        <iconify-icon icon="${icon}" class="text-4xl text-indigo-400"></iconify-icon>
                        <span class="text-sm font-black text-white uppercase">${label}</span>
                    </div>
                `;

                const trayItem = document.querySelector(`.proto-item[data-id="${id}"]`);
                if (trayItem) trayItem.classList.add('opacity-20', 'pointer-events-none');

                this.updatePhase2Button();
            });
            targetsGrid.appendChild(dropZone);
        });

        const tray = document.createElement('div');
        tray.className = "flex flex-col gap-4";
        this.protocols.forEach(p => {
            const el = document.createElement('div');
            el.className = "proto-item p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-500 transition-all group";
            el.draggable = true;
            el.dataset.id = p.id;
            el.innerHTML = `
                <div class="flex items-center gap-3">
                    <iconify-icon icon="${p.icon}" class="text-2xl text-indigo-400"></iconify-icon>
                    <span class="text-xs font-bold text-white uppercase tracking-widest">${p.label}</span>
                </div>
                <iconify-icon icon="solar:menu-dots-bold" class="text-slate-700"></iconify-icon>
            `;
            el.onactive = () => el.classList.add('scale-95');
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('protoId', p.id);
                e.dataTransfer.setData('protoLabel', p.label);
                e.dataTransfer.setData('protoIcon', p.icon);
                el.classList.add('opacity-50');
            });
            el.addEventListener('dragend', () => el.classList.remove('opacity-50'));
            tray.appendChild(el);
        });

        const targetsCard = new Card({ title: "Working Model", content: targetsGrid, variant: 'glass' });
        const trayCard = new Card({ title: "Protocol Suite", content: tray, variant: 'glass' });

        layout.appendChild(targetsCard.render());
        layout.appendChild(trayCard.render());

        this.phase2Footer = document.createElement('div');
        this.phase2Footer.className = "flex justify-center mt-12";

        this.renderPhase2Button();

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render());
        this.container.appendChild(layout);
        this.container.appendChild(this.phase2Footer);
    },

    renderPhase2Button() {
        this.phase2Footer.innerHTML = '';
        const filled = this.container.querySelectorAll('.drop-target[data-dropped-id]').length;
        const isComplete = filled >= 3;

        const btn = new GameButton({
            text: isComplete ? "Confirm Network Topology" : "Assignment Incomplete",
            variant: isComplete ? 'primary' : 'secondary',
            icon: isComplete ? 'solar:check-circle-bold' : 'solar:lock-bold',
            onClick: isComplete ? () => this.finishPhase2() : null,
            customClass: `w-64 ${isComplete ? 'animate-pulse' : 'opacity-40 cursor-not-allowed'}`
        });
        this.phase2Footer.appendChild(btn.render());
    },

    updatePhase2Button() {
        this.renderPhase2Button();
    },

    finishPhase2() {
        const slots = Array.from(this.container.querySelectorAll('.drop-target'));
        slots.forEach(slot => {
            const layerNum = parseInt(slot.dataset.layer);
            const droppedId = slot.dataset.droppedId;
            const protocol = this.protocols.find(p => p.layer === layerNum);
            const isMatch = protocol.id === droppedId;

            this.results.push({
                question: `Layer ${layerNum} Protocol Match`,
                selected: droppedId || "None",
                correct: protocol.id,
                isCorrect: isMatch,
                explanation: `Layer ${layerNum} properly handles ${protocol.label}.`
            });
        });

        this.currentPhase = 3;
        this.render();
    },

    /* PHASE 3: TRACER */
    renderPhase3() {
        const header = new Card({
            title: "Phase 3: Packet Tracer",
            subtitle: "Define the packet flow through the OSI stacks.",
            variant: 'flat',
            customClass: 'text-center mb-6'
        });

        const statusFeedback = new Feedback({
            title: "Hardware Tracing",
            message: "Click layers to define the routing path from Sender (7 Down to 1) to Receiver (1 Up to 7).",
            type: "neutral"
        });

        const stacksLayout = document.createElement('div');
        stacksLayout.className = "grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto";

        this.pathSelection = [];
        const senderStack = this.createSelectableStack('Sender Source', [7, 6, 5, 4, 3, 2, 1]);
        const receiverStack = this.createSelectableStack('Receiver Destination', [1, 2, 3, 4, 5, 6, 7]);

        stacksLayout.appendChild(senderStack);
        stacksLayout.appendChild(receiverStack);

        const workspace = new Card({
            title: "Tactical Routing Interface",
            content: stacksLayout,
            variant: 'glass',
            footer: new GameButton({
                text: "Execute Network Trace",
                variant: 'primary',
                icon: 'solar:playback-speed-bold',
                onClick: () => this.finishPhase3(),
                customClass: "w-full"
            }).render()
        });

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render());
        this.container.appendChild(workspace.render());
    },

    createSelectableStack(title, order) {
        const container = document.createElement('div');
        container.className = "flex flex-col gap-2";
        container.innerHTML = `<h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">${title}</h4>`;

        order.forEach(num => {
            const layer = this.osiLayers.find(l => l.num === num);
            const btn = document.createElement('button');
            btn.className = "w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:border-indigo-500 hover:text-white transition-all text-left uppercase tracking-tighter flex items-center justify-between group";
            btn.innerHTML = `
                <span>Layer ${num}: ${layer.name}</span>
                <iconify-icon icon="solar:check-circle-linear" class="opacity-0 group-hover:opacity-40"></iconify-icon>
            `;
            btn.onclick = () => {
                const id = `${title.split(' ')[0]}-${num}`;
                if (btn.classList.contains('border-indigo-500')) {
                    btn.classList.remove('border-indigo-500', 'bg-indigo-500/10', 'text-indigo-400');
                    btn.querySelector('iconify-icon').setAttribute('icon', 'solar:check-circle-linear');
                    this.pathSelection = this.pathSelection.filter(x => x !== id);
                } else {
                    btn.classList.add('border-indigo-500', 'bg-indigo-500/10', 'text-indigo-400');
                    btn.querySelector('iconify-icon').setAttribute('icon', 'solar:check-circle-bold');
                    btn.querySelector('iconify-icon').classList.replace('opacity-40', 'opacity-100');
                    this.pathSelection.push(id);
                }
            };
            container.appendChild(btn);
        });
        return container;
    },

    finishPhase3() {
        const correctPath = [
            'Sender-7', 'Sender-6', 'Sender-5', 'Sender-4', 'Sender-3', 'Sender-2', 'Sender-1',
            'Receiver-1', 'Receiver-2', 'Receiver-3', 'Receiver-4', 'Receiver-5', 'Receiver-6', 'Receiver-7'
        ];

        const isCorrect = JSON.stringify(this.pathSelection) === JSON.stringify(correctPath);

        this.results.push({
            question: "Packet Routing Path",
            selected: isCorrect ? "Encapsulation & Decapsulation Route" : "Broken/Incomplete Route",
            correct: "Sender 7-1, Receiver 1-7",
            isCorrect: isCorrect,
            explanation: "Packets must descend the source stack and ascend the destination stack."
        });

        this.finishLevel();
    },

    finishLevel() {
        const correctCount = this.results.filter(r => r.isCorrect).length;
        this.game.completeLevel({
            success: true,
            score: correctCount * 500,
            xp: 1500,
            accuracy: Math.round((correctCount / this.results.length) * 100),
            detailedResults: this.results
        });
    }
};
