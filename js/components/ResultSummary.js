export default class ResultSummary {
    /**
     * @param {Object} props
     * @param {Array} props.results - Array of { question, selected, correct, isCorrect, explanation }
     * @param {Function} props.onRestart - Handler for restart
     * @param {Function} props.onNext - Handler for next level
     */
    constructor({ results, onRestart, onNext }) {
        this.results = results;
        this.onRestart = onRestart;
        this.onNext = onNext;
        this.id = `res-sum-${Math.random().toString(36).substr(2, 9)}`;
    }

    render() {
        const correctCount = this.results.filter(r => r.isCorrect).length;
        const total = this.results.length;
        const percentage = Math.round((correctCount / total) * 100);
        const passed = percentage >= 60;

        const itemsHtml = this.results.map((r, idx) => {
            const statusColor = r.isCorrect ? 'emerald' : 'rose';
            const icon = r.isCorrect ? 'solar:check-circle-bold' : 'solar:close-circle-bold';

            return `
                <div class="p-4 rounded-xl border border-${statusColor}-500/20 bg-${statusColor}-500/5 mb-3">
                    <div class="flex items-start gap-4">
                        <div class="mt-1 text-${statusColor}-400 shrink-0">
                            <iconify-icon icon="${icon}" class="text-xl"></iconify-icon>
                        </div>
                        <div class="flex-1 text-left">
                            <h4 class="text-sm font-semibold text-slate-300 mb-2">${idx + 1}. ${r.question}</h4>
                            
                            <div class="flex flex-col gap-1 text-xs">
                                <div class="flex gap-2">
                                    <span class="text-slate-500 w-16 uppercase tracking-wider font-bold">You:</span>
                                    <span class="font-mono text-${statusColor}-400 border-b border-${statusColor}-500/30 pb-0.5">${r.selected || 'No Answer'}</span>
                                </div>
                                ${!r.isCorrect ? `
                                <div class="flex gap-2">
                                    <span class="text-slate-500 w-16 uppercase tracking-wider font-bold">Answer:</span>
                                    <span class="font-mono text-emerald-400 border-b border-emerald-500/30 pb-0.5">${r.correct}</span>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div id="${this.id}" class="w-full h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
                
                <!-- Summary Card -->
                <div class="w-full md:w-1/3 flex flex-col gap-4">
                    <div class="glass-panel p-8 rounded-2xl border border-slate-700 text-center flex flex-col items-center justify-center flex-1 bg-slate-900/50">
                        <div class="w-24 h-24 rounded-full bg-slate-950 border-4 border-${passed ? 'emerald' : 'rose'}-500/30 flex items-center justify-center mb-6 shadow-2xl relative">
                            <iconify-icon icon="${passed ? 'solar:cup-star-bold' : 'solar:danger-circle-bold'}" class="text-5xl text-${passed ? 'emerald' : 'rose'}-500"></iconify-icon>
                            <div class="absolute inset-0 rounded-full animate-ping opacity-20 bg-${passed ? 'emerald' : 'rose'}-500"></div>
                        </div>

                        <h2 class="text-2xl font-black text-white uppercase tracking-tight mb-1">${passed ? 'Mission Accomplished' : 'Mission Failed'}</h2>
                        <p class="text-slate-400 text-sm mb-6">${passed ? 'Excellent work, Cadet.' : 'Simulation data corrupted. Re-calibration required.'}</p>

                        <div class="grid grid-cols-2 gap-4 w-full mb-8">
                            <div class="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                <div class="text-xs text-slate-500 uppercase tracking-widest mb-1">Score</div>
                                <div class="text-xl font-mono font-bold text-white">${percentage}%</div>
                            </div>
                            <div class="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                <div class="text-xs text-slate-500 uppercase tracking-widest mb-1">Correct</div>
                                <div class="text-xl font-mono font-bold text-emerald-400">${correctCount}/${total}</div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 w-full">
                            ${passed ? `
                                <button id="btn-next-${this.id}" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20">
                                    NEXT MISSION
                                </button>
                            ` : ''}
                            <button id="btn-retry-${this.id}" class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all border border-slate-700 hover:border-slate-600">
                                ${passed ? 'REPLAY MISSION' : 'RETRY PROTOCOL'}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Detailed Breakdown -->
                <div class="w-full md:w-2/3 glass-panel rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden flex flex-col">
                    <div class="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
                        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Tactical Breakdown</h3>
                    </div>
                    <div class="p-4 overflow-y-auto flex-1 custom-scrollbar">
                        ${itemsHtml}
                    </div>
                </div>

            </div>
        `;
    }

    attach(parentContainer) {
        const nextBtn = parentContainer.querySelector(`#btn-next-${this.id}`);
        const retryBtn = parentContainer.querySelector(`#btn-retry-${this.id}`);

        if (nextBtn) nextBtn.onclick = this.onNext;
        if (retryBtn) retryBtn.onclick = this.onRestart;
    }
}
