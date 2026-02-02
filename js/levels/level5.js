/**
 * Level 5: Binary Conversion
 * Mechanic: Toggle bits to match target decimal value.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;

        // Bit values for 8-bit integer
        this.bitValues = [128, 64, 32, 16, 8, 4, 2, 1];

        // Initial state for bits (all 0)
        this.currentBits = [0, 0, 0, 0, 0, 0, 0, 0];

        // Challenge Stages
        this.stages = [
            { id: 1, target: 10 },    // 00001010
            { id: 2, target: 45 },    // 00101101
            { id: 3, target: 150 },   // 10010110
            { id: 4, target: 213 },   // 11010101
            { id: 5, target: 170 },   // 10101010
            { id: 6, target: 255 }    // 11111111
        ];

        this.render();
    },

    render() {
        const stage = this.stages[this.currentStage];
        const currentVal = this.calculateCurrentValue();

        this.container.innerHTML = `
            <h2>${this.game.getText('L5_TITLE')}</h2>
            <p>${this.game.getText('L5_DESC')}</p>

            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap: 2rem;">
                
                <!-- Target Display -->
                <div style="
                    background: rgba(0,0,0,0.5); padding: 1rem 2rem; border-radius: 12px; border: 2px solid var(--color-primary);
                    text-align: center; width: 80%;
                ">
                    <div style="font-size: 1rem; color: var(--color-text-muted);">${this.game.getText('L5_TARGET_LBL')}</div>
                    <div style="font-size: 3rem; color: var(--color-primary); font-family: monospace; font-weight: bold;">
                        ${stage.target}
                    </div>
                </div>

                <!-- Bits Interface -->
                <div style="display:flex; gap:10px; justify-content: center; flex-wrap: wrap;">
                    ${this.bitValues.map((val, idx) => `
                        <div style="display:flex; flex-direction:column; align-items:center; gap: 5px;">
                            <div style="font-size:0.8rem; color:var(--color-text-muted);">${val}</div>
                            <button class="btn-bit" data-idx="${idx}" style="
                                width:50px; height:60px; border-radius:8px; 
                                border: 2px solid ${this.currentBits[idx] ? 'var(--color-success)' : 'var(--color-text-muted)'};
                                background: ${this.currentBits[idx] ? 'rgba(0,255,100,0.2)' : 'rgba(0,0,0,0.3)'};
                                color: ${this.currentBits[idx] ? 'var(--color-success)' : 'var(--color-text-muted)'};
                                font-size: 1.5rem; font-family: monospace; cursor:pointer;
                                transition: all 0.2s ease;
                            ">
                                ${this.currentBits[idx]}
                            </button>
                        </div>
                    `).join('')}
                </div>

                <!-- Current Value Display -->
                <div style="text-align: center;">
                    <div style="font-size: 1rem; color: var(--color-text-muted);">${this.game.getText('L5_CURRENT_LBL')}</div>
                    <div id="current-val-display" style="
                        font-size: 2.5rem; 
                        color: ${currentVal === stage.target ? 'var(--color-success)' : 'var(--color-text)'};
                        font-weight: bold;
                    ">
                        ${currentVal}
                    </div>
                </div>

                <!-- Action -->
                <div>
                     <button id="btn-check-binary" class="btn" style="width: 200px;">
                        ${this.game.getText('L5_BTN_CHECK')}
                     </button>
                </div>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        this.container.querySelectorAll('.btn-bit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Find button element (in case clicked on inner text)
                const target = e.target.closest('.btn-bit');
                const idx = parseInt(target.dataset.idx);

                // Toggle Bit
                this.currentBits[idx] = this.currentBits[idx] === 0 ? 1 : 0;

                // Re-render to update UI state
                this.render();
            });
        });

        this.container.querySelector('#btn-check-binary').addEventListener('click', () => {
            this.checkStage();
        });
    },

    calculateCurrentValue() {
        return this.currentBits.reduce((acc, bit, idx) => {
            return acc + (bit * this.bitValues[idx]);
        }, 0);
    },

    checkStage() {
        const stage = this.stages[this.currentStage];
        const currentVal = this.calculateCurrentValue();

        if (currentVal === stage.target) {
            this.game.showFeedback('SYSTEM SYNCED', 'Binary sequence matches target value.');

            setTimeout(() => {
                this.currentStage++;
                // Reset bits for next stage
                this.currentBits = [0, 0, 0, 0, 0, 0, 0, 0];

                if (this.currentStage < this.stages.length) {
                    this.render();
                } else {
                    this.finishLevel();
                }
            }, 1000);
        } else {
            this.game.showFeedback('SEQUENCE ERROR',
                `Target: ${stage.target} | Current: ${currentVal}<br>Check your bit calculations.`
            );
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 2000,
            xp: 1500,
            accuracy: 100, // Simplification
            timeBonus: 50
        });
    }
};
