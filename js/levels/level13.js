/**
 * Level 13: Advanced Subnetting
 * Mechanic: Identify Network/Broadcast from CIDR.
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

        const header = new Card({
            title: this.game.getText('L13_TITLE'),
            subtitle: this.game.getText('L13_DESC'),
            variant: 'flat',
            customClass: 'text-center mb-8'
        });

        const infoFeedback = new Feedback({
            title: "Analysis Target",
            message: `Extract the subnet parameters for the host address: <span class="font-mono font-bold text-indigo-400">${scenario.ip}</span>`,
            type: "neutral"
        });

        const inputGroup = document.createElement('div');
        inputGroup.className = "space-y-6";
        inputGroup.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">${this.game.getText('L13_MASK_LBL')}</label>
                    <input type="text" id="ans-mask" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xl text-white font-mono focus:border-indigo-500 transition-colors placeholder:text-slate-800" placeholder="0.0.0.0">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">${this.game.getText('L13_NETID_LBL')}</label>
                    <input type="text" id="ans-netid" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xl text-white font-mono focus:border-indigo-500 transition-colors placeholder:text-slate-800" placeholder="0.0.0.0">
                </div>
            </div>
            <div>
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">${this.game.getText('L13_BC_LBL')}</label>
                <input type="text" id="ans-bc" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xl text-white font-mono focus:border-indigo-500 transition-colors placeholder:text-slate-800" placeholder="0.0.0.0">
            </div>
        `;

        const actionBtn = new GameButton({
            text: "Process Calculation",
            variant: 'primary',
            size: 'lg',
            icon: 'solar:calculator-minimalistic-bold',
            onClick: () => this.handleVerify()
        });

        const workspace = new Card({
            title: "CIDR Decoder Terminal",
            content: inputGroup,
            variant: 'glass',
            footer: actionBtn.render(),
            customClass: "max-w-2xl mx-auto"
        });

        const progress = document.createElement('div');
        progress.className = "flex justify-center gap-1 mt-8";
        this.scenarios.forEach((_, i) => {
            progress.innerHTML += `<div class="h-1 w-12 rounded-full ${i <= this.currentIndex ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}"></div>`;
        });

        this.container.appendChild(header.render());
        this.container.appendChild(infoFeedback.render());
        this.container.appendChild(workspace.render());
        this.container.appendChild(progress);
    },

    handleVerify() {
        const m = document.getElementById('ans-mask').value.trim();
        const n = document.getElementById('ans-netid').value.trim();
        const b = document.getElementById('ans-bc').value.trim();
        const s = this.scenarios[this.currentIndex];

        const isCorrect = (m === s.mask && n === s.netId && b === s.broadcast);

        this.results.push({
            question: `Subnet Analysis: ${s.ip}`,
            selected: `M:${m} N:${n} B:${b}`,
            correct: `M:${s.mask} N:${s.netId} B:${s.broadcast}`,
            isCorrect: isCorrect,
            explanation: isCorrect ? "Parameters validated." : "Mathematical inconsistency detected."
        });

        if (isCorrect) {
            this.currentIndex++;
            if (this.currentIndex < this.scenarios.length) {
                this.render();
            } else {
                this.finishLevel();
            }
        } else {
            const el = document.querySelector('.glass-panel');
            el.classList.add('animate-shake', 'border-rose-500');
            setTimeout(() => el.classList.remove('animate-shake', 'border-rose-500'), 500);
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
