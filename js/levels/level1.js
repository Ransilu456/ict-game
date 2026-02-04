/**
 * Level 1: Hardware Basics
 * Objective: Assemble the PC components correctly in the right order.
 * Refactored using Component Architecture
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.placedItems = 0;
        this.startTime = Date.now();
        this.placements = [];

        // Define correct install order (Logical Assembly)
        // 1. Motherboard parts (CPU, RAM, M.2) -> 2. Cooling -> 3. GPU -> 4. PSU/Cables
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

        // Header Section
        const header = new Card({
            title: this.game.getText('L1_TITLE'),
            subtitle: this.game.getText('L1_DESC') + " | Precision Assembly Required.",
            variant: 'flat',
            customClass: 'mb-6 text-center'
        });

        // Main Layout
        const layout = document.createElement('div');
        layout.className = "flex flex-col lg:flex-row gap-8 min-h-screen lg:h-[calc(100vh-250px)]";

        // Left: Parts Tray
        const trayContent = document.createElement('div');
        trayContent.className = "grid grid-cols-2 gap-3";

        // Render Draggables
        this.parts.forEach(part => {
            const el = document.createElement('div');
            el.className = "draggable-item p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center gap-2 group select-none";
            el.draggable = true;
            el.dataset.type = part.id;
            el.dataset.label = part.label;

            el.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-${part.color}-500/10 flex items-center justify-center text-${part.color}-400 group-hover:scale-110 transition-transform">
                    <iconify-icon icon="${part.icon}" class="text-2xl"></iconify-icon>
                </div>
                <span class="text-xs font-bold text-slate-300 uppercase tracking-wide text-center">${part.label}</span>
            `;

            // Drag Events
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
            customClass: 'w-full lg:w-1/3 flex flex-col'
        });

        // Right: Motherboard Schematic
        const schematicWrapper = document.createElement('div');
        schematicWrapper.className = "h-auto lg:h-full w-full relative bg-slate-900/50 rounded-xl border-2 border-slate-800/50 overflow-hidden custom-scrollbar flex flex-col p-4";

        // The Motherboard Grid
        const board = document.createElement('div');
        board.className = "relative w-full max-w-[320px] sm:max-w-lg aspect-[3/4] bg-slate-950 rounded-xl border-4 border-slate-800 shadow-2xl p-4 grid grid-cols-3 grid-rows-5 gap-2 sm:gap-3 mx-auto shrink-0";

        // Define Zones
        const zones = [
            { accept: 'fan', label: 'Fan Mount 1', area: 'col-span-1 row-span-1' },
            { accept: 'fan2', label: 'Fan Mount 2', area: 'col-span-1 row-span-1 col-start-3' },
            { accept: 'liquid', label: 'Liquid Radiator', area: 'col-span-3 row-span-1 row-start-2' },
            { accept: 'psu', label: 'PSU Bay', area: 'col-span-1 row-span-1 row-start-5' },

            // Mobo Group
            {
                accept: 'cpu', label: 'CPU Socket', area: 'col-start-2 row-start-3 h-16',
                inner: true, parentArea: 'col-span-2 row-span-3 col-start-2 row-start-3 border border-slate-800 bg-slate-900/80 rounded-lg p-2 grid grid-cols-2 gap-2'
            },
            { accept: 'ram', label: 'DIMM Slots', area: 'h-16', inner: true },
            { accept: 'gpu', label: 'PCIe x16', area: 'h-12 col-span-2', inner: true },
            { accept: 'nic', label: 'PCIe x1', area: 'h-10', inner: true },
            { accept: 'audio', label: 'Audio Header', area: 'h-10', inner: true },
            { accept: 'storage', label: 'M.2 Slot', area: 'h-10', inner: true },
        ];

        board.innerHTML = `
            <!-- Top Fans -->
            ${this.renderDropZone('fan', 'Fan Mount 1', 'col-span-1 row-span-1')}
            <div class="col-span-1 row-span-1 text-center flex items-center justify-center opacity-20">
                <iconify-icon icon="solar:monitor-smartphone-bold" class="text-4xl"></iconify-icon>
            </div>
            ${this.renderDropZone('fan2', 'Fan Mount 2', 'col-span-1 row-span-1')}
            
            <!-- Radiator -->
            ${this.renderDropZone('liquid', 'Liquid Radiator', 'col-span-3 row-span-1 bg-slate-900/30')}
            
            <!-- Main Board Area -->
            <div class="col-span-3 row-span-2 border-2 border-indigo-900/30 bg-indigo-900/10 rounded-lg p-3 relative">
                <div class="absolute -top-3 left-2 bg-slate-950 px-2 text-[10px] text-indigo-400 font-mono uppercase">Motherboard</div>
                
                <div class="grid grid-cols-2 gap-3 h-full">
                    ${this.renderDropZone('cpu', 'CPU Socket', 'row-span-1')}
                    ${this.renderDropZone('ram', 'DIMM Slots', 'row-span-1')}
                    
                    ${this.renderDropZone('storage', 'M.2 SSD', 'col-span-2 h-10')}
                    ${this.renderDropZone('gpu', 'PCIe x16 GPU', 'col-span-2 h-12')}
                    
                    ${this.renderDropZone('nic', 'PCIe x1 Net', 'col-span-1')}
                    ${this.renderDropZone('audio', 'Audio HD', 'col-span-1')}
                </div>
            </div>

            <!-- Bottom: PSU -->
            <div class="col-span-2 row-span-1"></div>
            ${this.renderDropZone('psu', 'PSU Bay', 'col-span-1 row-span-1 bg-slate-800/30')}
        `;

        schematicWrapper.appendChild(board);

        const schematicCard = new Card({
            title: "System Schematic",
            subtitle: "Assembly Phase: " + (this.currentPhase + 1),
            content: schematicWrapper,
            variant: 'glass',
            customClass: 'w-full lg:w-2/3 flex flex-col'
        });

        // Append All
        layout.appendChild(trayCard.render());
        layout.appendChild(schematicCard.render());

        const instructionFeedback = new Feedback({
            title: "Assembly Protocol",
            message: "Install core components (CPU, RAM, M.2) before coolers and peripherals.",
            type: "neutral"
        });

        this.container.appendChild(header.render());
        this.container.appendChild(instructionFeedback.render());
        this.container.appendChild(layout);

        this.attachEvents();
    },

    renderDropZone(accept, label, classes = '') {
        return `
            <div class="drop-zone border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-lg flex flex-col items-center justify-center transition-all ${classes}" 
                data-accept="${accept}" data-label="${label}">
                <span class="text-[9px] font-bold text-slate-500 uppercase pointer-events-none text-center px-1">${label}</span>
            </div>
        `;
    },

    attachEvents() {
        // Drag Events managed in render() for sources.
        const zones = this.container.querySelectorAll('.drop-zone');

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!zone.classList.contains('occupied')) {
                    zone.classList.add('hover');
                }
            });

            zone.addEventListener('dragleave', () => zone.classList.remove('hover'));

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('hover');

                const type = e.dataTransfer.getData('type');
                const label = e.dataTransfer.getData('label');

                if (type && !zone.classList.contains('occupied')) {
                    this.handleDrop(zone, type, label);
                }
            });
        });
    },

    handleDrop(zone, type, label) {
        // 1. Check compatibility (Silent Reject)
        const accepted = zone.dataset.accept;
        if (accepted !== type) {
            this.shakeElement(zone);
            return;
        }

        // 2. Check Order (Phase restriction) (Silent Reject)
        const allowedParts = this.installOrder[this.currentPhase];
        if (!allowedParts.includes(type)) {
            this.shakeElement(zone);
            return;
        }

        // 3. Success Placement
        this.placeItem(zone, type, label);
    },

    shakeElement(el) {
        el.classList.add('animate-shake');
        setTimeout(() => el.classList.remove('animate-shake'), 500);
    },

    placeItem(zone, type, label) {
        zone.classList.add('occupied', 'border-emerald-500/50', 'bg-emerald-500/10');
        zone.classList.remove('border-dashed', 'border-slate-700');

        // Visual
        const partInfo = this.parts.find(p => p.id === type);
        zone.innerHTML = `
            <div class="animate-fade-in flex flex-col items-center justify-center text-emerald-400">
                <iconify-icon icon="${partInfo.icon}" class="text-2xl"></iconify-icon>
                <span class="text-[8px] font-bold uppercase mt-1">${label}</span>
            </div>
        `;

        // Hide from tray
        const dragger = this.container.querySelector(`.draggable-item[data-type="${type}"]`);
        if (dragger) {
            dragger.classList.add('hidden');
        }

        // Record
        this.placements.push(type);
        this.placedItems++;

        // Check Phase Completion
        const currentPhaseParts = this.installOrder[this.currentPhase];
        const allPhasePartsPlaced = currentPhaseParts.every(p => this.placements.includes(p));

        if (allPhasePartsPlaced) {
            if (this.currentPhase < this.installOrder.length - 1) {
                this.currentPhase++;
            } else {
                setTimeout(() => this.finishLevel(), 1000);
            }
        }
    },

    finishLevel() {
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, (90 - elapsedSec) * 10);

        // Generate Detailed Results for Summary Screen
        const detailedResults = [
            { question: "Component Assembly Sequence", selected: "Correct Order", correct: "Correct Order", isCorrect: true },
            { question: "Thermal Paste Application", selected: "Applied", correct: "Applied", isCorrect: true }, // Flavor
            { question: "Cable Management", selected: "Optimized", correct: "Optimized", isCorrect: true }
        ];

        this.game.completeLevel({
            success: true,
            score: 1000 + timeBonus,
            xp: 500,
            accuracy: 100,
            timeBonus: timeBonus,
            detailedResults: detailedResults
        });
    }
};
