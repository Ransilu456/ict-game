/**
 * Level 15: Multimedia Architecture
 * Mechanic: Camera Hardware Assembly + Codec Classification.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.itemsResolved = 0;
        this.totalItems = 6; // 3 hardware, 3 codecs

        this.hardware = [
            { id: 'h1', name: this.game.getText('L15_ITEM_SENSOR'), type: 'Capture', target: 't1' },
            { id: 'h2', name: this.game.getText('L15_ITEM_DSP'), type: 'Processing', target: 't2' },
            { id: 'h3', name: this.game.getText('L15_ITEM_STORAGE'), type: 'Archival', target: 't3' }
        ];

        this.codecs = [
            { id: 'c1', name: 'H.264 / HEVC', category: 'VIDEO', desc: 'High Efficiency Video Coding' },
            { id: 'c2', name: 'JPEG / HEIF', category: 'IMAGE', desc: 'Digital Still Imaging' },
            { id: 'c3', name: 'AAC / FLAC', category: 'AUDIO', desc: 'Acoustic Compression' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto flex flex-col gap-12">
                <div class="text-center">
                    <h2 class="text-2xl font-bold text-white mb-2">${this.game.getText('L15_TITLE')}</h2>
                    <p class="text-slate-400">${this.game.getText('L15_DESC')}</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    <!-- Hardware Assembly -->
                    <div class="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                        <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">${this.game.getText('L15_TITLE')} // PHASE 1</h3>
                        
                        <div class="space-y-6">
                            ${this.hardware.map(item => `
                                <div class="flex items-center gap-4">
                                    <div class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 drop-target flex items-center justify-center" data-target="${item.target}">
                                        <iconify-icon icon="solar:camera-bold" class="text-2xl text-slate-800"></iconify-icon>
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-[10px] font-black text-slate-600 uppercase mb-1">${item.type} MODULE</div>
                                        <div class="text-sm font-bold text-slate-400">Awaiting installation...</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="mt-10 flex gap-4 overflow-x-auto pb-4" id="hw-bank">
                             ${this.hardware.map(item => `
                                <div class="hw-item px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl cursor-grab active:cursor-grabbing text-xs font-bold text-white shrink-0 hover:border-indigo-500" 
                                    draggable="true" data-id="${item.id}" data-target="${item.target}">
                                    ${item.name}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Codec Classification -->
                    <div class="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                        <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">${this.game.getText('L15_CODEC_LBL')} // PHASE 2</h3>
                        
                        <div class="space-y-4">
                            ${this.codecs.map(item => `
                                <div class="bg-slate-950 border border-slate-800 p-4 rounded-2xl hover:border-emerald-500/50 transition-all group">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="text-xs font-black text-emerald-400 font-mono">${item.name}</span>
                                        <iconify-icon icon="solar:playback-speed-bold" class="text-slate-800 group-hover:text-emerald-500"></iconify-icon>
                                    </div>
                                    <p class="text-[10px] text-slate-500 mb-4 font-medium uppercase tracking-tighter">${item.desc}</p>
                                    <div class="flex gap-2">
                                        ${['VIDEO', 'IMAGE', 'AUDIO'].map(cat => `
                                            <button class="codec-btn flex-1 py-1.5 rounded-lg border border-slate-800 text-[9px] font-black text-slate-600 hover:text-white hover:bg-slate-800 transition-all" 
                                                data-id="${item.id}" data-type="${cat}" data-correct="${item.category}">
                                                ${cat}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                </div>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        // Drag hardware
        const hwBars = this.container.querySelectorAll('.hw-item');
        const hwdTargets = this.container.querySelectorAll('.drop-target');

        hwBars.forEach(item => {
            item.ondragstart = (e) => {
                e.dataTransfer.setData('id', item.dataset.id);
                e.dataTransfer.setData('target', item.dataset.target);
            };
        });

        hwdTargets.forEach(target => {
            target.ondragover = (e) => e.preventDefault();
            target.ondrop = (e) => {
                const id = e.dataTransfer.getData('id');
                const tCode = e.dataTransfer.getData('target');
                if (tCode === target.dataset.target) {
                    this.resolveHW(id, target);
                } else {
                    this.game.showFeedback('HARDWARE MISMATCH', 'Mechanical interface incompatibility detected.');
                }
            };
        });

        // Codec buttons
        this.container.querySelectorAll('.codec-btn').forEach(btn => {
            btn.onclick = () => {
                if (btn.dataset.locked) return;
                const type = btn.dataset.type;
                const correct = btn.dataset.correct;

                if (type === correct) {
                    btn.classList.add('bg-emerald-500', 'text-white', 'border-emerald-400');
                    this.resolveCodec(btn.dataset.id);
                } else {
                    btn.classList.add('bg-rose-500', 'text-white', 'border-rose-400');
                    this.game.showFeedback('CODEC ERROR', 'Classification error. Media compression format mismatch.');
                }
            };
        });
    },

    resolveHW(id, target) {
        const item = this.hardware.find(h => h.id === id);
        const source = this.container.querySelector(`.hw-item[data-id="${id}"]`);

        target.innerHTML = `
            <iconify-icon icon="solar:check-circle-bold" class="text-3xl text-emerald-400 animate-pulse"></iconify-icon>
        `;
        target.classList.add('bg-emerald-500/10', 'border-emerald-500/50');
        target.nextElementSibling.querySelector('div:last-child').innerText = 'MODULE ONLINE';
        target.nextElementSibling.querySelector('div:last-child').className = 'text-sm font-bold text-emerald-400';

        source.remove();
        this.itemsResolved++;
        this.score += 500;
        this.checkFinish();
    },

    resolveCodec(id) {
        const btns = this.container.querySelectorAll(`.codec-btn[data-id="${id}"]`);
        btns.forEach(b => b.dataset.locked = "true");

        this.itemsResolved++;
        this.score += 500;
        this.checkFinish();
    },

    checkFinish() {
        if (this.itemsResolved === this.totalItems) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.score,
            xp: 3000,
            accuracy: 100
        });
    }
};
