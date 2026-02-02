/**
 * Level 13: Advanced Subnetting
 * Mechanic: Identity Network/Broadcast from CIDR.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.currentIndex = 0;
        this.totalTasks = 5;

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
        const scenario = this.scenarios[this.currentIndex];

        this.container.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <div class="text-center mb-10">
                    <h2 class="text-2xl font-bold text-white mb-2">${this.game.getText('L13_TITLE')}</h2>
                    <p class="text-slate-400">${this.game.getText('L13_DESC')}</p>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <div class="flex items-center justify-between mb-8 border-b border-indigo-500/20 pb-6">
                        <div>
                            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">${this.game.getText('L13_IP_LBL')}</span>
                            <div class="text-4xl font-mono font-black text-indigo-400 tracking-tighter">${scenario.ip}</div>
                        </div>
                        <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <iconify-icon icon="solar:calculator-minimalistic-bold" class="text-3xl"></iconify-icon>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase mb-2 block">${this.game.getText('L13_MASK_LBL')}</label>
                                <input type="text" id="ans-mask" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:border-indigo-500 transition-colors" placeholder="0.0.0.0">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-600 uppercase mb-2 block">${this.game.getText('L13_NETID_LBL')}</label>
                                <input type="text" id="ans-netid" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:border-indigo-500 transition-colors" placeholder="0.0.0.0">
                            </div>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-600 uppercase mb-2 block">${this.game.getText('L13_BC_LBL')}</label>
                            <input type="text" id="ans-bc" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:border-indigo-500 transition-colors" placeholder="0.0.0.0">
                        </div>
                    </div>

                    <button id="btn-verify-subnet" class="w-full mt-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                        <span class="absolute inset-y-0 left-0 w-1 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform"></span>
                        <iconify-icon icon="solar:shield-check-bold" class="text-2xl"></iconify-icon>
                        <span>PROCESS CALCULATION</span>
                    </button>
                    
                    <div class="mt-6 flex justify-center gap-1">
                        ${Array(this.totalTasks).fill(0).map((_, i) => `
                            <div class="h-1 w-8 rounded-full ${i <= this.currentIndex ? 'bg-indigo-500' : 'bg-slate-800'}"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const btn = document.getElementById('btn-verify-subnet');
        btn.onclick = () => {
            const m = document.getElementById('ans-mask').value.trim();
            const n = document.getElementById('ans-netid').value.trim();
            const b = document.getElementById('ans-bc').value.trim();

            const s = this.scenarios[this.currentIndex];

            if (m === s.mask && n === s.netid && b === s.broadcast) {
                this.score += 1000;
                this.nextScenario();
            } else {
                this.game.showFeedback('CALCULATION ERROR', 'Mathematical inconsistency detected in the subnet parameters.');
                this.score = Math.max(0, this.score - 200);
            }
        };
    },

    nextScenario() {
        this.currentIndex++;
        if (this.currentIndex < this.totalTasks) {
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
