/**
 * Level 5: Binary Conversion
 * Mechanic: Toggle bits to match target decimal value.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;

        // Bit values for 12-bit integer
        this.bitValues = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];

        // Initial state for bits (all 0)
        this.currentBits = Array(12).fill(0);

        // Challenge Stages (Hard Mode)
        this.stages = [
            { id: 1, target: 1050 },
            { id: 2, target: 2049 },
            { id: 3, target: 512 },
            { id: 4, target: 4095 },
            { id: 5, target: 1701 },
            { id: 6, target: 3333 }
        ];

        this.render();
    },

    render() {
        const stage = this.stages[this.currentStage];
        const currentVal = this.calculateCurrentValue();

        this.container.innerHTML = `
            <h2>${this.game.getText('L5_TITLE')}</h2>
            <p>${this.game.getText('L5_DESC')}</p>

            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 2rem;">

                
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
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; justify-content: center;">
                    ${this.bitValues.map((val, idx) => `
                        <div style="display:flex; flex-direction:column; align-items:center; gap: 5px;">
                            <div style="font-size:0.7rem; color:var(--color-text-muted); font-weight:bold;">${val}</div>
                            <button class="btn-bit" data-idx="${idx}" style="
                                width:100%; height:80px; border-radius:12px; 
                                border: 2px solid ${this.currentBits[idx] ? 'white' : 'rgba(255,255,255,0.1)'};
                                background: ${this.currentBits[idx] ? 'var(--color-primary)' : 'rgba(0,0,0,0.3)'};
                                color: ${this.currentBits[idx] ? 'white' : 'rgba(255,255,255,0.4)'};
                                font-size: 1.5rem; font-family: monospace; cursor:pointer;
                                transition: all 0.2s ease;
                                box-shadow: ${this.currentBits[idx] ? '0 0 15px var(--color-primary-shadow)' : 'none'};
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
