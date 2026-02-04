/**
 * Level 3: Logic Gates
 * Mechanic: Digital Logic Circuits
 * Refactored using Component Architecture, Silent Feedback & Feedback Component
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;
        this.results = [];

        this.stages = [
            { id: 1, type: 'AND', inputs: [0, 0], target: 1, desc: 'Output 1 when ALL inputs are 1.' },
            { id: 2, type: 'OR', inputs: [0, 0], target: 1, desc: 'Output 1 when ANY input is 1.' },
            { id: 3, type: 'NAND', inputs: [1, 1], target: 0, desc: 'Output 0 only when ALL inputs are 1.' },
            { id: 4, type: 'XOR', inputs: [1, 1], target: 0, desc: 'Output 1 when inputs are DIFFERENT.' },
            { id: 5, type: 'COMBO', inputs: [0, 1, 0], target: 1, desc: '(A AND B) OR C' }
        ];

        this.stageInputs = this.stages.map(s => [...s.inputs]);

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const stage = this.stages[this.currentStage];
        const currentInputs = this.stageInputs[this.currentStage];
        const currentOutput = this.calculateOutput(stage.type, currentInputs);

        const header = new Card({
            title: `Circuit Board ${this.currentStage + 1}`,
            subtitle: `Logical Verification Required.`,
            variant: 'flat',
            customClass: 'text-center mb-6'
        });

        const objectiveFeedback = new Feedback({
            title: "Logic Goal",
            message: `${stage.desc} | Target Output Must Be: ${stage.target}`,
            type: "neutral"
        });

        const circuitArea = document.createElement('div');
        circuitArea.className = "relative w-full max-w-3xl mx-auto h-[400px] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-8 flex items-center justify-between overflow-hidden group";

        circuitArea.innerHTML = `
            <div class="absolute inset-0 opacity-10 circuit-board pointer-events-none"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-900/10 to-transparent pointer-events-none"></div>
        `;

        const inputsContainer = document.createElement('div');
        inputsContainer.className = "flex flex-col gap-8 items-center z-10";

        currentInputs.forEach((val, idx) => {
            const btn = document.createElement('button');
            btn.className = `w-16 h-16 rounded-full border-4 transition-all flex items-center justify-center text-2xl font-bold font-mono shadow-lg hover:scale-110 active:scale-95 z-20 ${val ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' : 'bg-slate-800 border-slate-600 text-slate-500 shadow-black/20'}`;
            btn.innerText = val;
            btn.onclick = () => {
                this.stageInputs[this.currentStage][idx] = val ? 0 : 1;
                this.render();
            };
            inputsContainer.appendChild(btn);
        });

        const gate = document.createElement('div');
        gate.className = "w-32 h-32 glass-panel rounded-xl border-2 border-indigo-500/50 flex flex-col items-center justify-center z-10 relative isolate";
        gate.innerHTML = `
            <div class="absolute -inset-4 bg-indigo-500/20 blur-xl -z-10 rounded-full"></div>
            <iconify-icon icon="solar:chip-bold" class="text-5xl text-indigo-400 mb-2"></iconify-icon>
            <span class="font-black text-white tracking-widest text-lg">${stage.type}</span>
        `;

        const outputNode = document.createElement('div');
        outputNode.className = `w-20 h-20 rounded-full border-4 transition-all flex items-center justify-center text-3xl font-bold font-mono shadow-2xl z-10 ${currentOutput ? 'bg-cyan-500 border-cyan-400 text-white shadow-cyan-500/40 animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-600'}`;
        outputNode.innerText = currentOutput;

        circuitArea.appendChild(inputsContainer);
        circuitArea.appendChild(gate);
        circuitArea.appendChild(outputNode);

        const card = new Card({
            content: circuitArea,
            variant: 'glass',
            footer: new GameButton({
                text: "Confirm Configuration",
                variant: 'primary',
                icon: "solar:bolt-bold",
                onClick: () => this.recordStage(stage.target, currentOutput)
            }).render()
        });

        this.container.appendChild(header.render());
        this.container.appendChild(objectiveFeedback.render());
        this.container.appendChild(card.render());
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

    recordStage(target, current) {
        const stage = this.stages[this.currentStage];
        const isSuccess = target === current;

        this.results.push({
            question: `Circuit ${stage.type}`,
            selected: `Output ${current}`,
            correct: `Output ${target}`,
            isCorrect: isSuccess
        });

        this.currentStage++;
        if (this.currentStage < this.stages.length) {
            this.render();
        } else {
            this.finishLevel();
        }
    },

    finishLevel() {
        const correctCount = this.results.filter(r => r.isCorrect).length;
        this.game.completeLevel({
            success: correctCount >= 3,
            score: correctCount * 300,
            xp: 1250,
            detailedResults: this.results
        });
    }
};
