/**
 * Level 9: Cloud Infrastructure
 * Mechanic: Drag nodes (Web, DB, Cache) to correct Cloud Environments.
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
        this.installedCount = 0;
        this.results = [];

        this.nodes = [
            { id: 'web1', name: 'Web Server Alpha', env: 'public', icon: 'solar:globus-linear' },
            { id: 'web2', name: 'Web Server Beta', env: 'public', icon: 'solar:globus-linear' },
            { id: 'db', name: 'Secure DB Cluster', env: 'onprem', icon: 'solar:database-linear' },
            { id: 'cache', name: 'Global Cache', env: 'private', icon: 'solar:flash-drive-linear' },
            { id: 'proxy', name: 'Traffic Proxy', env: 'edge', icon: 'solar:shield-up-linear' },
            { id: 'cdn', name: 'CDN Node', env: 'edge', icon: 'solar:video-library-linear' }
        ];

        this.environments = [
            { id: 'public', name: 'Public Cloud', color: 'indigo' },
            { id: 'private', name: 'Private VNET', color: 'blue' },
            { id: 'onprem', name: 'Local Datacenter', color: 'slate' },
            { id: 'edge', name: 'Edge Gateway', color: 'emerald' }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';

        const header = new Card({
            title: this.game.getText('L9_TITLE'),
            subtitle: this.game.getText('L9_DESC'),
            variant: 'flat',
            customClass: 'text-center mb-8'
        });

        const statusFeedback = new Feedback({
            title: "Provisioning Status",
            message: "Awaiting node deployment to respective security zones.",
            type: "neutral"
        });

        const zonesContainer = document.createElement('div');
        zonesContainer.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12";

        this.environments.forEach(env => {
            const zone = document.createElement('div');
            zone.className = `env-zone h-48 rounded-3xl border-2 border-dashed border-${env.color}-500/30 bg-${env.color}-500/5 flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden`;
            zone.dataset.env = env.id;
            zone.innerHTML = `
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 z-10">${env.name}</span>
                <div class="slot w-24 h-24 rounded-2xl border border-slate-800/50 bg-slate-950/50 flex items-center justify-center text-slate-800 z-10 transition-all">
                    <iconify-icon icon="solar:cloud-upload-linear" class="text-3xl"></iconify-icon>
                </div>
                <div class="absolute inset-0 bg-${env.color}-500/10 opacity-0 transition-opacity drop-indicator"></div>
            `;
            zonesContainer.appendChild(zone);
        });

        const tray = document.createElement('div');
        tray.className = "flex flex-wrap justify-center gap-6";
        this.nodes.forEach(node => {
            if (this.results.find(r => r.id === node.id && r.isCorrect)) return;

            const nodeEl = document.createElement('div');
            nodeEl.className = "node-item w-28 h-28 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2 cursor-grab active:cursor-grabbing hover:border-indigo-500 transition-all shadow-xl group";
            nodeEl.draggable = true;
            nodeEl.dataset.id = node.id;
            nodeEl.dataset.env = node.env;
            nodeEl.innerHTML = `
                <iconify-icon icon="${node.icon}" class="text-3xl text-indigo-400 group-hover:scale-110 transition-transform"></iconify-icon>
                <span class="text-[10px] font-bold text-white uppercase text-center px-2">${node.name}</span>
            `;
            tray.appendChild(nodeEl);
        });

        const trayCard = new Card({
            title: "Unassigned Nodes",
            content: tray,
            variant: 'glass'
        });

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render());
        this.container.appendChild(zonesContainer);
        this.container.appendChild(trayCard.render());

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
            node.addEventListener('dragend', () => node.classList.remove('opacity-50'));
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.querySelector('.drop-indicator').classList.add('opacity-100');
            });
            zone.addEventListener('dragleave', () => {
                zone.querySelector('.drop-indicator').classList.remove('opacity-100');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.querySelector('.drop-indicator').classList.remove('opacity-100');

                const nodeId = e.dataTransfer.getData('nodeId');
                const targetEnv = e.dataTransfer.getData('targetEnv');
                const currentEnv = zone.dataset.env;

                this.handleDrop(nodeId, targetEnv, currentEnv, zone);
            });
        });
    },

    handleDrop(nodeId, targetEnv, currentEnv, zone) {
        const isMatch = targetEnv === currentEnv;
        const nodeData = this.nodes.find(n => n.id === nodeId);

        this.results.push({
            id: nodeId,
            question: nodeData.name,
            selected: currentEnv,
            correct: targetEnv,
            isCorrect: isMatch
        });

        if (isMatch) {
            this.installedCount++;
            const slot = zone.querySelector('.slot');
            slot.innerHTML = `<iconify-icon icon="${nodeData.icon}" class="text-4xl text-emerald-400 animate-bounce-in"></iconify-icon>`;
            slot.classList.add('border-emerald-500/50', 'bg-emerald-500/10');
            this.render(); // Re-render tray to remove node
        } else {
            zone.classList.add('animate-shake');
            setTimeout(() => zone.classList.remove('animate-shake'), 500);
        }

        if (this.results.filter(r => r.isCorrect).length === this.nodes.length) {
            setTimeout(() => this.finishLevel(), 1000);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.results.filter(r => r.isCorrect).length * 500,
            xp: 1200,
            accuracy: Math.round((this.results.filter(r => r.isCorrect).length / this.results.length) * 100),
            detailedResults: this.results
        });
    }
};
