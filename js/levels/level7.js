/**
 * Level 7: Cryptography
 * Mechanic: Caesar Cipher & Frequency Analysis
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
            {
                method: "Caesar Cipher",
                msg: "THE SECRET PASSWORD IS BLUEPRINT",
                shift: 3,
                hint: "Frequency Analysis: 'E' is the most common letter."
            },
            {
                method: "Caesar Cipher",
                msg: "ALWAYS ENCRYPT YOUR BACKUPS",
                shift: 7,
                hint: "Look for short words like 'THE' or 'AND'."
            },
            {
                method: "Vigenère (Simplified)",
                msg: "SECURITY IS NOT A PRODUCT BUT A PROCESS",
                shift: 13, 
                hint: "Classic Rotation 13."
            }
        ];

        this.userShift = 0;
        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const stage = this.stages[this.currentStage];
        const encrypted = this.encrypt(stage.msg, stage.shift);
        const decryptedView = this.decrypt(encrypted, this.userShift);

        const header = new Card({
            title: `Decryption Console ${this.currentStage + 1}`,
            subtitle: `Method: ${stage.method} | Crack the ciphertext.`,
            variant: 'flat',
            customClass: 'text-center mb-6'
        });

        const hintFeedback = new Feedback({
            title: "Intelligence Hint",
            message: stage.hint,
            type: "neutral"
        });

        const layout = document.createElement('div');
        layout.className = "flex flex-col lg:flex-row gap-6 h-full";

        // Analysis Tool
        const analysisContent = document.createElement('div');
        analysisContent.className = "flex flex-col gap-4";

        analysisContent.innerHTML = `
            <div class="p-4 bg-slate-900 rounded-lg border border-slate-700">
                <h4 class="text-xs font-bold text-slate-400 uppercase mb-2">Signal Intercept</h4>
                <p class="font-mono text-xl text-rose-400 break-all tracking-wider leading-relaxed">${encrypted}</p>
            </div>
        `;

        const toolCard = new Card({
            title: "Cryptanalysis Tools",
            content: analysisContent,
            variant: 'glass',
            customClass: 'w-full lg:w-1/3'
        });

        // Decryption Controls
        const controlContent = document.createElement('div');
        controlContent.className = "flex flex-col items-center justify-center gap-8 py-8";

        const dial = document.createElement('div');
        dial.className = "flex items-center gap-4";
        dial.innerHTML = `
            <button id="shift-down" class="p-4 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all active:scale-95">
                <iconify-icon icon="solar:minus-circle-bold" class="text-2xl text-slate-300"></iconify-icon>
            </button>
            <div class="w-24 h-24 rounded-full border-4 border-indigo-500/30 flex items-center justify-center bg-slate-900 shadow-inner relative">
                <div class="text-4xl font-mono font-bold text-indigo-400">${this.userShift}</div>
                <div class="absolute text-[8px] text-slate-500 bottom-4 uppercase tracking-widest">Shift</div>
            </div>
            <button id="shift-up" class="p-4 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all active:scale-95">
                <iconify-icon icon="solar:add-circle-bold" class="text-2xl text-slate-300"></iconify-icon>
            </button>
        `;

        const outputPrev = document.createElement('div');
        outputPrev.className = `w-full p-6 rounded-xl border-2 transition-all text-center bg-slate-950 border-indigo-500/30 text-slate-400`;
        outputPrev.innerHTML = `
            <div class="text-xs font-bold opacity-50 uppercase mb-2">Decrypted Message Output</div>
            <div class="text-xl md:text-2xl font-mono tracking-widest font-bold break-words">${decryptedView}</div>
        `;

        controlContent.appendChild(dial);
        controlContent.appendChild(outputPrev);

        const controlCard = new Card({
            title: "Decipher Output",
            content: controlContent,
            variant: 'glass',
            customClass: 'w-full lg:w-2/3',
            footer: new GameButton({
                text: "Confirm Decryption",
                variant: "primary",
                icon: "solar:lock-unlocked-bold",
                onClick: () => this.checkStage(decryptedView, stage.msg, outputPrev)
            }).render()
        });

        this.container.appendChild(header.render());
        this.container.appendChild(hintFeedback.render());
        layout.appendChild(toolCard.render());
        layout.appendChild(controlCard.render());
        this.container.appendChild(layout);

        document.getElementById('shift-down').onclick = () => {
            this.userShift = (this.userShift - 1 + 26) % 26;
            this.render();
        };
        document.getElementById('shift-up').onclick = () => {
            this.userShift = (this.userShift + 1) % 26;
            this.render();
        };
    },

    encrypt(text, shift) {
        return text.split('').map(char => {
            if (char.match(/[A-Z]/)) {
                const code = char.charCodeAt(0);
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }
            return char;
        }).join('');
    },

    decrypt(text, shift) {
        const offset = (26 - (shift % 26)) % 26;
        return this.encrypt(text, offset);
    },

    checkStage(current, target, visualContainer) {
        const isCorrect = current === target;

        if (isCorrect) {
            this.results.push({
                question: `Decrypt: Stage ${this.currentStage + 1}`,
                selected: "Decoded Successfully",
                correct: "Decoded Successfully",
                isCorrect: true
            });

            this.currentStage++;
            this.userShift = 0;
            if (this.currentStage < this.stages.length) {
                this.render();
            } else {
                this.finishLevel();
            }
        } else {
            visualContainer.classList.add('animate-shake', 'border-rose-500', 'text-rose-400');
            setTimeout(() => {
                visualContainer.classList.remove('animate-shake', 'border-rose-500', 'text-rose-400');
            }, 500);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 2200,
            xp: 2000,
            accuracy: 100,
            detailedResults: this.results
        });
    }
};
