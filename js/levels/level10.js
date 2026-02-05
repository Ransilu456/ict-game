import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentPacketIndex = 0;
        this.results = [];

        this.packets = [
            { port: 80, protocol: 'HTTP', payload: this.game.getText('L10_PKT_HTTP'), action: 'ALLOW' },
            { port: 22, protocol: 'SSH', payload: this.game.getText('L10_PKT_SSH'), action: 'DROP' },
            { port: 443, protocol: 'HTTPS', payload: this.game.getText('L10_PKT_HTTPS'), action: 'ALLOW' },
            { port: 3306, protocol: 'MySQL', payload: this.game.getText('L10_PKT_MYSQL'), action: 'DROP' },
            { port: 53, protocol: 'DNS', payload: this.game.getText('L10_PKT_DNS'), action: 'ALLOW' },
            { port: 666, protocol: 'TROJAN', payload: this.game.getText('L10_PKT_TROJAN'), action: 'DROP' },
            { port: 8080, protocol: 'PROXY', payload: this.game.getText('L10_PKT_PROXY'), action: 'ALLOW' },
            { port: 23, protocol: 'TELNET', payload: this.game.getText('L10_PKT_TELNET'), action: 'DROP' },
            { port: 445, protocol: 'SMB', payload: this.game.getText('L10_PKT_SMB'), action: 'DROP' },
            { port: 123, protocol: 'NTP', payload: this.game.getText('L10_PKT_NTP'), action: 'ALLOW' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const packet = this.packets[this.currentPacketIndex];

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full";

        const header = new Card({
            title: this.game.getText('L10_TITLE'),
            subtitle: this.game.getText('L10_DESC'),
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const statusFeedback = new Feedback({
            title: "Security Directive",
            message: "Analyze the incoming traffic stream and apply filtering based on the policy.",
            type: "neutral"
        });
        content.appendChild(statusFeedback.render());

        const layout = document.createElement('div');
        layout.className = "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full";

        // Rules Panel
        const rulesContent = document.createElement('div');
        rulesContent.className = "space-y-3 sm:space-y-4 font-mono text-[10px] sm:text-xs";
        rulesContent.innerHTML = `
            <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-slate-500 uppercase">Web (80, 443)</span>
                <span class="text-emerald-500 font-black">ALLOW</span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-slate-500 uppercase">DNS (53) / NTP (123)</span>
                <span class="text-emerald-500 font-black">ALLOW</span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-slate-500 uppercase">SSH (22) / DB (3306)</span>
                <span class="text-rose-500 font-black">DROP</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500 uppercase">Unrecognized / Legacy</span>
                <span class="text-rose-500 font-black">DROP</span>
            </div>
        `;

        const rulesCard = new Card({
            title: "Active Firewall Policy",
            content: rulesContent,
            variant: 'glass'
        });

        // Packet Display
        const packetContent = document.createElement('div');
        packetContent.className = "space-y-4 sm:space-y-6";
        packetContent.innerHTML = `
            <div class="flex justify-between items-center bg-slate-950/80 p-4 sm:p-6 rounded-2xl border border-indigo-500/20 shadow-inner">
                <div class="flex flex-col">
                   <div class="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1">Source Port</div>
                   <div class="text-2xl sm:text-4xl font-black text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">${packet.port}</div>
                </div>
                <div class="flex flex-col items-end">
                   <div class="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1">Protocol</div>
                   <div class="text-lg sm:text-2xl font-black text-indigo-400 font-mono">${packet.protocol}</div>
                </div>
            </div>
            <div class="p-4 sm:p-6 bg-slate-900 border border-white/5 rounded-2xl">
                 <div class="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-2">Payload Fragment</div>
                 <div class="text-xs sm:text-sm text-slate-300 font-mono italic leading-relaxed break-words">${packet.payload}</div>
            </div>
        `;

        const packetCard = new Card({
            title: `Packet Data (${this.currentPacketIndex + 1}/${this.packets.length})`,
            content: packetContent,
            variant: 'glass'
        });

        layout.appendChild(rulesCard.render());
        layout.appendChild(packetCard.render());
        content.appendChild(layout);

        const progressContainer = document.createElement('div');
        progressContainer.className = "flex gap-1.5 sm:gap-2 px-2";
        this.packets.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `h-1 sm:h-1.5 flex-1 rounded-full transition-all duration-300 ${i === this.currentPacketIndex ? 'bg-indigo-500 scale-y-125' : (i < this.currentPacketIndex ? 'bg-indigo-500/40' : 'bg-slate-800')}`;
            progressContainer.appendChild(dot);
        });
        content.appendChild(progressContainer);

        const controls = document.createElement('div');
        controls.className = "grid grid-cols-2 gap-4 sm:gap-6 pt-4";

        const allowBtn = new GameButton({
            text: "Allow",
            variant: 'primary',
            size: 'lg',
            icon: 'solar:shield-check-bold',
            customClass: 'w-full py-4 sm:py-6',
            onClick: () => this.handleAction('ALLOW')
        });

        const dropBtn = new GameButton({
            text: "Drop",
            variant: 'secondary',
            size: 'lg',
            icon: 'solar:shield-cross-bold',
            customClass: 'w-full py-4 sm:py-6 bg-slate-800/50',
            onClick: () => this.handleAction('DROP')
        });

        controls.appendChild(allowBtn.render());
        controls.appendChild(dropBtn.render());
        content.appendChild(controls);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());
    },

    handleAction(action) {
        const packet = this.packets[this.currentPacketIndex];
        const isCorrect = action === packet.action;

        this.results.push({
            question: `Filter ${packet.protocol}`,
            selected: action,
            correct: packet.action,
            isCorrect: isCorrect,
            explanation: isCorrect ? "Security policy maintained." : "Firewall bypass detected."
        });

        this.currentPacketIndex++;
        if (this.currentPacketIndex < this.packets.length) {
            this.render();
        } else {
            this.finishLevel();
        }
    },

    finishLevel() {
        const correctCount = this.results.filter(r => r.isCorrect).length;
        this.game.completeLevel({
            success: correctCount >= 7,
            score: correctCount * 300,
            xp: 2000,
            accuracy: Math.round((correctCount / this.packets.length) * 100),
            detailedResults: this.results
        });
    }
};

