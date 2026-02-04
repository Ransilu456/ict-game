/**
 * Level 15: Multimedia Architecture
 * Mechanic: Camera Hardware Assembly + Codec Classification.
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.itemsResolved = 0;
        this.results = [];

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

        const header = new Card({
            title: this.game.getText('L15_TITLE'),
            subtitle: this.game.getText('L15_DESC'),
            variant: 'flat',
            customClass: 'text-center mb-8'
        });

        const statusFeedback = new Feedback({
            title: "Multimedia Assembly Guide",
            message: "1. Drag hardware modules to their matching slots (Sensor -> Capture, DSP -> Processing, etc.)\n2. Select the correct category for each media codec.",
            type: "neutral"
        });

        const grid = document.createElement('div');
        grid.className = "grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto";

        const hwContent = document.createElement('div');
        hwContent.className = "space-y-6";
        this.hardware.forEach(item => {
            const isDone = this.results.find(r => r.id === item.id && r.isCorrect);
            hwContent.innerHTML += `
                <div class="flex items-center gap-4 group">
                    <div class="drop-target w-20 h-20 rounded-2xl border-2 border-dashed ${isDone ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-950 border-slate-800'} flex items-center justify-center transition-all relative" data-target="${item.target}" data-item-id="${item.id}">
                        ${isDone ? `<iconify-icon icon="${item.icon}" class="text-3xl text-emerald-400"></iconify-icon>` : `<iconify-icon icon="solar:box-minimalistic-bold" class="text-2xl text-slate-800"></iconify-icon>`}
                    </div>
                    <div class="flex-1">
                        <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">${item.type} MODULE</div>
                        <div class="text-sm font-bold ${isDone ? 'text-emerald-400' : 'text-slate-500'}">${isDone ? 'MODULE_CONNECTED' : 'PLACE_UNIT_HERE'}</div>
                    </div>
                </div>
            `;
        });

        const tray = document.createElement('div');
        tray.className = "mt-10 flex gap-4 overflow-x-auto pb-4";
        this.hardware.forEach(item => {
            if (this.results.find(r => r.id === item.id && r.isCorrect)) return;
            const el = document.createElement('div');
            el.className = "hw-item px-5 py-3 bg-slate-900 border border-slate-700 rounded-xl cursor-grab active:cursor-grabbing text-[10px] font-black text-white hover:border-indigo-500 shrink-0 uppercase tracking-widest";
            el.draggable = true;
            el.dataset.id = item.id;
            el.dataset.target = item.target;
            el.innerText = item.name;
            tray.appendChild(el);
        });

        const phase1Card = new Card({
            title: "Hardware Integration (Phase I)",
            content: hwContent,
            footer: tray,
            variant: 'glass'
        });

        const codecContent = document.createElement('div');
        codecContent.className = "space-y-4";
        this.codecs.forEach(codec => {
            const isDone = this.results.find(r => r.id === codec.id && r.isCorrect);
            const container = document.createElement('div');
            container.className = `p-5 rounded-2xl border-2 transition-all ${isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950 border-slate-800'}`;
            container.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-black font-mono ${isDone ? 'text-emerald-400' : 'text-indigo-300'}">${codec.name}</span>
                    <iconify-icon icon="solar:playback-speed-bold" class="${isDone ? 'text-emerald-500' : 'text-slate-700'}"></iconify-icon>
                </div>
                <p class="text-[9px] text-slate-500 mb-4 font-bold uppercase tracking-tighter">${codec.desc}</p>
                <div class="flex gap-2">
                    ${['VIDEO', 'IMAGE', 'AUDIO'].map(cat => `
                        <button class="codec-btn flex-1 py-2 rounded-xl border border-slate-800 text-[10px] font-black text-slate-500 hover:text-white transition-all ${isDone && codec.category === cat ? 'bg-emerald-500 border-emerald-400 text-white' : ''}" 
                            data-id="${codec.id}" data-category="${cat}" ${isDone ? 'disabled' : ''}>
                            ${cat}
                        </button>
                    `).join('')}
                </div>
            `;
            codecContent.appendChild(container);
        });

        const phase2Card = new Card({
            title: "Codec Classification (Phase II)",
            content: codecContent,
            variant: 'glass'
        });

        grid.appendChild(phase1Card.render());
        grid.appendChild(phase2Card.render());

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render());
        this.container.appendChild(grid);

        this.attachEvents();
    },

    attachEvents() {
        const hwItems = this.container.querySelectorAll('.hw-item');
        const hwdTargets = this.container.querySelectorAll('.drop-target');

        hwItems.forEach(item => {
            item.ondragstart = (e) => {
                e.dataTransfer.setData('id', item.dataset.id);
                e.dataTransfer.setData('target', item.dataset.target);
                item.classList.add('opacity-50');
            };
            item.ondragend = () => item.classList.remove('opacity-50');
        });

        hwdTargets.forEach(target => {
            target.ondragover = (e) => e.preventDefault();
            target.ondrop = (e) => {
                const id = e.dataTransfer.getData('id');
                const tCode = e.dataTransfer.getData('target');
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

    handleHWDrop(id, tCode, target) {
        const item = this.hardware.find(h => h.id === id);
        const isMatch = tCode === target.dataset.target;

        this.results.push({
            id: id,
            question: `Hardware: ${item.name}`,
            selected: target.dataset.target,
            correct: item.target,
            isCorrect: isMatch
        });

        if (isMatch) {
            this.itemsResolved++;
            this.render();
        } else {
            target.classList.add('animate-shake', 'border-rose-500');
            setTimeout(() => target.classList.remove('animate-shake', 'border-rose-500'), 500);
        }

        this.checkFinish();
    },

    handleCodecClick(id, category, btn) {
        const codec = this.codecs.find(c => c.id === id);
        const isMatch = category === codec.category;

        this.results.push({
            id: id,
            question: `Codec: ${codec.name}`,
            selected: category,
            correct: codec.category,
            isCorrect: isMatch
        });

        if (isMatch) {
            this.itemsResolved++;
            this.render();
        } else {
            btn.classList.add('bg-rose-500', 'text-white', 'border-rose-400');
            setTimeout(() => btn.classList.remove('bg-rose-500', 'text-white', 'border-rose-400'), 500);
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
            score: this.itemsResolved * 500,
            xp: 3000,
            accuracy: Math.round((this.itemsResolved / this.results.length) * 100),
            detailedResults: this.results
        });
    }
};
