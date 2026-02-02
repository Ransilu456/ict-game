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
                gate_key: 'NAND GATE (AND + NOT)'
            },
            {
                id: 4,
                type: 'XOR', // Exclusive OR
                inputs: [1, 1],
                target: 0, // 1^1 = 0
                gate_key: 'L4_GATE_XOR'
            },
            {
                id: 5,
                type: 'COMBO', // (A AND B) OR C
                inputs: [0, 1, 0],
                target: 1,
                gate_key: 'L4_GATE_COMBO'
            }
        ];

        this.render();
    },

    render() {
        const stage = this.stages[this.currentStage];
        const gateLabel = stage.gate_key.startsWith('L4') ? this.game.getText(stage.gate_key) : stage.gate_key;

        let subText = '';
        if (stage.type === 'COMBO') subText = '(Input 1 & 2) OR Input 3';
        if (stage.type === 'XOR') subText = 'Input 1 ≠ Input 2';

        this.container.innerHTML = `
            <h2>${this.game.getText('L4_TITLE')}</h2>
            <p>${this.game.getText('L4_DESC')}</p>
            
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:60%;">
                
                <h3 style="color:var(--color-secondary); margin-bottom: 0.5rem;">${gateLabel}</h3>
                ${subText ? `<div style="color:var(--color-text-muted); margin-bottom:1rem; font-family:var(--font-mono);">${subText}</div>` : ''}
                
                <div class="circuit-board" style="
                    display:flex; gap:2rem; align-items:center; 
                    background:rgba(255,255,255,0.05); padding:2rem; border-radius:16px; border:2px solid var(--color-primary);
                ">
                    <!-- Inputs -->
                    <div style="display:flex; flex-direction:column; gap:1.5rem;">
                        ${stage.inputs.map((val, idx) => `
                            <button class="btn-toggle" data-idx="${idx}" style="
                                width:60px; height:60px; border-radius:50%; border:2px solid var(--color-text);
                                background: ${val ? 'var(--color-success)' : 'transparent'};
                                color: ${val ? '#000' : 'var(--color-text)'};
                                font-size:1.5rem; cursor:pointer; font-weight:bold;
                                display: flex; align-items: center; justify-content: center;
                            ">
                                ${val}
                            </button>
                        `).join('')}
                    </div>

                    <!-- Gate Visual -->
                    <div style="
                        width:120px; height:120px; background:var(--color-bg-secondary);
                        border:2px solid var(--color-secondary); display:flex; align-items:center; justify-content:center;
                        font-size:1.5rem; border-radius:8px; font-weight:bold; color:var(--color-primary);
                        box-shadow: 0 0 15px rgba(0,243,255,0.1);
                    ">
                        ${this.getGateIcon(stage.type)}
                    </div>

                    <!-- Output (Calculated Live) -->
                    <div id="circuit-output" style="
                        width:80px; height:80px; border-radius:50%; 
                        border:4px solid var(--color-text-muted);
                        display:flex; align-items:center; justify-content:center; font-size:1.5rem;
                        background: #333; transition: all 0.3s;
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
        if (type === 'AND') return 'AND';
        if (type === 'OR') return 'OR';
        if (type === 'NOT') return 'NOT';
        if (type === 'NAND') return 'NAND';
        if (type === 'XOR') return 'XOR';
        if (type === 'COMBO') return 'A·B + C';
        return '?';
    },

    calculateOutput(type, inputs) {
        const [a, b, c] = inputs; // c might be undefined for 2-input gates
        switch (type) {
            case 'AND': return (a && b) ? 1 : 0;
            case 'OR': return (a || b) ? 1 : 0;
            case 'NOT': return (!a) ? 1 : 0;
            case 'NAND': return (!(a && b)) ? 1 : 0;
            case 'XOR': return (a !== b) ? 1 : 0;
            case 'COMBO': return ((a && b) || c) ? 1 : 0; // Custom (A AND B) OR C
            default: return 0;
        }
    },

    attachEvents() {
        this.container.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.btn-toggle');
                if (!target) return;

                const idx = parseInt(target.dataset.idx);
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
