/**
 * Level 9: Cloud Infrastructure
 * Mechanic: Drag nodes (Web, DB, Cache) to correct Cloud Environments.
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.installedCount = 0;
        this.results = [];
        this.selectedNodeId = null;

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

        const content = document.createElement('div');
        content.className = "flex flex-col gap-8 w-full";

        const header = new Card({
            title: this.game.getText('L9_TITLE'),
            subtitle: this.game.getText('L9_DESC'),
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const statusFeedback = new Feedback({
            title: "Network Architect Console",
            message: this.selectedNodeId ? `Select a destination for ${this.nodes.find(n => n.id === this.selectedNodeId).name}` : "Deploy nodes to their specific security zones.",
            type: "neutral"
        });
        content.appendChild(statusFeedback.render());

        const zonesContainer = document.createElement('div');
        zonesContainer.className = "grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6";

        this.environments.forEach(env => {
            const zone = document.createElement('div');
            const isTargeted = this.selectedNodeId !== null;

            zone.className = `env-zone h-32 sm:h-48 rounded-2xl sm:rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 sm:gap-4 transition-all relative overflow-hidden cursor-pointer
                ${isTargeted ? 'border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10' : `border-${env.color}-500/20 bg-${env.color}-500/5`}`;

            zone.dataset.env = env.id;
            zone.innerHTML = `
                <span class="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-900 px-2 sm:px-3 py-1 rounded-full border border-slate-800 z-10 text-center">${env.name}</span>
                <div class="slot w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border border-slate-800/50 bg-slate-950/50 flex items-center justify-center text-slate-800 z-10 transition-all">
                    <iconify-icon icon="solar:cloud-upload-linear" class="text-xl sm:text-3xl"></iconify-icon>
                </div>
                <div class="absolute inset-0 bg-indigo-500/10 opacity-0 transition-opacity drop-indicator"></div>
            `;

            zone.onclick = () => {
                if (this.selectedNodeId) {
                    const node = this.nodes.find(n => n.id === this.selectedNodeId);
                    this.handleDrop(this.selectedNodeId, node.env, env.id, zone);
                }
            };

            zonesContainer.appendChild(zone);
        });
        content.appendChild(zonesContainer);

        const tray = document.createElement('div');
        tray.className = "flex flex-wrap justify-center gap-4 sm:gap-6";

        const unassignedNodes = this.nodes.filter(node => !this.results.find(r => r.id === node.id && r.isCorrect));

        unassignedNodes.forEach(node => {
            const isSelected = this.selectedNodeId === node.id;
            const nodeEl = document.createElement('div');
            nodeEl.className = `node-item w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-xl group select-none touch-none
                ${isSelected ? 'bg-indigo-600 border-indigo-400 scale-105 shadow-indigo-500/20' : 'bg-slate-900 border-slate-800 hover:border-indigo-500'}`;

            nodeEl.draggable = true;
            nodeEl.dataset.id = node.id;
            nodeEl.dataset.env = node.env;
            nodeEl.innerHTML = `
                <iconify-icon icon="${node.icon}" class="text-2xl sm:text-3xl ${isSelected ? 'text-white' : 'text-indigo-400 group-hover:scale-110'} transition-transform"></iconify-icon>
                <span class="text-[8px] sm:text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-400'} uppercase text-center px-2 leading-tight">${node.name}</span>
            `;

            nodeEl.onclick = (e) => {
                e.stopPropagation();
                this.selectedNodeId = isSelected ? null : node.id;
                this.render();
            };

            tray.appendChild(nodeEl);
        });

        const trayCard = new Card({
            title: "Provisioning Tray",
            subtitle: "Tap a node then a destination zone",
            content: tray,
            variant: 'glass'
        });
        content.appendChild(trayCard.render());

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());

        this.attachDragEvents();
    },

    attachDragEvents() {
        const nodes = this.container.querySelectorAll('.node-item');
        const zones = this.container.querySelectorAll('.env-zone');

        nodes.forEach(node => {
            node.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('nodeId', node.dataset.id);
                e.dataTransfer.setData('targetEnv', node.dataset.env);
                node.classList.add('opacity-50');
                this.selectedNodeId = node.dataset.id;
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
                this.handleDrop(nodeId, targetEnv, zone.dataset.env, zone);
            });
        });
    },

    handleDrop(nodeId, targetEnv, currentEnv, zone) {
        const isMatch = targetEnv === currentEnv;
        const nodeData = this.nodes.find(n => n.id === nodeId);

        if (!isMatch) {
            zone.classList.add('animate-shake', 'border-rose-500');
            setTimeout(() => zone.classList.remove('animate-shake', 'border-rose-500'), 500);
            this.results.push({ id: nodeId, isCorrect: false, name: nodeData.name });
            return;
        }

        this.results.push({
            id: nodeId,
            question: nodeData.name,
            selected: currentEnv,
            correct: targetEnv,
            isCorrect: true
        });

        this.installedCount++;
        this.selectedNodeId = null;
        this.render();

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

