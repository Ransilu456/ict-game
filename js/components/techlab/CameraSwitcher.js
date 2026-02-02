import LabSimulation from './LabSimulation.js';

export default class CameraSwitcher extends LabSimulation {
    constructor(container, stats, device) {
        super(container, stats, device);
        this.programSource = 1;
        this.previewSource = 2;
        this.isTransistioning = false;
    }

    cacheControls() {
        this.controls.progBtns = document.querySelectorAll('.prog-btn');
        this.controls.prevBtns = document.querySelectorAll('.prev-btn');
        this.controls.cutBtn = document.getElementById('cut-btn');
        this.controls.autoBtn = document.getElementById('auto-btn');
    }

    attachEvents() {
        this.controls.progBtns.forEach(btn => {
            btn.onclick = () => {
                this.programSource = parseInt(btn.dataset.source);
                this.update();
            };
        });

        this.controls.prevBtns.forEach(btn => {
            btn.onclick = () => {
                this.previewSource = parseInt(btn.dataset.source);
                this.update();
            };
        });

        this.controls.cutBtn.onclick = () => this.cut();
        this.controls.autoBtn.onclick = () => this.auto();
    }

    cut() {
        const temp = this.programSource;
        this.programSource = this.previewSource;
        this.previewSource = temp;
        this.update();
    }

    auto() {
        if (this.isTransistioning) return;
        this.isTransistioning = true;
        this.update();
        setTimeout(() => {
            this.cut();
            this.isTransistioning = false;
            this.update();
        }, 500);
    }

    renderControls() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-[10px] font-bold text-rose-500 uppercase mb-2">Program (Live)</label>
                    <div class="grid grid-cols-4 gap-2">
                        ${[1, 2, 3, 4].map(s => `
                            <button class="prog-btn p-2 rounded-lg border font-mono text-xs transition-all ${this.programSource === s ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-500'}" data-source="${s}">${s}</button>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-emerald-500 uppercase mb-2">Preview</label>
                    <div class="grid grid-cols-4 gap-2">
                        ${[1, 2, 3, 4].map(s => `
                            <button class="prev-btn p-2 rounded-lg border font-mono text-xs transition-all ${this.previewSource === s ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-500'}" data-source="${s}">${s}</button>
                        `).join('')}
                    </div>
                </div>
                <div class="flex gap-2 pt-2">
                    <button id="cut-btn" class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">CUT</button>
                    <button id="auto-btn" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">AUTO</button>
                </div>
            </div>
        `;
    }

    update() {
        const root = this.container.querySelector('#canvas-root') || this.container;

        root.innerHTML = `
            <div class="w-full h-full flex flex-col gap-4 p-4">
                <div class="flex-1 grid grid-cols-2 gap-4">
                    <!-- Program View -->
                    <div class="relative rounded-2xl border-4 ${this.isTransistioning ? 'border-amber-500' : 'border-rose-600'} bg-slate-900 overflow-hidden flex items-center justify-center">
                        <div class="absolute top-2 left-2 bg-rose-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">Program</div>
                        <iconify-icon icon="solar:videocamera-record-bold" class="text-4xl ${this.isTransistioning ? 'text-amber-500' : 'text-rose-600'} animate-pulse"></iconify-icon>
                        <div class="absolute bottom-2 right-2 text-white font-mono text-xl">CAM ${this.programSource}</div>
                    </div>
                    <!-- Preview View -->
                    <div class="relative rounded-2xl border-4 border-emerald-600 bg-slate-900 overflow-hidden flex items-center justify-center">
                        <div class="absolute top-2 left-2 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">Preview</div>
                        <iconify-icon icon="solar:camera-bold" class="text-4xl text-emerald-600"></iconify-icon>
                        <div class="absolute bottom-2 right-2 text-white font-mono text-xl">CAM ${this.previewSource}</div>
                    </div>
                </div>
                <!-- Mini Grid -->
                <div class="h-1/4 grid grid-cols-4 gap-2">
                    ${[1, 2, 3, 4].map(s => `
                        <div class="bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
                            <span class="text-[8px] text-slate-600 font-mono absolute top-1 left-1">${s}</span>
                            <iconify-icon icon="solar:videocamera-bold" class="text-slate-800"></iconify-icon>
                            ${this.programSource === s ? '<div class="absolute inset-0 border-2 border-rose-600/50"></div>' : ''}
                            ${this.previewSource === s ? '<div class="absolute inset-0 border-2 border-emerald-600/50"></div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.stats.innerHTML = `
            <div class="flex justify-between text-slate-400"><span>SIGNAL IN:</span> <span class="text-white">4 x SDI (1080p60)</span></div>
            <div class="flex justify-between text-slate-400"><span>RECORDING:</span> <span class="text-rose-400 font-bold">LIVE ON AIR</span></div>
            <div class="flex justify-between text-slate-400"><span>TIME CODE:</span> <span class="text-indigo-400 font-mono">${new Date().toTimeString().split(' ')[0]}</span></div>
        `;
    }
}
