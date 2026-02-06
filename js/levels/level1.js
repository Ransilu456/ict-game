/**
 * Level 1: Hardware Basics
 * Objective: Assemble the PC components correctly in the right order.
 * Refactored using Component Architecture
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.placedItems = 0;
        this.startTime = Date.now();
        this.placements = [];

        // Define correct install order (Logical Assembly)
        this.installOrder = [
            ['cpu', 'ram', 'storage'], // Phase 1
            ['liquid', 'fan', 'fan2'], // Phase 2
            ['gpu', 'nic', 'audio'],   // Phase 3
            ['psu']                    // Phase 4
        ];
        this.currentPhase = 0;

        // Parts Config
        this.parts = [
            { id: 'cpu', label: 'CPU Processor', icon: 'solar:cpu-bold', color: 'indigo' },
            { id: 'ram', label: 'DDR5 RAM', icon: 'solar:ssd-square-bold', color: 'emerald' },
            { id: 'gpu', label: 'RTX Graphics', icon: 'solar:videocamera-record-bold', color: 'rose' },
            { id: 'storage', label: 'NVMe SSD', icon: 'solar:server-square-bold', color: 'amber' },
            { id: 'psu', label: 'Power Supply', icon: 'solar:bolt-circle-bold', color: 'yellow' },
            { id: 'fan', label: 'Cooling Fan 1', icon: 'solar:wind-bold', color: 'cyan' },
            { id: 'fan2', label: 'Cooling Fan 2', icon: 'solar:wind-bold', color: 'cyan' },
            { id: 'nic', label: 'Network Card', icon: 'solar:globus-bold', color: 'blue' },
            { id: 'audio', label: 'Sound Card', icon: 'solar:music-note-bold', color: 'purple' },
            { id: 'liquid', label: 'AIO Cooler', icon: 'solar:water-drops-bold', color: 'sky' }
        ];

        this.totalItems = this.parts.length;
        this.render();
    },

    render() {
        this.container.innerHTML = '';

        // Content Wrapper
        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full";

        // Header Section
        const header = new Card({
            title: this.game.getText('L1_TITLE'),
            subtitle: this.game.getText('L1_DESC') + " | Precision Assembly Required.",
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const instructionFeedback = new Feedback({
            title: "Assembly Protocol",
            message: "Install core components (CPU, RAM, M.2) before coolers and peripherals.",
            type: "neutral"
        });
        content.appendChild(instructionFeedback.render());

        // Main Layout: Column on mobile, row on large screens
        const layout = document.createElement('div');
        layout.className = "flex flex-col lg:flex-row gap-6";

        // Left/Top: Parts Tray
        const trayContent = document.createElement('div');
        trayContent.className = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3";

        this.parts.forEach(part => {
            const el = document.createElement('div');
            el.className = `draggable-item p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center gap-2 group select-none touch-none ${this.placements.includes(part.id) ? 'hidden' : ''}`;
            el.draggable = true;
            el.dataset.type = part.id;
            el.dataset.label = part.label;

            // Handle touch for mobile drag-drop simulation if needed (simplified here)
            el.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-${part.color}-500/10 flex items-center justify-center text-${part.color}-400 group-hover:scale-110 transition-transform">
                    <iconify-icon icon="${part.icon}" class="text-2xl"></iconify-icon>
                </div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide text-center">${part.label}</span>
            `;

            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', part.id);
                e.dataTransfer.setData('label', part.label);
                el.classList.add('opacity-50');
            });
            el.addEventListener('dragend', () => el.classList.remove('opacity-50'));

            trayContent.appendChild(el);
        });

        const trayCard = new Card({
            title: "Component Tray",
            subtitle: "Drag items to the schematic",
            content: trayContent,
            variant: 'glass',
            customClass: 'w-full lg:w-1/3'
        });

        // Right: Motherboard Schematic
        const schematicWrapper = document.createElement('div');
        schematicWrapper.className = "h-auto lg:h-full w-full relative bg-slate-900/50 rounded-xl border-2 border-slate-800/50 overflow-hidden custom-scrollbar flex flex-col p-4";

        // The Motherboard Grid
        const board = document.createElement('div');
        board.className = "relative w-full max-w-[340px] sm:max-w-xl bg-slate-950 rounded-[2rem] border-[6px] border-slate-800 shadow-2xl p-4 sm:p-6 grid grid-cols-3 gap-3 sm:gap-4 mx-auto shrink-0";

        board.innerHTML = `
            <!-- Top Fans -->
            ${this.renderDropZone('fan', 'Cooler 01', 'col-span-1 aspect-square')}
            <div class="col-span-1 flex items-center justify-center opacity-10">
                <iconify-icon icon="solar:chip-bold" class="text-3xl sm:text-5xl"></iconify-icon>
            </div>
            ${this.renderDropZone('fan2', 'Cooler 02', 'col-span-1 aspect-square')}
            
            <!-- Radiator -->
            ${this.renderDropZone('liquid', 'Liquid Cooling Block', 'col-span-3 h-16 sm:h-20 bg-slate-900/30')}
            
            <!-- Main Board Area -->
            <div class="col-span-3 border-2 border-indigo-500/20 bg-indigo-500/5 rounded-2xl p-4 relative mt-2">
                <div class="absolute -top-3 left-4 bg-slate-950 px-2 text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] border border-white/5 rounded-full">Motherboard Core</div>
                
                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                    ${this.renderDropZone('cpu', 'Processor Socket', 'aspect-square')}
                    ${this.renderDropZone('ram', 'RAM Modules', 'aspect-square')}
                    
                    ${this.renderDropZone('storage', 'NVMe Storage', 'col-span-2 h-10 sm:h-12')}
                    ${this.renderDropZone('gpu', 'Graphics PCIe Slot', 'col-span-2 h-14 sm:h-16')}
                    
                    <div class="col-span-2 grid grid-cols-2 gap-3">
                        ${this.renderDropZone('nic', 'Network Unit', 'h-10 sm:h-12')}
                        ${this.renderDropZone('audio', 'Audio HD Unit', 'h-10 sm:h-12')}
                    </div>
                </div>
            </div>

            <!-- Bottom: PSU -->
            <div class="col-span-2 py-2 flex items-end">
                <div class="w-full h-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-50"></div>
            </div>
            ${this.renderDropZone('psu', 'Power Supply', 'col-span-1 aspect-square bg-slate-800/20')}
        `;


        const boardCard = new Card({
            title: "System Schematic",
            subtitle: `Phase ${this.currentPhase + 1}: Assemble Core Components`,
            content: board,
            variant: 'glass',
            customClass: 'w-full lg:w-2/3 flex flex-col items-center'
        });

        layout.appendChild(trayCard.render());
        layout.appendChild(boardCard.render());
        content.appendChild(layout);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());

        this.attachEvents();
    },

    renderDropZone(accept, label, classes = '') {
        const isOccupied = this.placements.includes(accept);
        const part = this.parts.find(p => p.id === accept);

        return `
            <div class="drop-zone border-2 ${isOccupied ? 'occupied border-emerald-500/50 bg-emerald-500/10' : 'border-dashed border-slate-700 bg-slate-900/50'} rounded-lg flex flex-col items-center justify-center transition-all ${classes}" 
                data-accept="${accept}" data-label="${label}">
                ${isOccupied ? `
                    <div class="flex flex-col items-center justify-center text-emerald-400">
                        <iconify-icon icon="${part.icon}" class="text-xl sm:text-2xl"></iconify-icon>
                        <span class="text-[7px] font-bold uppercase mt-1 text-center">${label}</span>
                    </div>
                ` : `
                    <span class="text-[8px] font-bold text-slate-500 uppercase pointer-events-none text-center px-1">${label}</span>
                `}
            </div>
        `;
    },

    attachEvents() {
        const zones = this.container.querySelectorAll('.drop-zone');
        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!zone.classList.contains('occupied')) zone.classList.add('bg-indigo-500/10', 'border-indigo-500');
            });

            zone.addEventListener('dragleave', () => zone.classList.remove('bg-indigo-500/10', 'border-indigo-500'));

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('bg-indigo-500/10', 'border-indigo-500');
                const type = e.dataTransfer.getData('type');
                const label = e.dataTransfer.getData('label');
                if (type && !zone.classList.contains('occupied')) this.handleDrop(zone, type, label);
            });

            // Mobile Tap-to-Place fallback
            zone.addEventListener('click', () => {
                const activeDraggable = document.querySelector('.draggable-item.active-choice');
                if (activeDraggable && !zone.classList.contains('occupied')) {
                    this.handleDrop(zone, activeDraggable.dataset.type, activeDraggable.dataset.label);
                    activeDraggable.classList.remove('active-choice');
                }
            });
        });

        // Mobile Tray Interaction
        this.container.querySelectorAll('.draggable-item').forEach(item => {
            item.addEventListener('click', () => {
                this.container.querySelectorAll('.draggable-item').forEach(i => i.classList.remove('active-choice', 'ring-2', 'ring-indigo-500'));
                item.classList.add('active-choice', 'ring-2', 'ring-indigo-500');
            });
        });
    },

    handleDrop(zone, type, label) {
        if (zone.dataset.accept !== type || !this.installOrder[this.currentPhase].includes(type)) {
            zone.classList.add('animate-shake', 'border-rose-500');
            setTimeout(() => zone.classList.remove('animate-shake', 'border-rose-500'), 500);
            return;
        }

        this.placeItem(zone, type, label);
    },

    placeItem(zone, type, label) {
        zone.classList.add('occupied', 'border-emerald-500/50', 'bg-emerald-500/10');
        zone.classList.remove('border-dashed', 'border-slate-700');

        const part = this.parts.find(p => p.id === type);
        zone.innerHTML = `
            <div class="animate-fade-in flex flex-col items-center justify-center text-emerald-400">
                <iconify-icon icon="${part.icon}" class="text-xl sm:text-2xl"></iconify-icon>
                <span class="text-[7px] font-bold uppercase mt-1 text-center">${label}</span>
            </div>
        `;

        const dragger = this.container.querySelector(`.draggable-item[data-type="${type}"]`);
        if (dragger) dragger.classList.add('hidden');

        this.placements.push(type);
        this.placedItems++;

        if (this.installOrder[this.currentPhase].every(p => this.placements.includes(p))) {
            if (this.currentPhase < this.installOrder.length - 1) {
                this.currentPhase++;
                this.render(); // Re-render to update instructions/phase
            } else {
                setTimeout(() => this.finishLevel(), 1000);
            }
        }
    },

    finishLevel() {
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, (90 - elapsedSec) * 10);
        this.game.completeLevel({
            success: true,
            score: 1000 + timeBonus,
            xp: 500,
            accuracy: 100,
            timeBonus: timeBonus,
            detailedResults: [
                { question: "Assembly Protocol", selected: "Correct Sequence", correct: "Correct Sequence", isCorrect: true },
                { question: "Component Placement", selected: "All Parts Installed", correct: "All Parts Installed", isCorrect: true }
            ]
        });
    }
};

