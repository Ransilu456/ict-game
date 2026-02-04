/**
 * Level 12: Neural Training (AI)
 * Mechanic: Classify Signal vs Noise.
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import QuestionCard from '../components/QuestionCard.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentIndex = 0;
        this.results = [];

        this.dataset = [
            { id: 1, data: 'Pattern Detected: 0xAF32', type: 'signal', desc: 'Consistent hexadecimal cluster.' },
            { id: 2, data: 'Static Interruption: RRRR', type: 'noise', desc: 'Random character repeat.' },
            { id: 3, data: 'Neural Sync: Stable', type: 'signal', desc: 'Subsystem synchronization.' },
            { id: 4, data: 'Binary Cluster: Alpha', type: 'signal', desc: 'High-density bitstream.' },
            { id: 5, data: 'Background Radiation', type: 'noise', desc: 'Thermal interference.' },
            { id: 6, data: 'Corrupted Packet: NULL', type: 'noise', desc: 'Data packet loss.' },
            { id: 7, data: 'Data Stream: Consistent', type: 'signal', desc: 'Predictable IO patterns.' },
            { id: 8, data: 'Unidentified Fragment', type: 'noise', desc: 'Non-matching signature.' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const currentData = this.dataset[this.currentIndex];

        const header = new Card({
            title: this.game.getText('L12_TITLE'),
            subtitle: this.game.getText('L12_DESC'),
            variant: 'flat',
            customClass: 'text-center mb-8'
        });

        const objectiveFeedback = new Feedback({
            title: "Neural Objective",
            message: "Distinguish valid data signals from background electromagnetic noise to calibrate the AI model.",
            type: "neutral"
        });

        const options = [
            { id: 'signal', text: `<div class="flex items-center gap-3"><iconify-icon icon="solar:check-circle-bold" class="text-xl text-emerald-400"></iconify-icon> ${this.game.getText('L12_SIGNAL')}</div>` },
            { id: 'noise', text: `<div class="flex items-center gap-3"><iconify-icon icon="solar:close-circle-bold" class="text-xl text-rose-400"></iconify-icon> ${this.game.getText('L12_NOISE')}</div>` }
        ];

        const qCard = new QuestionCard({
            question: `<div class="font-mono text-center p-6 bg-slate-950 rounded-2xl border border-indigo-500/20 text-indigo-400 animate-pulse tracking-widest">${currentData.data}</div>`,
            options: options,
            onSelect: (id) => this.handleClassification(id)
        });

        const progressContainer = document.createElement('div');
        progressContainer.className = "w-full max-w-sm mx-auto mt-8";
        progressContainer.innerHTML = `
            <div class="flex justify-between items-center mb-2 px-1">
                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Calibration Progress</span>
                <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">${this.currentIndex + 1} / ${this.dataset.length}</span>
            </div>
            <div class="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-500 transition-all duration-500" style="width: ${((this.currentIndex + 1) / this.dataset.length) * 100}%"></div>
            </div>
        `;

        this.container.appendChild(header.render());
        this.container.appendChild(objectiveFeedback.render());
        this.container.innerHTML += qCard.render();
        this.container.appendChild(progressContainer);

        qCard.attach(this.container);
    },

    handleClassification(type) {
        const item = this.dataset[this.currentIndex];
        const isCorrect = type === item.type;

        this.results.push({
            question: `Data Point: ${item.data}`,
            selected: type.toUpperCase(),
            correct: item.type.toUpperCase(),
            isCorrect: isCorrect,
            explanation: item.desc
        });

        this.currentIndex++;
        if (this.currentIndex < this.dataset.length) {
            setTimeout(() => this.render(), 400);
        } else {
            setTimeout(() => this.finishLevel(), 800);
        }
    },

    finishLevel() {
        const correctCount = this.results.filter(r => r.isCorrect).length;
        this.game.completeLevel({
            success: correctCount >= 6,
            score: correctCount * 400,
            xp: 2500,
            accuracy: Math.round((correctCount / this.dataset.length) * 100),
            detailedResults: this.results
        });
    }
};
