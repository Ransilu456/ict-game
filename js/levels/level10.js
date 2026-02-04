/**
 * Level 10: Cyber Security (Firewall)
 * Mechanic: Filter incoming packets (Allow/Drop) based on a policy.
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';

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

        const header = new Card({
            title: this.game.getText('L10_TITLE'),
            subtitle: this.game.getText('L10_DESC'),
            variant: 'flat',
            customClass: 'text-center mb-8'
        });

        const statusFeedback = new Feedback({
            title: "Security Directive",
            message: "Analyze the incoming traffic stream and apply filtering based on the whitelist protocol.",
            type: "neutral"
        });

        const layout = document.createElement('div');
        layout.className = "grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto";

        // Rules Panel
        const rulesContent = document.createElement('div');
        rulesContent.className = "space-y-4 font-mono text-xs";
        rulesContent.innerHTML = `
            <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-slate-500">HTTP/HTTPS (80/443)</span>
                <span class="text-emerald-500 font-bold">ALLOW</span>
            </div>
            <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-slate-500">DNS (53) / NTP (123)</span>
                <span class="text-emerald-500 font-bold">ALLOW</span>
            </div>
            <div class="flex justify-between border-b border-slate-800 pb-2">
                <span class="text-slate-500">SSH (22) / DB (3306)</span>
                <span class="text-rose-500 font-bold">DROP</span>
            </div>
            <div class="flex justify-between">
                <span class="text-slate-500">MALWARE / TELNET</span>
                <span class="text-rose-500 font-bold">DROP</span>
            </div>
        `;

        const rulesCard = new Card({
            title: this.game.getText('L10_POLICY_HEADER'),
            content: rulesContent,
            variant: 'glass'
        });

        // Packet Display
        const packetContent = document.createElement('div');
        packetContent.className = "space-y-6";
        packetContent.innerHTML = `
            <div class="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-indigo-500/20">
                <div>
                   <div class="text-[9px] uppercase font-bold text-slate-500">Source Port</div>
                   <div class="text-3xl font-black text-white font-mono">${packet.port}</div>
                </div>
                <div class="text-right">
                   <div class="text-[9px] uppercase font-bold text-slate-500">Protocol</div>
                   <div class="text-xl font-bold text-indigo-400 font-mono">${packet.protocol}</div>
                </div>
            </div>
            <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                 <div class="text-[9px] uppercase font-bold text-slate-500 mb-1">Payload Analysis</div>
                 <div class="text-sm text-slate-300 font-mono italic">${packet.payload}</div>
            </div>
            <div class="flex gap-1">
                ${Array(this.packets.length).fill(0).map((_, i) => `
                    <div class="h-1 flex-1 rounded-full ${i <= this.currentPacketIndex ? 'bg-indigo-500' : 'bg-slate-800'}"></div>
                `).join('')}
            </div>
        `;

        const packetCard = new Card({
            title: "Live Stream Audit",
            content: packetContent,
            variant: 'glass'
        });

        layout.appendChild(rulesCard.render());
        layout.appendChild(packetCard.render());

        const controls = document.createElement('div');
        controls.className = "flex justify-center gap-6";

        const allowBtn = new GameButton({
            text: this.game.getText('L10_ALLOW'),
            variant: 'primary',
            icon: 'solar:shield-check-bold',
            onClick: () => this.handleAction('ALLOW')
        });

        const dropBtn = new GameButton({
            text: this.game.getText('L10_DROP'),
            variant: 'secondary',
            icon: 'solar:shield-cross-bold',
            onClick: () => this.handleAction('DROP')
        });

        controls.appendChild(allowBtn.render());
        controls.appendChild(dropBtn.render());

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render());
        this.container.appendChild(layout);
        this.container.appendChild(controls);
    },

    handleAction(action) {
        const packet = this.packets[this.currentPacketIndex];
        const isCorrect = action === packet.action;

        this.results.push({
            question: `Packet ${packet.protocol} (Port ${packet.port})`,
            selected: action,
            correct: packet.action,
            isCorrect: isCorrect,
            explanation: isCorrect ? "Security policy maintained." : "Unauthorized traffic allowed or legitimate traffic dropped."
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
