/**
 * Level 2: Binary & Hex
 * Mechanic: Bit Manipulation & Base Conversion
 * Refactored using Component Architecture, Silent Feedback & Feedback Component
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.currentStage = 0;
        this.results = [];

        // Define Stages
        this.stages = [
            { id: 'b1', type: 'binary', bits: 8, target: Math.floor(Math.random() * 255), label: "8-Bit Integer" },
            { id: 'b2', type: 'binary', bits: 8, target: Math.floor(Math.random() * 255), label: "8-Bit Integer" },
            { id: 'b3', type: 'binary', bits: 12, target: Math.floor(Math.random() * 4095), label: "12-Bit Address" },
            { id: 'h1', type: 'hex', targetHex: this.generateRandomHex(), label: "Hex Decode" }
        ];

        this.currentBits = Array(12).fill(0);
        this.render();
    },

    generateRandomHex() {
        const val = Math.floor(Math.random() * 255);
        return { val: val, str: val.toString(16).toUpperCase() };
    },

    render() {
        this.container.innerHTML = '';
        const stage = this.stages[this.currentStage];

        let headerTitle = "Binary Systems";
        let subTitle = `Precision Conversion Mode Active.`;

        if (stage.type === 'hex') {
            headerTitle = "Hexadecimal Systems";
        }

        const header = new Card({
            title: headerTitle,
            subtitle: subTitle,
            variant: 'flat',
            customClass: 'text-center mb-6'
        });

        const goalFeedback = new Feedback({
            title: "Encryption Goal",
            message: stage.type === 'hex'
                ? `Convert Hex value "${stage.targetHex.str}" to its binary representation.`
                : `Represent the Decimal integer ${stage.target} using the active bit switches.`,
            type: "neutral"
        });

        const interfaceContainer = document.createElement('div');
        interfaceContainer.className = "flex flex-col items-center gap-8";

        // Bit Grid
        const bitValues = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
        const activeBitValues = stage.type === 'hex' ? bitValues.slice(-8) : bitValues.slice(-stage.bits);
        const offset = 12 - activeBitValues.length;

        const bitsRow = document.createElement('div');
        bitsRow.className = "flex flex-wrap justify-center gap-2 md:gap-4 max-w-4xl";

        activeBitValues.forEach((val, idx) => {
            const realIdx = idx + offset;
            const bitState = this.currentBits[realIdx];

            const bitBtn = document.createElement('button');
            bitBtn.className = `flex flex-col items-center justify-between w-12 h-24 md:w-16 md:h-32 rounded-lg border-2 transition-all p-2 ${bitState
                ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 border-slate-700 hover:border-indigo-500'
                }`;

            bitBtn.innerHTML = `
                <span class="text-[10px] md:text-xs font-mono text-slate-500">${val}</span>
                <span class="text-3xl md:text-5xl font-mono font-bold ${bitState ? 'text-emerald-400' : 'text-slate-700'}">${bitState}</span>
                <div class="w-full h-1 rounded bg-slate-800 overflow-hidden">
                    <div class="h-full w-full bg-emerald-500 transition-transform duration-300 ${bitState ? 'translate-x-0' : '-translate-x-full'}"></div>
                </div>
            `;

            bitBtn.onclick = () => {
                this.currentBits[realIdx] = bitState ? 0 : 1;
                this.render();
            };

            bitsRow.appendChild(bitBtn);
        });

        interfaceContainer.appendChild(new Card({ content: bitsRow, variant: 'glass' }).render());

        // Value Display & Action
        const currentValue = this.calculateCurrentValue(activeBitValues, offset);
        const targetValue = stage.type === 'hex' ? stage.targetHex.val : stage.target;

        const infoBar = document.createElement('div');
        infoBar.className = "flex items-center gap-6";
        infoBar.innerHTML = `
            <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-widest">Current</div>
                <div class="text-4xl font-mono font-bold text-slate-200">${currentValue}</div>
            </div>
            <div class="h-12 w-px bg-slate-700"></div>
            <div class="text-left">
                <div class="text-xs text-slate-400 uppercase tracking-widest">Target</div>
                <div class="text-4xl font-mono font-bold text-indigo-400">${targetValue}</div>
            </div>
        `;

        interfaceContainer.appendChild(infoBar);

        const actionBtn = new GameButton({
            text: "Execute Conversion",
            variant: 'primary',
            size: 'lg',
            icon: 'solar:cpu-bolt-bold',
            onClick: () => this.checkStage(currentValue, targetValue, interfaceContainer)
        });

        interfaceContainer.appendChild(actionBtn.render());

        this.container.appendChild(header.render());
        this.container.appendChild(goalFeedback.render());
        this.container.appendChild(interfaceContainer);
    },

    calculateCurrentValue(bitVals, offset) {
        return bitVals.reduce((acc, val, i) => {
            return acc + (this.currentBits[i + offset] * val);
        }, 0);
    },

    checkStage(current, target, container) {
        const isMatch = current === target;

        if (isMatch) {
            this.results.push({
                question: this.stages[this.currentStage].label,
                selected: current,
                correct: target,
                isCorrect: true
            });

            this.currentStage++;
            this.currentBits = Array(12).fill(0);

            if (this.currentStage < this.stages.length) {
                this.render();
            } else {
                this.finishLevel();
            }
        } else {
            container.classList.add('animate-shake');
            setTimeout(() => container.classList.remove('animate-shake'), 500);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 1800,
            xp: 600,
            accuracy: 100,
            detailedResults: this.results
        });
    }
};
