/**
 * Level 4: Logic Gates
 * Mechanic: Interactive Circuit (Toggle Inputs to get Output = 1)
 * Refactored for Dashboard UI + Tailwind + Optimized Rendering
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;

        // Stages
        this.stages = [
            {
                id: 1,
                type: 'AND',
                inputs: [0, 0],
                target: 1,
                gate_key: 'L4_GATE_AND',
                desc: 'Output is 1 only if ALL inputs are 1.'
            },
            {
                id: 2,
                type: 'OR',
                inputs: [0, 0],
                target: 1,
                gate_key: 'L4_GATE_OR',
                desc: 'Output is 1 if ANY input is 1.'
            },
            {
                id: 3,
                type: 'NAND',
                inputs: [1, 1],
                target: 0,
                gate_key: 'NAND GATE (AND + NOT)',
                desc: 'Output is 0 only if ALL inputs are 1 (Opposite of AND).'
            },
            {
                id: 4,
                type: 'XOR',
                inputs: [1, 1],
                target: 0,
                gate_key: 'L4_GATE_XOR',
                desc: 'Output is 1 only if inputs are DIFFERENT.'
            },
            {
                id: 5,
                type: 'COMBO',
                inputs: [0, 1, 0],
                target: 1,
                gate_key: 'L4_GATE_COMBO',
                desc: 'Logic: (Input A AND Input B) OR Input C'
            }
        ];

        this.render(); // Initial Render
    },

    render() {
        const stage = this.stages[this.currentStage];
        const gateLabel = stage.gate_key.startsWith('L4') ? this.game.getText(stage.gate_key) : stage.gate_key;

        // Fixed: Use h-full and flex-col nicely to avoid "container border" issues.
        // Ensure inputs wrap if screen is small.

        this.container.innerHTML = `
            <div class="flex flex-col items-center justify-center w-full gap-4 md:gap-8 animate-fade-in relative z-10 p-2 md:p-6">

                
                <div class="text-center shrink-0">
                    <h2 class="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">${this.game.getText('L4_TITLE')}</h2>
                    <p class="text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-tight">${this.game.getText('L4_DESC')}</p>
                </div>

                <!-- Circuit Board -->
                <div class="w-full max-w-4xl glass-panel p-6 md:p-12 rounded-2xl border border-indigo-500/30 bg-slate-900/40 relative shadow-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[300px]" id="circuit-board">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

                    <!-- Progress -->
                    <div class="absolute top-4 right-4 text-xs font-mono text-slate-500">
                        CIRCUIT ${this.currentStage + 1} / ${this.stages.length}
                    </div>

                    <div class="flex flex-col items-center w-full gap-6 md:gap-8">
                        
                        <div class="text-center">
                            <div class="text-xl md:text-2xl font-bold text-cyan-300 tracking-widest uppercase mb-1">
                                ${gateLabel}
                            </div>
                            <div class="text-xs md:text-sm text-slate-400 font-normal normal-case max-w-sm mx-auto">${stage.desc || ''}</div>
                        </div>

                        <!-- Circuit Flow -->
                        <div class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
                            
                            <!-- Inputs -->
                            <div class="flex flex-row md:flex-col gap-4 md:gap-6 justify-center flex-wrap" id="inputs-container">
                                ${stage.inputs.map((val, idx) => `
                                    <div class="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                                        <button class="btn-toggle w-12 h-12 md:w-16 md:h-16 rounded-full border-2 transition-all flex items-center justify-center text-lg md:text-xl font-bold font-mono relative overflow-hidden group
                                            ${val ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-600 text-slate-500 hover:border-slate-400'}"
                                            data-idx="${idx}">
                                            <span class="relative z-10 val-text">${val}</span>
                                            <div class="absolute inset-0 bg-emerald-500/10 animate-pulse ${val ? '' : 'hidden'} pulse-layer"></div>
                                        </button>
                                        <!-- Wire segment horizontal on desktop, vertical on mobile? Actually simple line -->
                                        <div class="w-1 md:w-8 h-4 md:h-1 ${val ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-700'} rounded-full transition-all wire-segment"></div>
                                    </div>
                                `).join('')}
                            </div>

                            <!-- Gate Logic Box -->
                            <div class="shrink-0 w-24 h-24 md:w-32 md:h-32 glass-panel border-2 border-cyan-500/50 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)] relative transition-all duration-500 my-2 md:my-0" id="logic-unit">
                                <iconify-icon icon="solar:chip-bold" class="text-4xl md:text-5xl text-cyan-400"></iconify-icon>
                                <div class="absolute -bottom-6 text-[10px] md:text-xs font-mono text-cyan-500/80">LOGIC UNIT</div>
                            </div>

                            <!-- Output -->
                            <div class="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                                <div class="w-1 md:w-8 h-4 md:h-1 bg-slate-700 rounded-full transition-all" id="wire-out"></div>
                                <div class="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center text-xl md:text-2xl font-bold font-mono transition-all
                                    bg-slate-900 border-slate-700 text-slate-500" id="circuit-output">
                                    ?
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                <!-- Controls -->
                <button id="btn-check-circuit" class="shrink-0 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95">
                    <iconify-icon icon="solar:bolt-bold"></iconify-icon>
                    <span>${this.game.getText('L4_BTN_CHECK') || 'Verify Circuit'}</span>
                </button>

            </div>
        `;

        this.updateVisualsOnly(); // Initial visual state
        this.attachEvents();
    },

    updateVisualsOnly() {
        const stage = this.stages[this.currentStage];
        const res = this.calculateOutput(stage.type, stage.inputs);

        // Update Inputs
        stage.inputs.forEach((val, idx) => {
            const btn = this.container.querySelector(`.btn-toggle[data-idx="${idx}"]`);
            const wire = btn.nextElementSibling;

            btn.querySelector('.val-text').innerText = val;
            const pulse = btn.querySelector('.pulse-layer');

            if (val) {
                btn.className = "btn-toggle w-12 h-12 md:w-16 md:h-16 rounded-full border-2 transition-all flex items-center justify-center text-lg md:text-xl font-bold font-mono relative overflow-hidden group bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
                pulse.classList.remove('hidden');
                wire.className = "w-1 md:w-8 h-4 md:h-1 bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] rounded-full transition-all wire-segment";
            } else {
                btn.className = "btn-toggle w-12 h-12 md:w-16 md:h-16 rounded-full border-2 transition-all flex items-center justify-center text-lg md:text-xl font-bold font-mono relative overflow-hidden group bg-slate-800 border-slate-600 text-slate-500 hover:border-slate-400";
                pulse.classList.add('hidden');
                wire.className = "w-1 md:w-8 h-4 md:h-1 bg-slate-700 rounded-full transition-all wire-segment";
            }
        });

        // Update Output
        const outEl = this.container.querySelector('#circuit-output');
        const wireOut = this.container.querySelector('#wire-out');
        const logicUnit = this.container.querySelector('#logic-unit');

        outEl.innerText = res;
        if (res === 1) {
            outEl.className = "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center text-xl md:text-2xl font-bold font-mono transition-all bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse";
            wireOut.className = "w-1 md:w-8 h-4 md:h-1 bg-emerald-500 rounded-full transition-all shadow-[0_0_5px_rgba(16,185,129,0.5)]";
            logicUnit.className = "shrink-0 w-24 h-24 md:w-32 md:h-32 glass-panel border-2 border-emerald-500/50 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] relative transition-all duration-300 my-2 md:my-0";
            logicUnit.querySelector('iconify-icon').className = "text-4xl md:text-5xl text-emerald-400";
        } else {
            outEl.className = "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center text-xl md:text-2xl font-bold font-mono transition-all bg-slate-900 border-slate-700 text-slate-500";
            wireOut.className = "w-1 md:w-8 h-4 md:h-1 bg-slate-700 rounded-full transition-all";
            logicUnit.className = "shrink-0 w-24 h-24 md:w-32 md:h-32 glass-panel border-2 border-cyan-500/50 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.1)] relative transition-all duration-300 my-2 md:my-0";
            logicUnit.querySelector('iconify-icon').className = "text-4xl md:text-5xl text-cyan-400";
        }
    },

    calculateOutput(type, inputs) {
        const [a, b, c] = inputs;
        switch (type) {
            case 'AND': return (a && b) ? 1 : 0;
            case 'OR': return (a || b) ? 1 : 0;
            case 'NOT': return (!a) ? 1 : 0;
            case 'NAND': return (!(a && b)) ? 1 : 0;
            case 'XOR': return (a !== b) ? 1 : 0;
            case 'COMBO': return ((a && b) || c) ? 1 : 0;
            default: return 0;
        }
    },

    attachEvents() {
        this.container.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.btn-toggle');
                const idx = parseInt(target.dataset.idx);
                const stage = this.stages[this.currentStage];

                stage.inputs[idx] = stage.inputs[idx] === 0 ? 1 : 0;
                this.updateVisualsOnly();
            });
        });

        this.container.querySelector('#btn-check-circuit').addEventListener('click', () => {
            this.checkStage();
        });
    },

    checkStage() {
        const stage = this.stages[this.currentStage];
        const res = this.calculateOutput(stage.type, stage.inputs);

        if (res === stage.target) {
            this.game.showFeedback(this.game.getText('RES_SUCCESS'), 'Circuit logic verified. Stabilization complete.');

            setTimeout(() => {
                this.currentStage++;
                if (this.currentStage < this.stages.length) {
                    this.render(); // Full re-render needed for new stage
                } else {
                    this.finishLevel();
                }
            }, 1000);
        } else {
            this.game.showFeedback(this.game.getText('RES_FAIL'), `Target output was ${stage.target}, but circuit produced ${res}.`);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 1500,
            xp: 1250,
            accuracy: 100,
            timeBonus: 100
        });
    }
};
