/**
 * Level 1: Hardware Basics
 * Objective: Assemble the PC components correctly.
 * Refactored for Dashboard UI + Tailwind
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.placedItems = 0;
        this.totalItems = 6;
        this.startTime = Date.now();

        this.render();
        this.attachEvents();
    },

    render() {
        this.container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in">
                
                <!-- Header -->
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-white mb-2">${this.game.getText('L1_TITLE')}</h2>
                    <p class="text-slate-400 max-w-2xl mx-auto">${this.game.getText('L1_DESC')}</p>
                </div>

                <div class="flex flex-col lg:flex-row gap-8">
                    
                    <!-- Parts Tray -->
                    <div class="w-full lg:w-1/3 flex flex-col gap-4">
                        <div class="glass-panel p-4 rounded-xl border border-indigo-500/30">
                            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Component Tray</h3>
                            <div class="grid grid-cols-2 gap-3" id="parts-tray">
                                <div class="draggable-item" draggable="true" data-type="cpu">
                                    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing text-center">
                                        <iconify-icon icon="solar:cpu-bold" class="text-3xl text-indigo-400 mb-2"></iconify-icon>
                                        <div class="text-xs font-bold text-slate-300">CPU</div>
                                    </div>
                                </div>
                                <div class="draggable-item" draggable="true" data-type="ram">
                                    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing text-center">
                                        <iconify-icon icon="solar:ssd-square-bold" class="text-3xl text-emerald-400 mb-2"></iconify-icon>
                                        <div class="text-xs font-bold text-slate-300">RAM</div>
                                    </div>
                                </div>
                                <div class="draggable-item" draggable="true" data-type="gpu">
                                    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing text-center">
                                        <iconify-icon icon="solar:videocamera-record-bold" class="text-3xl text-rose-400 mb-2"></iconify-icon>
                                        <div class="text-xs font-bold text-slate-300">GPU</div>
                                    </div>
                                </div>
                                <div class="draggable-item" draggable="true" data-type="storage">
                                    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing text-center">
                                        <iconify-icon icon="solar:server-square-bold" class="text-3xl text-amber-400 mb-2"></iconify-icon>
                                        <div class="text-xs font-bold text-slate-300">SSD</div>
                                    </div>
                                </div>
                                <div class="draggable-item" draggable="true" data-type="psu">
                                    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing text-center">
                                        <iconify-icon icon="solar:bolt-circle-bold" class="text-3xl text-yellow-400 mb-2"></iconify-icon>
                                        <div class="text-xs font-bold text-slate-300">Power</div>
                                    </div>
                                </div>
                                <div class="draggable-item" draggable="true" data-type="fan">
                                    <div class="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing text-center">
                                        <iconify-icon icon="solar:wind-bold" class="text-3xl text-sky-400 mb-2"></iconify-icon>
                                        <div class="text-xs font-bold text-slate-300">Cooling</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Motherboard / Case Area -->
                    <div class="w-full lg:w-2/3 flex flex-col">
                        <div class="glass-panel p-6 rounded-xl border border-slate-700 flex-1 relative bg-slate-900/50 flex items-center justify-center">
                            
                            <!-- Schematic View -->
                            <div class="relative w-full max-w-md aspect-[3/4] border-4 border-slate-800 rounded-xl bg-slate-900 shadow-2xl p-4 grid grid-cols-2 grid-rows-4 gap-4">
                                
                                <!-- Fan (Top Left) -->
                                <div class="drop-zone col-span-1 row-span-1 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center transition-all bg-slate-800/30" data-accept="fan">
                                    <span class="text-xs text-slate-600 font-bold uppercase pointer-events-none">Cooling Mount</span>
                                </div>
                                
                                <!-- PSU (Bottom Left) -->
                                <div class="drop-zone col-span-1 row-span-1 row-start-4 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center transition-all bg-slate-800/30" data-accept="psu">
                                    <span class="text-xs text-slate-600 font-bold uppercase pointer-events-none">PSU Bay</span>
                                </div>

                                <!-- Motherboard Area (Span Right) -->
                                <div class="col-span-1 row-span-4 col-start-2 border border-slate-700 bg-slate-800/20 rounded-lg p-2 flex flex-col gap-2">
                                    <div class="text-[10px] text-slate-500 text-center uppercase">Motherboard</div>
                                    
                                    <!-- CPU -->
                                    <div class="drop-zone h-24 border-2 border-dashed border-slate-600 rounded flex items-center justify-center transition-all" data-accept="cpu">
                                        <span class="text-[10px] text-slate-500 font-bold uppercase pointer-events-none">CPU Socket</span>
                                    </div>
                                    
                                    <!-- RAM -->
                                    <div class="drop-zone h-32 border-2 border-dashed border-slate-600 rounded flex items-center justify-center transition-all" data-accept="ram">
                                        <span class="text-[10px] text-slate-500 font-bold uppercase pointer-events-none vertical-text">DIMM Slots</span>
                                    </div>

                                    <!-- GPU -->
                                    <div class="drop-zone h-16 border-2 border-dashed border-slate-600 rounded flex items-center justify-center transition-all" data-accept="gpu">
                                        <span class="text-[10px] text-slate-500 font-bold uppercase pointer-events-none">PCI-E Slot</span>
                                    </div>

                                    <!-- Storage -->
                                    <div class="drop-zone h-16 border-2 border-dashed border-slate-600 rounded flex items-center justify-center transition-all mt-auto" data-accept="storage">
                                        <span class="text-[10px] text-slate-500 font-bold uppercase pointer-events-none">SATA</span>
                                    </div>
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
                    border-color: #10b981;
                    background-color: rgba(16, 185, 129, 0.1);
                }
                .drop-zone.correct {
                    border-color: #10b981;
                }
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            </style>
        `;
    },

    attachEvents() {
        // Since we re-render, dragging refs need to be fresh
        const draggables = this.container.querySelectorAll('.draggable-item');
        const zones = this.container.querySelectorAll('.drop-zone');

        draggables.forEach(drag => {
            drag.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.type);
                // Visual feedback
                setTimeout(() => drag.classList.add('opacity-50'), 0);
            });

            drag.addEventListener('dragend', (e) => {
                drag.classList.remove('opacity-50');
            });
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault(); // Required for drop
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

                const type = e.dataTransfer.getData('text/plain');
                if (type) this.handleDrop(zone, type);
            });
        });
    },

    handleDrop(zone, type) {
        if (zone.classList.contains('occupied')) return;

        if (zone.dataset.accept === type) {
            // Correct
            zone.classList.add('occupied', 'correct');
            zone.innerHTML = `
                <div class="flex flex-col items-center justify-center text-emerald-400 animate-pulse">
                    <iconify-icon icon="solar:check-circle-bold" class="text-2xl"></iconify-icon>
                    <span class="text-[10px] font-bold uppercase">${type}</span>
                </div>
            `;

            // Remove from tray
            const dragger = this.container.querySelector(`.draggable-item[data-type="${type}"]`);
            if (dragger) {
                dragger.style.visibility = 'hidden'; // Hide instead of remove to keep grid stable? Or remove.
                dragger.remove();
            }

            this.placedItems++;
            this.game.showFeedback(this.game.getText('L1_MSG_SUCCESS') || 'INSTALLED', `${type.toUpperCase()} module integrated successfully.`);

            if (this.placedItems >= this.totalItems) {
                this.finishLevel();
            }
        } else {
            // Incorrect
            this.game.showFeedback(this.game.getText('L1_MSG_ERR_TITLE') || 'ERROR', this.game.getText('L1_MSG_ERR_BODY') || 'Incompatible Interface selected.');
            this.game.gameState.score = Math.max(0, this.game.gameState.score - 50);
            this.game.updateHUD();
        }
    },

    finishLevel() {
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, (60 - elapsedSec) * 10);

        this.game.completeLevel({
            success: true,
            score: 1000 + timeBonus,
            xp: 500,
            accuracy: 100,
            timeBonus: timeBonus
        });
    }
};
