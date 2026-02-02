/**
 * Level 3: Networking (OSI Model)
 * Phase 1: Sort OSI Layers
 * Phase 2: Match Protocols
 * Refactored for Dashboard UI + Tailwind
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.correctOrder = [7, 6, 5, 4, 3, 2, 1]; // Top to Bottom
        this.score = 0;
        this.startTime = Date.now();

        // Phase 1 Setup
        this.currentOrder = [...this.correctOrder].sort(() => Math.random() - 0.5);
        this.phase = 1;

        this.render();
    },

    render() {
        if (this.phase === 1) {
            this.renderPhase1();
        } else {
            this.renderPhase2();
        }
    },

    /* PHASE 1: OSI SORT */
    renderPhase1() {
        this.container.innerHTML = `
            <div class="flex flex-col items-center justify-center animate-fade-in gap-6">

                
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-white mb-2">${this.game.getText('L3_TITLE')}</h2>
                    <p class="text-slate-400 max-w-lg mx-auto">${this.game.getText('L3_DESC')}</p>
                </div>

                <div class="flex gap-8 items-start">
                    <!-- Layer Stack -->
                    <div id="osi-stack" class="flex flex-col gap-2 p-6 glass-panel rounded-xl border border-indigo-500/30 w-80 min-h-[500px] shadow-2xl">
                        <div class="text-xs text-slate-500 font-bold uppercase text-center mb-2 tracking-widest">Application Layer (Top)</div>
                        
                        ${this.currentOrder.map(layerNum => `
                            <div class="osi-layer p-4 bg-slate-800/80 border border-slate-600 rounded-lg text-center cursor-move hover:border-indigo-500 hover:bg-slate-700 transition-all font-mono font-bold text-slate-200 shadow-sm" 
                                draggable="true" data-layer="${layerNum}">
                                <div class="flex items-center justify-between">
                                    <iconify-icon icon="solar:hamburger-menu-linear" class="text-slate-500"></iconify-icon>
                                    <span>${this.game.getText(`L3_LAYER_${layerNum}`)}</span>
                                    <span class="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">L${layerNum}</span>
                                </div>
                            </div>
                        `).join('')}
                        
                        <div class="text-xs text-slate-500 font-bold uppercase text-center mt-auto tracking-widest">Physical Layer (Bottom)</div>
                    </div>

                    <!-- Instructions / Status -->
                    <div class="w-64 flex flex-col gap-4 pt-12">
                        <div class="glass-panel p-4 rounded-lg border border-slate-700">
                             <h4 class="text-white font-bold mb-2">Objective</h4>
                             <p class="text-sm text-slate-400">Drag and drop layers to arrange the OSI Model in the correct descending order (7 to 1).</p>
                        </div>
                        
                        <button id="btn-check-osi" class="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-indigo-900/20 transition-all hover:scale-105 flex items-center justify-center gap-2">
                             <iconify-icon icon="solar:check-circle-bold"></iconify-icon>
                             VERIFY STACK
                        </button>
                    </div>
                </div>

            </div>
        `;
        this.attachEventsPhase1();
    },

    attachEventsPhase1() {
        const list = this.container.querySelector('#osi-stack');
        let draggedItem = null;

        list.addEventListener('dragstart', (e) => {
            draggedItem = e.target.closest('.osi-layer');
            e.dataTransfer.effectAllowed = 'move';
            // setTimeout(() => draggedItem.classList.add('opacity-50'), 0);
            draggedItem.style.opacity = '0.5';
        });

        list.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
            draggedItem = null;
        });

        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(list, e.clientY);
            if (afterElement == null) {
                // Insert before the bottom label div (last-child logic check)
                // Actually our structure has divs then a label div.
                // We typically append if no afterElement, but exclude the "text-xs" div at bottom?
                // Let's keep it simple: insertBefore logic.
                // If null, we might be at bottom.
                // list.appendChild(draggedItem); // Be careful of the bottom label
                // Let's target only .osi-layer container or keep labels outside?
                // I put labels INSIDE #osi-stack. Better to put them inside but use logic to ignore them.
                // Or easier: insertBefore the "Physical Layer" label which is last child.
                const bottomLabel = list.lastElementChild;
                list.insertBefore(draggedItem, bottomLabel);
            } else {
                list.insertBefore(draggedItem, afterElement);
            }
        });

        this.container.querySelector('#btn-check-osi').addEventListener('click', () => {
            this.verifyStack();
        });
    },

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.osi-layer:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    verifyStack() {
        const layers = Array.from(this.container.querySelectorAll('.osi-layer'));
        const userOrder = layers.map(el => parseInt(el.dataset.layer));
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(this.correctOrder);

        if (isCorrect) {
            layers.forEach(l => {
                l.classList.remove('bg-slate-800/80', 'border-slate-600');
                l.classList.add('bg-emerald-500/20', 'border-emerald-500', 'text-emerald-300');
                l.querySelector('iconify-icon').className = "text-emerald-500";
            });

            this.score += 500;
            this.game.showFeedback(this.game.getText('RES_SUCCESS'), 'OSI Stack Verified. Initializing Protocol Handshake...');

            setTimeout(() => {
                this.phase = 2;
                this.render();
            }, 1500);
        } else {
            this.game.showFeedback(this.game.getText('RES_FAIL'), 'Layer Mismatch detected. Connection unstable.');
            this.score = Math.max(0, this.score - 250);
            this.game.updateHUD(); // Sync score penalty
        }
    },

    /* PHASE 2: PROTOCOLS */
    renderPhase2() {
        const protocols = [
            { id: 'http', label: 'HTTP/HTTPS', layer: 7, icon: 'solar:globe-bold' },
            { id: 'ip', label: 'IP Address', layer: 3, icon: 'solar:routing-2-bold' },
            { id: 'mac', label: 'MAC Address', layer: 2, icon: 'solar:network-bold' }
        ];

        this.container.innerHTML = `
             <div class="flex flex-col items-center justify-center animate-fade-in gap-8">

                
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-white mb-2">${this.game.getText('L3_PROTO_TITLE')}</h2>
                    <p class="text-slate-400 max-w-lg mx-auto">${this.game.getText('L3_PROTO_DESC')}</p>
                </div>

                <div class="flex flex-col md:flex-row gap-12 w-full max-w-4xl justify-center">
                    
                    <!-- Stack Targets -->
                    <div class="flex flex-col w-64 gap-2">
                         <div class="text-xs text-slate-500 font-bold uppercase mb-2">Target Layers</div>
                         ${this.correctOrder.map(layerNum => `
                            <div class="osi-drop-target p-3 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-between transition-all bg-slate-900/50" data-layer="${layerNum}">
                                <span class="text-sm font-mono text-slate-500">Layer ${layerNum}</span>
                                <span class="text-xs text-slate-600 hidden md:block">${this.game.getText(`L3_LAYER_${layerNum}`)}</span>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Protocol Tray -->
                    <div class="flex flex-col w-64 gap-4">
                        <div class="text-xs text-slate-500 font-bold uppercase mb-2">Available Protocols</div>
                        <div class="glass-panel p-4 rounded-xl border border-slate-700 flex flex-col gap-3 min-h-[300px]" id="proto-tray">
                            ${protocols.map(p => `
                                <div class="draggable-proto p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg cursor-grab active:cursor-grabbing flex items-center gap-3 font-bold border-b-4 border-indigo-800" draggable="true" data-id="${p.id}" data-layer="${p.layer}">
                                    <iconify-icon icon="${p.icon}" class="text-xl opacity-80"></iconify-icon>
                                    ${p.label}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                </div>

            </div>
        `;

        this.attachEventsPhase2();
    },

    attachEventsPhase2() {
        const draggables = this.container.querySelectorAll('.draggable-proto');
        const zones = this.container.querySelectorAll('.osi-drop-target');
        let matchedCount = 0;
        const totalToMatch = 3;

        draggables.forEach(d => {
            d.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.layer);
                e.dataTransfer.setData('id', e.target.dataset.id);
                setTimeout(() => d.classList.add('opacity-50'), 0);
            });
            d.addEventListener('dragend', (e) => e.target.classList.remove('opacity-50'));
        });

        zones.forEach(z => {
            z.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!z.classList.contains('matched')) {
                    z.classList.add('border-indigo-500', 'bg-indigo-500/10');
                }
            });

            z.addEventListener('dragleave', () => {
                z.classList.remove('border-indigo-500', 'bg-indigo-500/10');
            });

            z.addEventListener('drop', (e) => {
                e.preventDefault();
                z.classList.remove('border-indigo-500', 'bg-indigo-500/10');

                if (z.classList.contains('matched')) return;

                const layer = parseInt(e.dataTransfer.getData('text/plain'));
                const draggedId = e.dataTransfer.getData('id');
                const targetLayer = parseInt(z.dataset.layer);

                if (layer === targetLayer) {
                    // Success
                    z.classList.add('matched', 'border-emerald-500', 'bg-emerald-500/20');
                    z.classList.remove('border-dashed', 'border-slate-700', 'text-slate-500', 'bg-slate-900/50');

                    // Find actual dragged element and remove or move it
                    // Simple approach: Set content of Drop Zone
                    const protoLabel = document.querySelector(`.draggable-proto[data-id="${draggedId}"]`).innerText; // Get text
                    z.innerHTML = `
                        <div class="flex items-center gap-2 text-emerald-300 font-bold w-full justify-center">
                            <iconify-icon icon="solar:check-circle-bold"></iconify-icon>
                            <span>${protoLabel}</span>
                        </div>
                    `;

                    // Remove from tray
                    const originalDraggable = document.querySelector(`.draggable-proto[data-id="${draggedId}"]`);
                    if (originalDraggable) originalDraggable.remove();

                    matchedCount++;
                    this.game.showFeedback(this.game.getText('RES_SUCCESS'), `Protocol Assigned to Layer ${layer}.`);

                    if (matchedCount >= totalToMatch) {
                        this.finishLevel();
                    }
                } else {
                    this.game.showFeedback(this.game.getText('RES_FAIL'), 'Protocol Incompatible with this Layer.');
                    this.game.gameState.score = Math.max(0, this.game.gameState.score - 250);
                    this.game.updateHUD(); // Sync penalty
                }
            });
        });
    },

    finishLevel() {
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, (120 - elapsedSec) * 5); // 2 mins generous

        setTimeout(() => {
            this.game.completeLevel({
                success: true,
                score: this.score + 1000 + timeBonus,
                xp: 1500,
                accuracy: 100,
                timeBonus: timeBonus
            });
        }, 1000);
    }
};
