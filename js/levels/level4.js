/**
 * Level 4: Logic Gates
 * Mechanic: Interactive Circuit (Toggle Inputs to get Output = 1)
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;

        // Define Circuits
        // Each stage has inputs [0, 0] and a target gate logic
        this.stages = [
            {
                id: 1,
                type: 'AND',
                inputs: [0, 0], // Initial state
                target: 1,      // Target output
                gate_key: 'L4_GATE_AND'
            },
            {
                id: 2,
                type: 'OR',
                inputs: [0, 0],
                target: 1,
                gate_key: 'L4_GATE_OR'
            },
            {
                id: 3,
                type: 'NAND', // AND then NOT
                inputs: [1, 1],
                target: 0,
                gate_key: 'NAND GATE (AND + NOT)' // Helper text if key missing
            }
        ];

        this.render();
    },

    render() {
        const stage = this.stages[this.currentStage];
        const gateLabel = stage.gate_key.startsWith('L4') ? this.game.getText(stage.gate_key) : stage.gate_key;

        this.container.innerHTML = `
            <h2>${this.game.getText('L4_TITLE')}</h2>
            <p>${this.game.getText('L4_DESC')}</p>
            
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:60%;">
                
                <h3 style="color:var(--color-secondary);">${gateLabel}</h3>
                
                <div class="circuit-board" style="
                    display:flex; gap:2rem; align-items:center; 
                    background:rgba(255,255,255,0.05); padding:2rem; border-radius:16px; border:2px solid var(--color-primary);
                ">
                    <!-- Inputs -->
                    <div style="display:flex; flex-direction:column; gap:2rem;">
                        ${stage.inputs.map((val, idx) => `
                            <button class="btn-toggle" data-idx="${idx}" style="
                                width:60px; height:60px; border-radius:50%; border:2px solid var(--color-text);
                                background: ${val ? 'var(--color-success)' : 'transparent'};
                                color: ${val ? '#000' : 'var(--color-text)'};
                                font-size:1.5rem; cursor:pointer; font-weight:bold;
                            ">
                                ${val}
                            </button>
                        `).join('')}
                    </div>

                    <!-- Gate Visual (Simple Box for now) -->
                    <div style="
                        width:100px; height:100px; background:var(--color-bg-secondary);
                        border:2px solid var(--color-secondary); display:flex; align-items:center; justify-content:center;
                        font-size:2rem; border-radius:8px;
                    ">
                        ${this.getGateIcon(stage.type)}
                    </div>

                    <!-- Output (Calculated Live) -->
                    <div id="circuit-output" style="
                        width:80px; height:80px; border-radius:50%; 
                        border:4px solid var(--color-text-muted);
                        display:flex; align-items:center; justify-content:center; font-size:1.5rem;
                        background: #333;
                    ">
                        ?
                    </div>
                </div>

                <div style="margin-top:2rem;">
                     <button id="btn-check-circuit" class="btn">${this.game.getText('L4_BTN_CHECK')}</button>
                </div>
            </div>
        `;

        this.updateOutputView();
        this.attachEvents();
    },

    getGateIcon(type) {
        if (type === 'AND') return '&';
        if (type === 'OR') return '>=1';
        if (type === 'NOT') return '1';
        if (type === 'NAND') return '!&';
        return '?';
    },

    calculateOutput(type, inputs) {
        const [a, b] = inputs;
        switch (type) {
            case 'AND': return (a && b) ? 1 : 0;
            case 'OR': return (a || b) ? 1 : 0;
            case 'NOT': return (!a) ? 1 : 0;
            case 'NAND': return (!(a && b)) ? 1 : 0;
            default: return 0;
        }
    },

    attachEvents() {
        this.container.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                const stage = this.stages[this.currentStage];

                // Toggle 0 <-> 1
                stage.inputs[idx] = stage.inputs[idx] === 0 ? 1 : 0;

                this.render(); // Re-render to update UI (simplest way)
            });
        });

        this.container.querySelector('#btn-check-circuit').addEventListener('click', () => {
            this.checkStage();
        });
    },

    updateOutputView() {
        // Just for visual feedback before verification? 
        // Or keep it '?' until they click verify?
        // Let's keep it '?' to simulate "testing".
        // Actually, interactive is better.
        const stage = this.stages[this.currentStage];
        const res = this.calculateOutput(stage.type, stage.inputs);
        const outEl = this.container.querySelector('#circuit-output');
        outEl.innerText = res;
        outEl.style.background = res ? 'var(--color-success)' : '#333';
        outEl.style.color = res ? '#000' : '#fff';
        outEl.style.borderColor = res ? 'var(--color-success)' : 'var(--color-text-muted)';
    },

    checkStage() {
        const stage = this.stages[this.currentStage];
        const res = this.calculateOutput(stage.type, stage.inputs);

        if (res === stage.target) {
            this.game.showFeedback('CIRCUIT STABLE', 'Output matches required parameters.');

            setTimeout(() => {
                this.currentStage++;
                if (this.currentStage < this.stages.length) {
                    this.render();
                } else {
                    this.finishLevel();
                }
            }, 1000);
        } else {
            this.game.showFeedback('CIRCUIT FAILURE', `Expected Output: ${stage.target}. Current Output: ${res}.`);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 1500,
            xp: 1250,
            accuracy: 100,
            timeBonus: 0
        });
    }
};
