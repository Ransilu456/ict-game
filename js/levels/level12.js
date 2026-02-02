/**
 * Level 12: Neural Training (AI)
 * Mechanic: Classify Signal vs Noise.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.currentIndex = 0;
        this.totalData = 8;

        this.dataset = [
            { label: 'SIGNAL', data: 'Pattern Detected: 0xAF32', type: 'signal' },
            { label: 'NOISE', data: 'Static Interruption: RRRR', type: 'noise' },
            { label: 'SIGNAL', data: 'Neural Sync: Stable', type: 'signal' },
            { label: 'SIGNAL', data: 'Binary Cluster: Alpha', type: 'signal' },
            { label: 'NOISE', data: 'Background Radiation', type: 'noise' },
            { label: 'NOISE', data: 'Corrupted Packet: NULL', type: 'noise' },
            { label: 'SIGNAL', data: 'Data Stream: Consistent', type: 'signal' },
            { label: 'NOISE', data: 'Unidentified Fragment', type: 'noise' }
        ];

        this.render();
    },

    render() {
        const item = this.dataset[this.currentIndex];

        this.container.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-2xl font-bold text-white mb-2">${this.game.getText('L12_TITLE')}</h2>
                    <p class="text-slate-400">${this.game.getText('L12_DESC')}</p>
                </div>

                <div class="bg-slate-900 border-2 border-slate-800 rounded-3xl p-10 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <iconify-icon icon="solar:brain-bold-duotone" class="text-[300px] text-white"></iconify-icon>
                    </div>

                    <div class="w-full flex justify-between items-center px-4">
                        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Feed</span>
                        <span class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">${this.currentIndex + 1} / ${this.totalData}</span>
                    </div>

                    <div class="w-full h-40 bg-slate-950 rounded-2xl border border-indigo-500/20 flex flex-col items-center justify-center p-6 text-center group">
                        <div class="p-3 rounded-full bg-indigo-500/10 mb-4 group-hover:scale-110 transition-transform">
                            <iconify-icon icon="solar:transmission-bold" class="text-3xl text-indigo-400"></iconify-icon>
                        </div>
                        <div class="text-xl font-mono font-bold text-white tracking-widest animate-pulse">${item.data}</div>
                    </div>

                    <div class="flex gap-6 w-full">
                        <button class="btn-classify flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2" data-type="signal">
                            <iconify-icon icon="solar:check-circle-bold" class="text-xl"></iconify-icon>
                            <span>${this.game.getText('L12_SIGNAL')}</span>
                        </button>
                        <button class="btn-classify flex-1 py-5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2" data-type="noise">
                            <iconify-icon icon="solar:close-circle-bold" class="text-xl"></iconify-icon>
                            <span>${this.game.getText('L12_NOISE')}</span>
                        </button>
                    </div>

                    <div class="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-indigo-500 transition-all duration-500" style="width: ${(this.currentIndex / this.totalData) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        this.container.querySelectorAll('.btn-classify').forEach(btn => {
            btn.onclick = () => {
                const type = btn.dataset.type;
                if (type === this.dataset[this.currentIndex].type) {
                    this.score += 250;
                    this.nextData();
                } else {
                    this.game.showFeedback('NEURAL MISALIGNMENT', 'AI model accuracy dropped! That data point was misclassified.');
                }
            };
        });
    },

    nextData() {
        this.currentIndex++;
        if (this.currentIndex < this.Dataset.length) { // Typo fix: dataset not Dataset
            this.render();
        } else {
            this.finishLevel();
        }
    },

    // Refined nextData
    nextData() {
        this.currentIndex++;
        if (this.currentIndex < this.dataset.length) {
            this.render();
        } else {
            this.finishLevel();
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.score,
            xp: 2500,
            accuracy: 100
        });
    }
};
