/**
 * Level 13: Advanced Subnetting
 * Mechanic: Identify Network/Broadcast from CIDR.
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.currentIndex = 0;
        this.results = [];

        this.scenarios = [
            { ip: '192.168.1.10/24', mask: '255.255.255.0', netId: '192.168.1.0', broadcast: '192.168.1.255' },
            { ip: '172.16.50.40/26', mask: '255.255.255.192', netId: '172.16.50.0', broadcast: '172.16.50.63' },
            { ip: '10.0.0.12/29', mask: '255.255.255.248', netId: '10.0.0.8', broadcast: '10.0.0.15' },
            { ip: '192.168.5.100/30', mask: '255.255.255.252', netId: '192.168.5.100', broadcast: '192.168.5.103' },
            { ip: '172.30.0.1/16', mask: '255.255.0.0', netId: '172.30.0.0', broadcast: '172.30.255.255' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const scenario = this.scenarios[this.currentIndex];

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full items-center";

        const header = new Card({
            title: this.game.getText('L13_TITLE'),
            subtitle: this.game.getText('L13_DESC'),
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const infoFeedback = new Feedback({
            title: "CIDR Analysis Target",
            message: `Calculate parameters for: <span class="font-mono font-black text-indigo-400 text-lg sm:text-xl ml-2">${scenario.ip}</span>`,
            type: "neutral"
        });
        content.appendChild(infoFeedback.render());

        const inputGroup = document.createElement('div');
        inputGroup.className = "flex flex-col gap-6";
        inputGroup.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                    <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">${this.game.getText('L13_MASK_LBL')}</label>
                    <input type="text" id="ans-mask" class="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-lg sm:text-xl text-white font-mono focus:border-indigo-500 transition-all placeholder:text-slate-800 outline-none shadow-inner" placeholder="0.0.0.0">
                </div>
                <div class="space-y-1.5">
                    <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">${this.game.getText('L13_NETID_LBL')}</label>
                    <input type="text" id="ans-netid" class="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-lg sm:text-xl text-white font-mono focus:border-indigo-500 transition-all placeholder:text-slate-800 outline-none shadow-inner" placeholder="0.0.0.0">
                </div>
            </div>
            <div class="space-y-1.5">
                <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">${this.game.getText('L13_BC_LBL')}</label>
                <input type="text" id="ans-bc" class="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-lg sm:text-xl text-white font-mono focus:border-indigo-500 transition-all placeholder:text-slate-800 outline-none shadow-inner" placeholder="0.0.0.0">
            </div>
        `;

        const workspace = new Card({
            title: "Decipher Terminal",
            content: inputGroup,
            variant: 'glass',
            footer: new GameButton({
                text: "Validate Subnet",
                variant: 'primary',
                size: 'lg',
                icon: 'solar:calculator-minimalistic-bold',
                customClass: 'w-full',
                onClick: () => this.handleVerify()
            }).render(),
            customClass: "w-full max-w-2xl"
        });
        content.appendChild(workspace.render());

        const progress = document.createElement('div');
        progress.className = "flex justify-center gap-2 mt-4 w-full";
        this.scenarios.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `h-1 flex-1 max-w-[40px] rounded-full transition-all duration-300 ${i === this.currentIndex ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : (i < this.currentIndex ? 'bg-indigo-500/40' : 'bg-slate-800')}`;
            progress.appendChild(dot);
        });
        content.appendChild(progress);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());
    },

    handleVerify() {
        const m = document.getElementById('ans-mask').value.trim();
        const n = document.getElementById('ans-netid').value.trim();
        const b = document.getElementById('ans-bc').value.trim();
        const s = this.scenarios[this.currentIndex];

        const isCorrect = (m === s.mask && n === s.netId && b === s.broadcast);

        this.results.push({
            question: `CIDR: ${s.ip}`,
            selected: `M:${m} N:${n} B:${b}`,
            correct: `M:${s.mask} N:${s.netId} B:${s.broadcast}`,
            isCorrect: isCorrect,
            explanation: isCorrect ? "Parameters validated." : "Subnet calculation error."
        });

        if (isCorrect) {
            this.currentIndex++;
            if (this.currentIndex < this.scenarios.length) {
                this.render();
            } else {
                this.finishLevel();
            }
        } else {
            const el = this.container.querySelector('.glass-panel');
            if (el) {
                el.classList.add('animate-shake', 'border-rose-500');
                setTimeout(() => el.classList.remove('animate-shake', 'border-rose-500'), 500);
            }
        }
    },

    finishLevel() {
        const correctCount = this.results.filter(r => r.isCorrect).length;
        this.game.completeLevel({
            success: true,
            score: correctCount * 1000,
            xp: 2000,
            accuracy: 100,
            detailedResults: this.results
        });
    }
};

