/**
 * Level 3: Networking (OSI Model)
 * Mechanic: Sortable List / Drag and Drop Stacking
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.correctOrder = [7, 6, 5, 4, 3, 2, 1]; // Top to Bottom

        // Randomize initial order
        this.currentOrder = [...this.correctOrder].sort(() => Math.random() - 0.5);

        this.render();
        this.attachEvents();
    },

    render() {
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
    },

    attachEvents() {
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
            // Simple reordering logic
            // Find closest element
            if (e.target.classList.contains('osi-layer') && e.target !== draggedItem) {
                // Determine insert before or after
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

        // Correct order is 7 down to 1 (Application top, Physical bottom)
        // Check exact match
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(this.correctOrder);

        if (isCorrect) {
            layers.forEach(l => {
                l.style.background = 'rgba(10, 255, 10, 0.2)';
                l.style.borderColor = 'var(--color-success)';
            });

            setTimeout(() => {
                this.game.completeLevel({
                    success: true,
                    score: 1000,
                    xp: 1000,
                    accuracy: 100,
                    timeBonus: 200
                });
            }, 1000);
        } else {
            this.game.showFeedback('CONNECTION ERROR', 'Layers are misaligned. Packets dropped.');
            this.game.gameState.score = Math.max(0, this.game.gameState.score - 50);
            this.game.updateHUD();
        }
    }
};
