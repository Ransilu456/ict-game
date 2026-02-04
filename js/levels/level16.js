/**
 * Level 16: The Legend's Trial
 * Mechanic: Final Boss Exam + "Neural Link" Cinematic UI.
 * Refactored using Component Architecture, QuestionCard & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import QuestionCard from '../components/QuestionCard.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.currentIndex = 0;
        this.integrity = 100;
        this.results = [];

        this.questions = [
            { q: this.game.getText('L16_Q1'), a: 'Network', opts: ['Data Link', 'Network', 'Transport', 'Session'], exp: 'Network Layer (3) handles path determination.' },
            { q: this.game.getText('L16_Q2'), a: 'def', opts: ['func', 'define', 'def', 'function'], exp: 'The "def" keyword is used to initialize functions.' },
            { q: this.game.getText('L16_Q3'), a: '10', opts: ['8', '10', '12', '15'], exp: '8 + 2 = 10.' },
            { q: this.game.getText('L16_Q4'), a: '443', opts: ['80', '443', '21', '22'], exp: 'Port 443 is for secure web traffic.' },
            { q: this.game.getText('L16_Q5'), a: 'Virtual Private Network', opts: ['Virtual Personal Node', 'Virtual Private Network', 'Verified Private Network', 'Visual Peripheral Network'], exp: 'Encrypted tunnel over a public network.' },
            { q: this.game.getText('L16_Q6'), a: '/26', opts: ['/24', '/25', '/26', '/28'], exp: '/26 provides 64 addresses.' },
            { q: this.game.getText('L16_Q7'), a: 'TLS', opts: ['UDP', 'TLS', 'ICMP', 'IGMP'], exp: 'Transport Layer Security.' },
            { q: this.game.getText('L16_Q8'), a: 'Gateway', opts: ['Hub', 'Switch', 'Gateway', 'Repeater'], exp: 'A gateway connects disparate networks.' },
            { q: this.game.getText('L16_Q9'), a: '3', opts: ['1', '2', '3', '4'], exp: 'A->B (1), B->C (2), C->D (3).' },
            { q: this.game.getText('L16_Q10'), a: 'Low Latency', opts: ['Cheap Storage', 'Durability', 'Low Latency', 'SQL compatibility'], exp: 'In-memory stores offer microsecond response times.' },
            { q: this.game.getText('L16_Q11'), a: '15', opts: ['14', '15', '16', '17'], exp: '8 + 4 + 2 + 1 = 15.' },
            { q: this.game.getText('L16_Q12'), a: 'WPA3', opts: ['WEP', 'WPA', 'WPA2', 'WPA3'], exp: 'WPA3 is the latest standard.' },
            { q: this.game.getText('L16_Q13'), a: '22', opts: ['21', '22', '23', '25'], exp: 'Secure Shell default port.' },
            { q: this.game.getText('L16_Q14'), a: '16', opts: ['4', '8', '16', '32'], exp: '2 to the power of 4 = 16.' },
            { q: this.game.getText('L16_Q15'), a: 'ARP', opts: ['DNS', 'BGP', 'ARP', 'DHCP'], exp: 'Address Resolution Protocol.' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const qData = this.questions[this.currentIndex];

        const header = new Card({
            title: this.game.getText('L16_TITLE'),
            subtitle: this.game.getText('L16_HUD_OVERRIDE'),
            variant: 'flat',
            customClass: 'text-center mb-12'
        });

        const hudContainer = document.createElement('div');
        hudContainer.className = "max-w-4xl mx-auto flex flex-col gap-8";

        const integrityBar = document.createElement('div');
        integrityBar.className = "flex flex-col gap-2 px-8";
        integrityBar.innerHTML = `
            <div class="flex justify-between items-center">
                 <span class="text-[10px] font-black text-rose-500 uppercase tracking-widest">${this.game.getText('L16_HUD_INTEGRITY')}</span>
                 <span class="text-[10px] font-black text-rose-400 font-mono">${this.integrity}%</span>
            </div>
            <div class="h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div class="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-700" style="width: ${this.integrity}%"></div>
            </div>
        `;

        const qCard = new QuestionCard({
            question: qData.q,
            options: qData.opts.map((o, i) => ({ id: o, text: o })),
            onSelect: (id) => this.handleAnswer(id)
        });

        hudContainer.appendChild(integrityBar);
        hudContainer.innerHTML += qCard.render();

        const ticker = document.createElement('div');
        ticker.className = "flex justify-center gap-1 mt-8 opacity-50";
        this.questions.forEach((_, i) => {
            ticker.innerHTML += `<div class="h-1 w-6 rounded-full ${i <= this.currentIndex ? 'bg-indigo-500' : 'bg-slate-800'}"></div>`;
        });
        hudContainer.appendChild(ticker);

        this.container.appendChild(header.render());
        this.container.appendChild(hudContainer);

        qCard.attach(this.container);
    },

    handleAnswer(id) {
        const qData = this.questions[this.currentIndex];
        const isCorrect = id === qData.a;

        this.results.push({
            question: qData.q,
            selected: id,
            correct: qData.a,
            isCorrect: isCorrect,
            explanation: qData.exp
        });

        if (!isCorrect) {
            this.integrity = Math.max(0, this.integrity - 10);
            this.triggerGlitch();
        }

        this.currentIndex++;
        if (this.currentIndex < this.questions.length && this.integrity > 0) {
            setTimeout(() => this.render(), 600);
        } else {
            setTimeout(() => this.finishLevel(), 1200);
        }
    },

    triggerGlitch() {
        this.container.classList.add('animate-shake', 'animate-glitch-cinematic');
        setTimeout(() => this.container.classList.remove('animate-shake', 'animate-glitch-cinematic'), 800);
    },

    finishLevel() {
        const success = this.integrity > 0 && this.results.filter(r => r.isCorrect).length >= 10;
        this.game.completeLevel({
            success: success,
            score: this.results.filter(r => r.isCorrect).length * 1000,
            xp: success ? 5000 : 500,
            accuracy: this.integrity,
            detailedResults: this.results
        });
    }
};
