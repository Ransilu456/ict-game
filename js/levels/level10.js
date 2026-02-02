/**
 * Level 10: Cyber Security (Firewall)
 * Mechanic: Filter incoming packets (Allow/Drop) based on a policy.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.currentPacketIndex = 0;
        this.totalPackets = 10;

        this.packets = [
            { port: 80, protocol: 'HTTP', payload: 'Web Request', action: 'ALLOW' },
            { port: 22, protocol: 'SSH', payload: 'Remote Login', action: 'DROP' },
            { port: 443, protocol: 'HTTPS', payload: 'Secure Sub', action: 'ALLOW' },
            { port: 3306, protocol: 'MySQL', payload: 'DB Query', action: 'DROP' },
            { port: 53, protocol: 'DNS', payload: 'Name Lookup', action: 'ALLOW' },
            { port: 666, protocol: 'TROJAN', payload: 'Backdoor', action: 'DROP' },
            { port: 8080, protocol: 'PROXY', payload: 'Traffic Forward', action: 'ALLOW' },
            { port: 23, protocol: 'TELNET', payload: 'Insecure Shell', action: 'DROP' },
            { port: 445, protocol: 'SMB', payload: 'File Share', action: 'DROP' },
            { port: 123, protocol: 'NTP', payload: 'Time Sync', action: 'ALLOW' }
        ];

        this.render();
    },

    render() {
        const packet = this.packets[this.currentPacketIndex];

        this.container.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-2xl font-bold text-white mb-2">${this.game.getText('L10_TITLE')}</h2>
                    <p class="text-slate-400">${this.game.getText('L10_DESC')}</p>
                </div>

                <!-- Firewall Console -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    
                    <!-- Rules Panel -->
                    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div class="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                            <iconify-icon icon="solar:shield-warning-bold" class="text-xl text-indigo-400"></iconify-icon>
                            <h3 class="text-xs font-black uppercase tracking-widest text-white">${this.game.getText('L10_POLICY_HEADER')}</h3>
                        </div>
                        <ul class="space-y-3 font-mono text-xs">
                            <li class="flex justify-between border-b border-slate-800/50 pb-2">
                                <span class="text-slate-500">HTTP/HTTPS</span>
                                <span class="text-emerald-500 font-bold">TRUSTED</span>
                            </li>
                            <li class="flex justify-between border-b border-slate-800/50 pb-2">
                                <span class="text-slate-500">DNS (53)</span>
                                <span class="text-emerald-500 font-bold">TRUSTED</span>
                            </li>
                            <li class="flex justify-between border-b border-slate-800/50 pb-2">
                                <span class="text-slate-500">SSH/DB</span>
                                <span class="text-rose-500 font-bold">RESTRICTED</span>
                            </li>
                            <li class="flex justify-between">
                                <span class="text-slate-500">UNKNOWN</span>
                                <span class="text-rose-500 font-bold">REJECT</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Incoming Packet -->
                    <div class="bg-slate-950 border-2 border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group">
                        <div class="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div class="flex items-center gap-2 mb-6 text-indigo-400">
                             <iconify-icon icon="solar:transmission-bold" class="text-2xl animate-pulse"></iconify-icon>
                             <span class="text-[10px] font-black uppercase tracking-widest">Incoming Stream</span>
                        </div>

                        <div class="space-y-6 relative z-10" id="packet-data">
                            <div>
                                <div class="text-[10px] uppercase font-bold text-slate-600 mb-1">Source Port</div>
                                <div class="text-3xl font-black text-white font-mono">${packet.port}</div>
                            </div>
                            <div>
                                <div class="text-[10px] uppercase font-bold text-slate-600 mb-1">Protocol</div>
                                <div class="text-xl font-bold text-indigo-300 font-mono">${packet.protocol}</div>
                            </div>
                            <div class="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                <div class="text-[10px] uppercase font-bold text-slate-500 mb-1">Payload Analysis</div>
                                <div class="text-xs text-slate-400 italic">${packet.payload}</div>
                            </div>
                        </div>

                        <!-- Progress -->
                        <div class="mt-8 flex gap-1">
                            ${Array(this.totalPackets).fill(0).map((_, i) => `
                                <div class="h-1 flex-1 rounded-full ${i < this.currentPacketIndex ? 'bg-indigo-500' : 'bg-slate-800'}"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Decision Buttons -->
                <div class="flex justify-center gap-6">
                    <button class="btn-action w-40 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex flex-col items-center gap-1" data-action="ALLOW">
                        <iconify-icon icon="solar:check-circle-bold" class="text-2xl"></iconify-icon>
                        <span class="text-[10px] uppercase tracking-widest">${this.game.getText('L10_ALLOW')}</span>
                    </button>
                    <button class="btn-action w-40 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-lg shadow-rose-900/20 transition-all flex flex-col items-center gap-1" data-action="DROP">
                        <iconify-icon icon="solar:close-circle-bold" class="text-2xl"></iconify-icon>
                        <span class="text-[10px] uppercase tracking-widest">${this.game.getText('L10_DROP')}</span>
                    </button>
                </div>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        this.container.querySelectorAll('.btn-action').forEach(btn => {
            btn.onclick = () => {
                const action = btn.dataset.action;
                const correctAction = this.packets[this.currentPacketIndex].action;

                if (action === correctAction) {
                    this.score += 200;
                    this.nextPacket();
                } else {
                    this.game.showFeedback('SECURITY BREACH', 'Unauthorized packet allowed or critical service dropped. Security integrity compromised.');
                    this.score = Math.max(0, this.score - 250);
                }
            };
        });
    },

    nextPacket() {
        this.currentPacketIndex++;
        if (this.currentPacketIndex < this.totalPackets) {
            this.render();
        } else {
            this.finishLevel();
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.score,
            xp: 2000,
            accuracy: 100
        });
    }
};
