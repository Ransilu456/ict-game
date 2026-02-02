/**
 * Level 3: Networking (OSI Model)
 * Phase 1: Sort OSI Layers
 * Phase 2: Match Protocols
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.correctOrder = [7, 6, 5, 4, 3, 2, 1]; // Top to Bottom
        this.score = 0;

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
            <h2>${this.game.getText('L3_TITLE')}</h2>
            <p>${this.game.getText('L3_DESC')}</p>
            
            <div style="display:flex; justify-content:center; margin-top:2rem;">
                <div id="osi-stack" style="width:300px; display:flex; flex-direction:column; gap:5px;">
                    ${this.currentOrder.map(layerNum => `
                        <div class="osi-layer" draggable="true" data-layer="${layerNum}" style="
                            background: rgba(0, 243, 255, 0.1);
                            border: 1px solid var(--color-primary);
                            padding: 1rem;
                            text-align: center;
                            cursor: grab;
                            font-family: var(--font-mono);
                            transition: all 0.2s;
                        ">
                            ${this.game.getText(`L3_LAYER_${layerNum}`)}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="text-align:center; margin-top:2rem;">
                <button id="btn-check-osi" class="btn">VERIFY CONNECTION</button>
            </div>
        `;
        this.attachEventsPhase1();
    },

    attachEventsPhase1() {
        const list = this.container.querySelector('#osi-stack');
        let draggedItem = null;

        list.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            e.target.style.opacity = '0.5';
        });

        list.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
            draggedItem = null;
        });

        list.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        list.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('osi-layer') && e.target !== draggedItem) {
                const rect = e.target.getBoundingClientRect();
                const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
                list.insertBefore(draggedItem, next ? e.target.nextSibling : e.target);
            }
        });

        this.container.querySelector('#btn-check-osi').addEventListener('click', () => {
            this.verifyStack();
        });
    },

    verifyStack() {
        const layers = Array.from(this.container.querySelectorAll('.osi-layer'));
        const userOrder = layers.map(el => parseInt(el.dataset.layer));
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(this.correctOrder);

        if (isCorrect) {
            layers.forEach(l => {
                l.style.background = 'rgba(10, 255, 10, 0.2)';
                l.style.borderColor = 'var(--color-success)';
            });

            this.score += 500;
            this.game.showFeedback('LAYER 1-7 ESTABLISHED', 'Architecture verified. Constructing Protocols...');

            setTimeout(() => {
                this.phase = 2;
                this.render();
            }, 1500);
        } else {
            this.game.showFeedback('CONNECTION ERROR', 'Layers are misaligned. Packets dropped.');
            this.score = Math.max(0, this.score - 50);
            this.game.updateHUD();
        }
    },

    /* PHASE 2: PROTOCOLS */
    renderPhase2() {
        // We know the stack is correct at Phase 2, so show it static with drop zones?
        // Or just show 3 buckets.
        // Let's show the stack on left, and protocols on right to drag onto it.
        const protocols = [
            { id: 'http', label: 'HTTP/HTTPS', layer: 7 },
            { id: 'ip', label: 'IP Address', layer: 3 },
            { id: 'mac', label: 'MAC Address', layer: 2 }
        ];

        this.container.innerHTML = `
            <h2>${this.game.getText('L3_PROTO_TITLE')}</h2>
            <p>${this.game.getText('L3_PROTO_DESC')}</p>

            <div style="display:flex; justify-content:center; gap: 4rem; margin-top:2rem;">
                
                <!-- Fixed Stack (Drop Target) -->
                <div id="osi-stack-static" style="width:300px; display:flex; flex-direction:column; gap:5px;">
                    ${this.correctOrder.map(layerNum => `
                        <div class="osi-drop-target" data-layer="${layerNum}" style="
                            background: rgba(0, 243, 255, 0.05);
                            border: 1px dashed var(--color-secondary);
                            padding: 0.8rem;
                            text-align: center;
                            font-family: var(--font-mono);
                            font-size: 0.9rem;
                        ">
                            ${this.game.getText(`L3_LAYER_${layerNum}`)}
                        </div>
                    `).join('')}
                </div>

                <!-- Protocol Tray -->
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <h3>PROTOCOLS</h3>
                    ${protocols.map(p => `
                        <div class="draggable-proto" draggable="true" data-id="${p.id}" data-layer="${p.layer}" style="
                            background: var(--color-primary);
                            color: #000;
                            padding: 1rem;
                            border-radius: 4px;
                            cursor: grab;
                            font-weight: bold;
                        ">
                            ${p.label}
                        </div>
                    `).join('')}
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
                e.dataTransfer.setData('id', e.target.dataset.id); // Hacky ID storage
                e.target.style.opacity = '0.5';
            });
            d.addEventListener('dragend', (e) => e.target.style.opacity = '1');
        });

        zones.forEach(z => {
            z.addEventListener('dragover', (e) => {
                e.preventDefault();
                z.style.borderColor = 'var(--color-primary)';
            });
            z.addEventListener('dragleave', () => {
                z.style.borderColor = 'var(--color-secondary)';
            });
            z.addEventListener('drop', (e) => {
                e.preventDefault();
                z.style.borderColor = 'var(--color-secondary)';

                const layer = parseInt(e.dataTransfer.getData('text/plain'));
                const targetLayer = parseInt(z.dataset.layer);
                // Also remove the element from tray if correct
                // But dragging logic needs references.
                // Assuming simple check:

                if (layer === targetLayer) {
                    if (z.classList.contains('matched')) return; // Already matched

                    z.classList.add('matched');
                    z.style.background = 'var(--color-success)';
                    z.style.color = '#000';
                    z.innerText += " ✅";

                    // Remove from list visually
                    // We need to find the specific element.
                    // This is simplified.
                    matchedCount++;

                    if (matchedCount >= totalToMatch) {
                        this.finishLevel();
                    }
                } else {
                    this.game.showFeedback('PROTOCOL MISMATCH', `Incorrect Layer. Try again.`);
                }
            });
        });
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.score + 1000,
            xp: 1500,
            accuracy: 100,
            timeBonus: 200
        });
    }
};
