/**
 * Level 14: Transmission History & Ports
 * Mechanic: Timeline Sorting + Port Matching.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.itemsMatched = 0;
        this.totalItems = 6; // 3 history, 3 ports

        this.timeline = [
            { id: 'h1', text: 'ARPANET Protocol', year: '1969', target: 'pos1' },
            { id: 'h2', text: 'Creation of WWW', year: '1989', target: 'pos2' },
            { id: 'h3', text: 'IPv6 Launch', year: '2012', target: 'pos3' }
        ];

        this.ports = [
            { id: 'p1', port: '80', service: 'HTTP (Web)', target: 'target-p1' },
            { id: 'p2', port: '443', service: 'HTTPS (Secure)', target: 'target-p2' },
            { id: 'p3', port: '22', service: 'SSH (Remote)', target: 'target-p3' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto flex flex-col gap-12">
                <div class="text-center">
                    <h2 class="text-2xl font-bold text-white mb-2">${this.game.getText('L14_TITLE')}</h2>
                    <p class="text-slate-400">${this.game.getText('L14_DESC')}</p>
                </div>

                <!-- History Timeline -->
                <div class="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                    <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8 border-l-2 border-indigo-500 pl-3">${this.game.getText('L14_HIST_LBL')}</h3>
                    
                    <div class="flex flex-col md:flex-row gap-6 justify-between relative">
                        <!-- Connecting Line -->
                        <div class="hidden md:block absolute top-[28px] left-0 w-full h-0.5 bg-slate-800 z-0"></div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            ${[1, 2, 3].map(i => `
                                <div class="timeline-slot h-20 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex items-center justify-center relative z-10" data-target="pos${i}">
                                    <span class="text-[10px] font-black text-slate-700">ERA ${i}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex justify-center gap-4 mt-12" id="history-items">
                         ${this.timeline.map(item => `
                            <div class="history-item px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl cursor-grab active:cursor-grabbing text-xs font-bold text-white hover:border-indigo-500 transition-all shadow-xl" 
                                draggable="true" data-id="${item.id}" data-target="${item.target}">
                                ${item.text} (${item.year})
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Port Matching -->
                <div class="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                    <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8 border-l-2 border-emerald-500 pl-3">${this.game.getText('L14_PORT_LBL')}</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        ${this.ports.map(p => `
                            <div class="flex flex-col items-center gap-4">
                                <div class="port-target w-full h-24 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center gap-1" data-target="${p.target}">
                                    <span class="text-2xl font-black text-slate-800 font-mono">${p.port}</span>
                                    <span class="text-[10px] font-bold text-slate-700 uppercase">Awaiting Link</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="flex justify-center gap-4 mt-8" id="port-items">
                         ${this.ports.map(p => `
                            <div class="port-item px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl cursor-grab active:cursor-grabbing text-xs font-bold text-white hover:border-emerald-500 transition-all shadow-xl" 
                                draggable="true" data-id="${p.id}" data-target="${p.target}">
                                ${p.service}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const items = this.container.querySelectorAll('[draggable="true"]');
        const zones = this.container.querySelectorAll('.timeline-slot, .port-target');

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('id', item.dataset.id);
                e.dataTransfer.setData('target', item.dataset.target);
                item.classList.add('opacity-50');
            });
            item.addEventListener('dragend', () => item.classList.remove('opacity-50'));
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('border-indigo-500', 'bg-indigo-500/10');
            });
            zone.addEventListener('dragleave', () => zone.classList.remove('border-indigo-500', 'bg-indigo-500/10'));
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('border-indigo-500', 'bg-indigo-500/10');

                const id = e.dataTransfer.getData('id');
                const target = e.dataTransfer.getData('target');
                const zoneTarget = zone.dataset.target;

                if (target === zoneTarget) {
                    this.handleCorrectMatch(id, zone);
                } else {
                    this.game.showFeedback('SEQUENCE FAILURE', 'Evolutionary logic or port allocation error detected.');
                }
            });
        });
    },

    handleCorrectMatch(id, zone) {
        const itemEl = this.container.querySelector(`[data-id="${id}"]`);
        const itemText = itemEl.innerText;

        zone.innerHTML = `
            <div class="flex flex-col items-center animate-bounce-in text-emerald-400">
                <iconify-icon icon="solar:check-circle-bold" class="text-2xl mb-1"></iconify-icon>
                <span class="text-[10px] font-bold uppercase text-center">${itemText}</span>
            </div>
        `;
        zone.classList.add('border-emerald-500/50', 'bg-emerald-500/5');
        itemEl.remove();

        this.itemsMatched++;
        this.score += 200;

        if (this.itemsMatched === this.totalItems) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.score,
            xp: 1500,
            accuracy: 100
        });
    }
};
