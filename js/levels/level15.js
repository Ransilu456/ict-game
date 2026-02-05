import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.itemsResolved = 0;
        this.results = [];
        this.selectedItemId = null;

        this.hardware = [
            { id: 'h1', name: this.game.getText('L15_ITEM_SENSOR'), type: 'Capture', target: 't1', icon: 'solar:camera-bold' },
            { id: 'h2', name: this.game.getText('L15_ITEM_DSP'), type: 'Processing', target: 't2', icon: 'solar:chip-bold' },
            { id: 'h3', name: this.game.getText('L15_ITEM_STORAGE'), type: 'Archival', target: 't3', icon: 'solar:disk-bold' }
        ];

        this.codecs = [
            { id: 'c1', name: 'H.264 / HEVC', category: 'VIDEO', desc: 'High Efficiency Video Coding' },
            { id: 'c2', name: 'JPEG / HEIF', category: 'IMAGE', desc: 'Digital Still Imaging' },
            { id: 'c3', name: 'AAC / FLAC', category: 'AUDIO', desc: 'Acoustic Compression' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';

        const content = document.createElement('div');
        content.className = "flex flex-col gap-8 w-full";

        const header = new Card({
            title: this.game.getText('L15_TITLE'),
            subtitle: this.game.getText('L15_DESC'),
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const statusFeedback = new Feedback({
            title: "Architecture Workspace",
            message: "Analyze the requirements and assign the appropriate hardware and codec profiles.",
            type: "neutral"
        });
        content.appendChild(statusFeedback.render());

        const mainGrid = document.createElement('div');
        mainGrid.className = "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full";

        // Phase 1: Hardware Integration
        const hwContent = document.createElement('div');
        hwContent.className = "space-y-4";
        this.hardware.forEach(item => {
            const isDone = this.results.find(r => r.id === item.id && r.isCorrect);
            const slot = document.createElement('div');
            slot.className = "flex items-center gap-4 group cursor-pointer";
            slot.innerHTML = `
                <div class="drop-target w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center
                    ${isDone ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-950/50 border-white/5 hover:border-indigo-500/30'}"
                    data-target="${item.target}" data-item-id="${item.id}">
                    ${isDone ? `<iconify-icon icon="${item.icon}" class="text-3xl text-emerald-400 animate-bounce-in"></iconify-icon>` : `<iconify-icon icon="solar:box-minimalistic-bold" class="text-2xl text-slate-800 opacity-30"></iconify-icon>`}
                </div>
                <div class="flex-1">
                    <div class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">${item.type} UNIT</div>
                    <div class="text-xs font-bold ${isDone ? 'text-emerald-400' : 'text-slate-600'}">${isDone ? 'HW_STATUS_LINKED' : 'AWAITING_HW_MODULE'}</div>
                </div>
            `;
            slot.onclick = () => this.handleHWInteraction(item.target, item.id);
            hwContent.appendChild(slot);
        });

        const hwTray = document.createElement('div');
        hwTray.className = "flex flex-wrap gap-3 mt-6";
        this.hardware.forEach(item => {
            if (this.results.find(r => r.id === item.id && r.isCorrect)) return;
            const isSelected = this.selectedItemId === item.id;
            const el = document.createElement('div');
            el.className = `hw-item px-4 py-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer select-none touch-none
                ${isSelected ? 'bg-indigo-600 border-indigo-400 text-white scale-105 shadow-indigo-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500/50'}`;
            el.draggable = true;
            el.dataset.id = item.id;
            el.dataset.target = item.target;
            el.innerText = item.name;
            el.onclick = (e) => {
                e.stopPropagation();
                this.selectedItemId = isSelected ? null : item.id;
                this.render();
            };
            hwTray.appendChild(el);
        });

        const hwCard = new Card({ title: "Module Integration", content: hwContent, footer: hwTray, variant: 'glass' });

        // Phase 2: Codec Classification
        const codecContent = document.createElement('div');
        codecContent.className = "space-y-4";
        this.codecs.forEach(codec => {
            const isDone = this.results.find(r => r.id === codec.id && r.isCorrect);
            const container = document.createElement('div');
            container.className = `p-4 rounded-2xl border transition-all ${isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/50 border-white/5'}`;
            container.innerHTML = `
                <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-black font-mono tracking-wider ${isDone ? 'text-emerald-400' : 'text-indigo-400'}">${codec.name}</span>
                    <iconify-icon icon="solar:programming-bold" class="${isDone ? 'text-emerald-500' : 'text-slate-800'}"></iconify-icon>
                </div>
                <div class="flex gap-2">
                    ${['VIDEO', 'IMAGE', 'AUDIO'].map(cat => `
                        <button class="codec-btn flex-1 py-3 rounded-xl border text-[8px] font-black transition-all uppercase tracking-widest
                            ${isDone && codec.category === cat ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-white hover:border-indigo-500/50'}"
                            data-id="${codec.id}" data-category="${cat}" ${isDone ? 'disabled' : ''}>
                            ${cat}
                        </button>
                    `).join('')}
                </div>
            `;
            codecContent.appendChild(container);
        });

        const codecCard = new Card({ title: "Codec Profiles", content: codecContent, variant: 'glass' });

        mainGrid.appendChild(hwCard.render());
        mainGrid.appendChild(codecCard.render());
        content.appendChild(mainGrid);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());

        this.attachEvents();
    },

    attachEvents() {
        const hwTrayItems = this.container.querySelectorAll('.hw-item');
        const hwdTargets = this.container.querySelectorAll('.drop-target');

        hwTrayItems.forEach(item => {
            item.ondragstart = (e) => {
                e.dataTransfer.setData('id', item.dataset.id);
                e.dataTransfer.setData('target', item.dataset.target);
                this.selectedItemId = item.dataset.id;
                item.classList.add('opacity-50');
            };
            item.ondragend = () => item.classList.remove('opacity-50');
        });

        hwdTargets.forEach(target => {
            target.ondragover = (e) => {
                e.preventDefault();
                target.classList.add('border-indigo-500/50', 'bg-indigo-500/5');
            };
            target.ondragleave = () => target.classList.remove('border-indigo-500/50', 'bg-indigo-500/5');
            target.ondrop = (e) => {
                const id = e.dataTransfer.getData('id');
                const tCode = e.dataTransfer.getData('target');
                target.classList.remove('border-indigo-500/50', 'bg-indigo-500/5');
                this.handleHWDrop(id, tCode, target);
            };
        });

        this.container.querySelectorAll('.codec-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const cat = btn.dataset.category;
                this.handleCodecClick(id, cat, btn);
            };
        });
    },

    handleHWInteraction(targetCode, targetId) {
        if (!this.selectedItemId) return;
        const item = this.hardware.find(h => h.id === this.selectedItemId);
        this.handleHWDrop(item.id, item.target, { dataset: { target: targetCode } });
    },

    handleHWDrop(id, tCode, target) {
        const item = this.hardware.find(h => h.id === id);
        const isMatch = tCode === target.dataset.target;

        if (isMatch) {
            this.results.push({ id, question: `Module: ${item.name}`, isCorrect: true });
            this.itemsResolved++;
            this.selectedItemId = null;
            this.render();
        } else {
            const el = this.container.querySelector(`[data-item-id="${target.dataset.itemId}"]`);
            if (el) {
                el.classList.add('animate-shake', 'border-rose-500');
                setTimeout(() => el.classList.remove('animate-shake', 'border-rose-500'), 500);
            }
        }
        this.checkFinish();
    },

    handleCodecClick(id, category, btn) {
        const codec = this.codecs.find(c => c.id === id);
        const isMatch = category === codec.category;

        if (isMatch) {
            this.results.push({ id, question: `Codec: ${codec.name}`, isCorrect: true });
            this.itemsResolved++;
            this.render();
        } else {
            btn.classList.add('animate-shake', 'bg-rose-500/20', 'border-rose-500/50');
            setTimeout(() => btn.classList.remove('animate-shake', 'bg-rose-500/20', 'border-rose-500/50'), 500);
        }
        this.checkFinish();
    },

    checkFinish() {
        if (this.itemsResolved === 6) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 3000,
            xp: 3000,
            accuracy: 100,
            detailedResults: this.results
        });
    }
};

