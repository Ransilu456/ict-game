/**
 * Level 1: Hardware Basics
 * Objective: Assemble the PC components correctly.
 * Refactored for Component Architecture & Delayed Feedback
 */

import GameButton from '../components/GameButton.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.placedItems = 0;
        this.totalItems = 10;
        this.startTime = Date.now();
        this.placements = []; // Store { question: "CPU Slot", given: "CPU", correct: "CPU", isCorrect: true }

        this.render();
        this.attachEvents();
    },

    render() {
        this.container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in h-full">
                
                <!-- Header -->
                <div class="text-center shrink-0">
                    <h2 class="text-3xl font-bold text-white mb-2">${this.game.getText('L1_TITLE')}</h2>
                    <p class="text-slate-400 max-w-2xl mx-auto">${this.game.getText('L1_DESC')}</p>
                </div>

                <div class="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
                    
                    <!-- Parts Tray -->
                    <div class="w-full lg:w-1/3 flex flex-col gap-4">
                        <div class="glass-panel p-4 rounded-xl border border-indigo-500/30 overflow-y-auto max-h-[600px] flex-1">
                            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Industrial Tray</h3>
                            <div class="grid grid-cols-2 gap-3" id="parts-tray">
                                ${this.renderDraggable('cpu', 'solar:cpu-bold', 'indigo', 'CPU')}
                                ${this.renderDraggable('ram', 'solar:ssd-square-bold', 'emerald', 'RAM')}
                                ${this.renderDraggable('gpu', 'solar:videocamera-record-bold', 'rose', 'GPU')}
                                ${this.renderDraggable('storage', 'solar:server-square-bold', 'amber', 'SSD')}
                                ${this.renderDraggable('psu', 'solar:bolt-circle-bold', 'yellow', 'PSU')}
                                ${this.renderDraggable('fan', 'solar:wind-bold', 'sky', 'FAN 1')}
                                ${this.renderDraggable('fan2', 'solar:wind-bold', 'sky', 'FAN 2')}
                                ${this.renderDraggable('nic', 'solar:globus-bold', 'blue', 'NETWORK')}
                                ${this.renderDraggable('audio', 'solar:music-note-bold', 'purple', 'AUDIO')}
                                ${this.renderDraggable('liquid', 'solar:water-drops-bold', 'cyan', 'LIQUID')}
                            </div>
                        </div>
                    </div>

                    <!-- Motherboard / Case Area -->
                    <div class="w-full lg:w-2/3 flex flex-col">
                        <div class="glass-panel p-6 rounded-xl border border-slate-700 flex-1 relative bg-slate-900/50 flex items-center justify-center overflow-auto">
                            
                            <!-- Schematic View -->
                            <div class="relative w-full max-w-lg aspect-[3/4] border-4 border-slate-800 rounded-xl bg-slate-950 shadow-2xl p-4 grid grid-cols-3 grid-rows-5 gap-3">
                                
                                ${this.renderDropZone('fan', 'Fan Mount 1', 'col-span-1 row-span-1')}
                                ${this.renderDropZone('fan2', 'Fan Mount 2', 'col-span-1 row-span-1 col-start-3')}
                                ${this.renderDropZone('liquid', 'Liquid Radiator', 'col-span-3 row-span-1 row-start-2')}
                                ${this.renderDropZone('psu', 'PSU Bay', 'col-span-1 row-span-1 row-start-5')}

                                <!-- Motherboard Area -->
                                <div class="col-span-2 row-span-3 col-start-2 row-start-3 border border-slate-700 bg-slate-900/40 rounded-lg p-2 grid grid-cols-2 gap-2">
                                    ${this.renderDropZone('cpu', 'CPU Socket', 'h-16')}
                                    ${this.renderDropZone('ram', 'DIMM Slots', 'h-16')}
                                    ${this.renderDropZone('gpu', 'PCIe x16', 'h-10')}
                                    ${this.renderDropZone('nic', 'PCIe x1', 'h-10')}
                                    ${this.renderDropZone('audio', 'Audio Header', 'h-10')}
                                    ${this.renderDropZone('storage', 'SATA Port', 'h-10')}
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
            
            <style>
                .drop-zone.hover {
                    border-color: #6366f1;
                    background-color: rgba(99, 102, 241, 0.1);
                }
                .drop-zone.occupied {
                    border-color: #475569; /* Neutral Slate */
                    background-color: rgba(30, 41, 59, 0.5);
                }
            </style>
        `;
    },

    renderDraggable(type, icon, color, label) {
        return `
            <div class="draggable-item" draggable="true" data-type="${type}" data-label="${label}">
                <div class="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-grab text-center transition-all active:scale-95">
                    <iconify-icon icon="${icon}" class="text-2xl text-${color}-400 mb-1"></iconify-icon>
                    <div class="text-[9px] font-bold text-slate-300">${label}</div>
                </div>
            </div>
        `;
    },

    renderDropZone(accept, label, extraClass = '') {
        return `
            <div class="drop-zone border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center transition-all ${extraClass}" data-accept="${accept}" data-label="${label}">
                <span class="text-[8px] text-slate-600 font-bold uppercase pointer-events-none">${label}</span>
            </div>
        `;
    },

    attachEvents() {
        const draggables = this.container.querySelectorAll('.draggable-item');
        const zones = this.container.querySelectorAll('.drop-zone');

        draggables.forEach(drag => {
            drag.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', e.target.dataset.type);
                e.dataTransfer.setData('label', e.target.dataset.label);
                setTimeout(() => drag.classList.add('opacity-50'), 0);
            });

            drag.addEventListener('dragend', (e) => {
                drag.classList.remove('opacity-50');
            });
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!zone.classList.contains('occupied')) {
                    zone.classList.add('hover');
                }
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('hover');
            });

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
        // Mark as occupied (Neutral visual feedback)
        zone.classList.add('occupied');
        zone.innerHTML = `
            <div class="flex flex-col items-center justify-center text-slate-300 animate-fade-in">
                <iconify-icon icon="solar:box-minimalistic-bold" class="text-xl"></iconify-icon>
                <span class="text-[8px] font-bold uppercase">${label}</span>
            </div>
        `;

        // Record placement (Silently)
        const expected = zone.dataset.accept;
        const expectedLabel = zone.dataset.label;

        this.placements.push({
            question: `Slot: ${expectedLabel}`,
            selected: label,
            correct: expected, // We'll map this to a pretty name in finish if needed, or just use type
            isCorrect: expected === type,
            originalType: type
        });

        // Hide from tray
        const dragger = this.container.querySelector(`.draggable-item[data-type="${type}"]`);
        if (dragger) {
            dragger.remove();
        }

        this.placedItems++;

        // Check completion
        if (this.placedItems >= this.totalItems) {
            setTimeout(() => this.finishLevel(), 500);
        }
    },

    finishLevel() {
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, (60 - elapsedSec) * 10);

        // Process Results
        const correctCount = this.placements.filter(p => p.isCorrect).length;
        const accuracy = Math.round((correctCount / this.totalItems) * 100);
        const success = accuracy >= 100; // Strict pass for this level? Or > 80? Let's say 100 for "Hardware Basics" or >= 80.
        // Prompt says "Difficulty: Lethal" in original code, but let's be fair.
        // Original code penalized -250 for error.

        // Map "correct" values to human readable for display
        const readablePlacements = this.placements.map(p => ({
            ...p,
            correct: p.correct.toUpperCase(), // Simple capitalization for now
            question: p.question
        }));

        this.game.completeLevel({
            success: accuracy >= 100, // Strict
            score: (correctCount * 100) + (accuracy >= 100 ? timeBonus : 0),
            xp: correctCount * 50,
            accuracy: accuracy,
            timeBonus: timeBonus,
            detailedResults: readablePlacements
        });
    }
};
