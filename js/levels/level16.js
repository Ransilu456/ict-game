import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';
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
            { q: this.game.getText('L16_Q1'), a: 'Network', opts: ['Data Link', 'Network', 'Transport', 'Session'], exp: 'Level 3 determines packet routing.' },
            { q: this.game.getText('L16_Q2'), a: 'def', opts: ['func', 'define', 'def', 'function'], exp: 'Python uses "def" for function declarations.' },
            { q: this.game.getText('L16_Q3'), a: '10', opts: ['8', '10', '12', '15'], exp: '8 + 2 = 10.' },
            { q: this.game.getText('L16_Q4'), a: '443', opts: ['80', '443', '21', '22'], exp: 'Secure TLS/SSL traffic.' },
            { q: this.game.getText('L16_Q5'), a: 'Virtual Private Network', opts: ['Virtual Personal Node', 'Virtual Private Network', 'Verified Private Network', 'Visual Peripheral Network'], exp: 'VPN' },
            { q: this.game.getText('L16_Q6'), a: '/26', opts: ['/24', '/25', '/26', '/28'], exp: 'subnet mask' },
            { q: this.game.getText('L16_Q7'), a: 'TLS', opts: ['UDP', 'TLS', 'ICMP', 'IGMP'], exp: 'Security' },
            { q: this.game.getText('L16_Q8'), a: 'Gateway', opts: ['Hub', 'Switch', 'Gateway', 'Repeater'], exp: 'Exit Node' },
            { q: this.game.getText('L16_Q9'), a: '3', opts: ['1', '2', '3', '4'], exp: 'Hops' },
            { q: this.game.getText('L16_Q10'), a: 'Low Latency', opts: ['Cheap Storage', 'Durability', 'Low Latency', 'SQL compatibility'], exp: 'Performance' },
            { q: this.game.getText('L16_Q11'), a: '15', opts: ['14', '15', '16', '17'], exp: 'Binary' },
            { q: this.game.getText('L16_Q12'), a: 'WPA3', opts: ['WEP', 'WPA', 'WPA2', 'WPA3'], exp: 'Wireless' },
            { q: this.game.getText('L16_Q13'), a: '22', opts: ['21', '22', '23', '25'], exp: 'SSH' },
            { q: this.game.getText('L16_Q14'), a: '16', opts: ['4', '8', '16', '32'], exp: 'Arithmetic' },
            { q: this.game.getText('L16_Q15'), a: 'ARP', opts: ['DNS', 'BGP', 'ARP', 'DHCP'], exp: 'MAC resolution' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const qData = this.questions[this.currentIndex];

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full max-w-3xl mx-auto";

        const header = new Card({
            title: this.game.getText('L16_TITLE'),
            subtitle: "Final System Validation Level",
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const integritySection = document.createElement('div');
        integritySection.className = "px-4 space-y-2";
        integritySection.innerHTML = `
            <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
                <span class="text-rose-500">Neural Integrity</span>
                <span class="text-white font-mono">${this.integrity}%</span>
            </div>
            <div class="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div class="h-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all duration-700" style="width: ${this.integrity}%"></div>
            </div>
        `;
        content.appendChild(integritySection);

        const qCard = new QuestionCard({
            question: `<div class="text-center font-bold text-lg sm:text-xl text-white leading-relaxed">${qData.q}</div>`,
            options: qData.opts.map(o => ({ id: o, text: o })),
            onSelect: (id) => this.handleAnswer(id)
        });
        content.insertAdjacentHTML('beforeend', qCard.render());

        const progressTicks = document.createElement('div');
        progressTicks.className = "flex justify-center gap-1.5 mt-4 opacity-40";
        this.questions.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `h-1 w-2 sm:w-4 rounded-full transition-all duration-300 ${i === this.currentIndex ? 'bg-indigo-500 w-6' : (i < this.currentIndex ? 'bg-indigo-500/50' : 'bg-slate-800')}`;
            progressTicks.appendChild(dot);
        });
        content.appendChild(progressTicks);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());

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
            setTimeout(() => this.render(), 400);
        } else {
            setTimeout(() => this.finishLevel(), 800);
        }
    },

    triggerGlitch() {
        const el = this.container.querySelector('.max-w-3xl');
        if (el) {
            el.classList.add('animate-shake', 'opacity-80');
            setTimeout(() => el.classList.remove('animate-shake', 'opacity-80'), 500);
        }
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

