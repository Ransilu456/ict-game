/**
 * Level 9: Cloud Infrastructure
 * Mechanic: Drag nodes (Web, DB, Cache) to correct Cloud Environments.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.installedCount = 0;
        this.installedCount = 0;
        this.totalComponents = 6;

        this.nodes = [
            { id: 'web1', name: 'Web Server Alpha', env: 'public', icon: 'solar:globus-linear' },
            { id: 'web2', name: 'Web Server Beta', env: 'public', icon: 'solar:globus-linear' },
            { id: 'db', name: 'Secure DB Cluster', env: 'onprem', icon: 'solar:database-linear' },
            { id: 'cache', name: 'Global Cache', env: 'private', icon: 'solar:flash-drive-linear' },
            { id: 'proxy', name: 'Traffic Proxy', env: 'edge', icon: 'solar:shield-up-linear' },
            { id: 'cdn', name: 'CDN Node', env: 'edge', icon: 'solar:video-library-linear' }
        ];

        this.environments = [
            { id: 'public', name: 'Public Cloud', color: 'border-blue-500/30 bg-blue-500/5' },
            { id: 'private', name: 'Private VNET', color: 'border-indigo-500/30 bg-indigo-500/5' },
            { id: 'onprem', name: 'Local Datacenter', color: 'border-slate-500/30 bg-slate-500/5' },
            { id: 'edge', name: 'Edge Gateway', color: 'border-emerald-500/30 bg-emerald-500/5' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-2xl font-bold text-white mb-2">${this.game.getText('L9_TITLE')}</h2>
                    <p class="text-slate-400">${this.game.getText('L9_DESC')}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    ${this.environments.map(env => `
                        <div class="env-zone h-48 rounded-3xl border-2 border-dashed ${env.color} flex flex-col items-center justify-center gap-4 transition-all" data-env="${env.id}">
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">${env.name}</span>
                            <div class="slot w-24 h-24 rounded-2xl border border-slate-800/50 bg-slate-950/50 flex items-center justify-center text-slate-800">
                                <iconify-icon icon="solar:cloud-upload-linear" class="text-3xl"></iconify-icon>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                    <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 text-center">Unassigned Nodes</h3>
                    <div class="flex justify-center gap-6" id="nodes-tray">
                        ${this.nodes.map(node => `
                            <div class="node-item w-28 h-28 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 transition-all shadow-lg shadow-black/20" 
                                draggable="true" data-id="${node.id}" data-env="${node.env}">
                                <iconify-icon icon="${node.icon}" class="text-3xl text-indigo-400"></iconify-icon>
                                <span class="text-[10px] font-bold text-white uppercase">${node.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const nodes = this.container.querySelectorAll('.node-item');
        const zones = this.container.querySelectorAll('.env-zone');

        nodes.forEach(node => {
            node.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('nodeId', node.dataset.id);
                e.dataTransfer.setData('targetEnv', node.dataset.env);
                node.classList.add('opacity-50');
            });

            node.addEventListener('dragend', () => {
                node.classList.remove('opacity-50');
            });
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('border-indigo-500', 'bg-indigo-500/10');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('border-indigo-500', 'bg-indigo-500/10');

                const nodeId = e.dataTransfer.getData('nodeId');
                const targetEnv = e.dataTransfer.getData('targetEnv');
                const currentEnv = zone.dataset.env;

                if (targetEnv === currentEnv) {
                    this.handleCorrectDrop(nodeId, zone);
                } else {
                    this.game.showFeedback('DEPLOYMENT FAILURE', 'Node incompatible with selected environment latency/security policy.');
                    this.score = Math.max(0, this.score - 250);
                }
            });
        });
    },

    handleCorrectDrop(nodeId, zone) {
        const nodeData = this.nodes.find(n => n.id === nodeId);
        const slot = zone.querySelector('.slot');
        const originalNode = this.container.querySelector(`.node-item[data-id="${nodeId}"]`);

        slot.innerHTML = `
            <div class="flex flex-col items-center animate-bounce-in">
                <iconify-icon icon="${nodeData.icon}" class="text-4xl text-emerald-400"></iconify-icon>
            </div>
        `;
        slot.classList.remove('text-slate-800');
        slot.classList.add('border-emerald-500/50', 'bg-emerald-500/10');

        originalNode.style.display = 'none';
        this.installedCount++;
        this.score += 500;

        if (this.installedCount === this.totalComponents) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.score,
            xp: 1200,
            accuracy: 100
        });
    }
};
