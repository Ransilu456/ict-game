import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';
import AnswerCard from '../components/AnswerCard.js';

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

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full max-w-2xl mx-auto";

        const header = new Card({
            title: this.game.getText('L12_TITLE'),
            subtitle: this.game.getText('L12_DESC'),
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const objectiveFeedback = new Feedback({
            title: "Neural Objective",
            message: "Distinguish valid data signals from background noise to calibrate the model.",
            type: "neutral"
        });
        content.appendChild(objectiveFeedback.render());

        const dataDisplay = document.createElement('div');
        dataDisplay.className = "p-6 sm:p-10 bg-slate-950/80 rounded-[2rem] border border-indigo-500/20 text-indigo-400 text-center shadow-2xl relative overflow-hidden group";
        dataDisplay.innerHTML = `
            <div class="absolute inset-0 bg-indigo-500/5 animate-pulse opacity-50"></div>
            <div class="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 opacity-60">Incoming Fragment</div>
            <div class="text-xl sm:text-3xl font-mono font-black tracking-widest break-words z-10 relative drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                ${currentData.data}
            </div>
        `;
        content.appendChild(dataDisplay);

        const optionsGrid = document.createElement('div');
        optionsGrid.className = "grid grid-cols-2 gap-4 sm:gap-6";

        const opts = [
            { id: 'signal', text: this.game.getText('L12_SIGNAL'), icon: 'solar:check-circle-bold', color: 'emerald' },
            { id: 'noise', text: this.game.getText('L12_NOISE'), icon: 'solar:close-circle-bold', color: 'rose' }
        ];

        opts.forEach(opt => {
            const answerCard = new AnswerCard({
                id: opt.id,
                text: opt.text,
                icon: opt.icon,
                onClick: (id) => this.handleClassification(id)
            });
            optionsGrid.appendChild(answerCard.render());
        });
        content.appendChild(optionsGrid);

        const progressContainer = document.createElement('div');
        progressContainer.className = "w-full max-w-sm mx-auto mt-4";
        const progress = ((this.currentIndex + 1) / this.dataset.length) * 100;
        progressContainer.innerHTML = `
            <div class="flex justify-between items-center mb-2 px-1">
                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Model Stability</span>
                <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">${this.currentIndex + 1} / ${this.dataset.length}</span>
            </div>
            <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style="width: ${progress}%"></div>
            </div>
        `;
        content.appendChild(progressContainer);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());
    },

    handleClassification(type) {
        const item = this.dataset[this.currentIndex];
        const isCorrect = type === item.type;

        this.results.push({
            question: item.data,
            selected: type.toUpperCase(),
            correct: item.type.toUpperCase(),
            isCorrect: isCorrect,
            explanation: item.desc
        });

        this.currentIndex++;
        if (this.currentIndex < this.dataset.length) {
            setTimeout(() => this.render(), 300);
        } else {
            setTimeout(() => this.finishLevel(), 600);
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

