/**
 * Level 7: Cryptography
 * Mechanic: Caesar Cipher & Frequency Analysis
 * Refactored using Component Architecture, Silent Feedback & Feedback Component
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

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

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full items-center";

        const header = new Card({
            title: `Decryption Console ${this.currentStage + 1}`,
            subtitle: `Stage ${this.currentStage + 1} of ${this.stages.length}`,
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const hintFeedback = new Feedback({
            title: "Analysis Hint",
            message: stage.hint,
            type: "neutral"
        });
        content.appendChild(hintFeedback.render());

        const layout = document.createElement('div');
        // Mobile-first: column, Desktop: Row with specific widths
        layout.className = "flex flex-col lg:flex-row gap-6 w-full";

        // Intercept Display
        const signalContent = document.createElement('div');
        signalContent.className = "p-4 sm:p-6 bg-slate-950/50 rounded-2xl border border-slate-800 shadow-inner";
        signalContent.innerHTML = `
            <div class="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3 opacity-60">Intercepted Signal</div>
            <p class="font-mono text-base sm:text-xl text-rose-400 break-words tracking-widest leading-relaxed">${encrypted}</p>
        `;

        const toolCard = new Card({
            title: "Signal Source",
            content: signalContent,
            variant: 'glass',
            customClass: 'flex-1 min-w-0'
        });

        // Decryption Controls
        const controlContent = document.createElement('div');
        controlContent.className = "flex flex-col items-center gap-8 py-4";

        const dial = document.createElement('div');
        dial.className = "flex items-center gap-4 sm:gap-8";
        dial.innerHTML = `
            <button id="shift-down" class="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all active:scale-90 shadow-lg">
                <iconify-icon icon="solar:minus-circle-bold" class="text-2xl text-slate-300"></iconify-icon>
            </button>
            <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-500/30 flex flex-col items-center justify-center bg-slate-900 shadow-inner relative group bg-gradient-to-b from-slate-800 to-slate-900">
                <div class="absolute inset-0 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-all"></div>
                <div class="text-4xl sm:text-5xl font-mono font-black text-indigo-400 z-10 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">${this.userShift}</div>
                <div class="text-[8px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest z-10 mt-1">Shift</div>
            </div>
            <button id="shift-up" class="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all active:scale-90 shadow-lg">
                <iconify-icon icon="solar:add-circle-bold" class="text-2xl text-slate-300"></iconify-icon>
            </button>
        `;

        const outputPrev = document.createElement('div');
        outputPrev.className = `w-full p-6 rounded-2xl border-2 transition-all text-center bg-slate-950/80 border-indigo-500/20 text-slate-400 shadow-2xl`;
        outputPrev.innerHTML = `
            <div class="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-3 opacity-60">Real-time Decryption</div>
            <div class="text-lg sm:text-2xl font-mono tracking-[0.2em] font-black break-words text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                ${decryptedView}
            </div>
        `;

        controlContent.appendChild(dial);
        controlContent.appendChild(outputPrev);

        const controlCard = new Card({
            title: "Decipher Output",
            content: controlContent,
            variant: 'glass',
            customClass: 'flex-[1.5] min-w-0',
            footer: new GameButton({
                text: "Confirm Decryption",
                variant: "primary",
                size: 'lg',
                icon: "solar:lock-unlocked-bold",
                customClass: 'w-full',
                onClick: () => this.checkStage(decryptedView, stage.msg, outputPrev)
            }).render()
        });

        layout.appendChild(toolCard.render());
        layout.appendChild(controlCard.render());
        content.appendChild(layout);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());

        // Event Listeners
        const downBtn = this.container.querySelector('#shift-down');
        const upBtn = this.container.querySelector('#shift-up');

        if (downBtn) downBtn.onclick = () => {
            this.userShift = (this.userShift - 1 + 26) % 26;
            this.render();
        };
        if (upBtn) upBtn.onclick = () => {
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
                question: `Signal Decryption`,
                selected: current,
                correct: target,
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
            visualContainer.classList.add('animate-shake', 'border-rose-500');
            setTimeout(() => visualContainer.classList.remove('animate-shake', 'border-rose-500'), 500);
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

