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
            <div class="flex flex-col h-full gap-8 animate-fade-in max-w-7xl mx-auto p-4 md:p-8 relative noise-overlay">
                
                <!-- Background Ambient -->
                <div class="absolute inset-0 bg-slate-950/20 pointer-events-none"></div>

                <!-- Header -->
                <div class="flex items-center justify-between mb-2">
                    
                    <!-- Left: Target Visualization -->
                    <div class="w-full lg:w-80 flex flex-col gap-6">
                        <div class="glass-panel p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center flex-1 bg-slate-950/40">
                            <span class="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">${this.game.getText('L5_TARGET_LBL')}</span>
                            <div class="text-7xl font-mono font-black text-white tracking-tighter mb-2">
                                ${stage.target}
                            </div>
                            <div class="h-px w-24 bg-slate-800 my-6"></div>
                            <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Wait for Sync...</span>
                        </div>

                        <div class="glass-panel p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center bg-slate-950/40">
                            <span class="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">${this.game.getText('L5_CURRENT_LBL')}</span>
                            <div id="current-val-display" class="text-6xl font-mono font-black tracking-tighter transition-all duration-300
                                ${currentVal === stage.target ? 'text-emerald-400' : 'text-slate-300'}">
                                ${currentVal}
                            </div>
                        </div>
                    </div>

                    <!-- Right: Matrix Core -->
                    <div class="flex-1 glass-panel rounded-[3rem] border border-white/5 p-8 flex flex-col bg-slate-950/20 overflow-hidden relative group">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <div class="grid grid-cols-3 sm:grid-cols-4 gap-4 flex-1">
                            ${this.bitValues.map((val, idx) => `
                                <button class="btn-bit group/bit h-full min-h-[120px] rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden
                                    ${this.currentBits[idx]
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-900 border-white/5 text-slate-500 hover:border-slate-700 hover:bg-slate-800'}" 
                                    data-idx="${idx}">
                                    
                                    <span class="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover/bit:opacity-100 transition-opacity">${val}</span>
                                    <div class="text-4xl font-black font-mono transition-transform duration-300 group-active/bit:scale-90">
                                        ${this.currentBits[idx]}
                                    </div>
                                    
                                    ${this.currentBits[idx] ? `
                                        <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                                    ` : ''}
                                </button>
                            `).join('')}
                        </div>

                        <div class="mt-8 pt-8 border-t border-white/5 flex justify-end">
                            <button id="btn-check-binary" class="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95">
                                <iconify-icon icon="solar:check-read-bold" class="text-2xl"></iconify-icon>
                                <span class="text-xl uppercase tracking-tighter">${this.game.getText('L5_BTN_CHECK')}</span>
                            </button>
                        </div>
                    </div>
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
