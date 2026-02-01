/**
 * Level 1: Hardware Basics
 * Objective: Assemble the PC components correctly.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.placedItems = 0;
        this.totalItems = 4;
        this.startTime = Date.now();

        this.render();
        this.attachEvents();
    },

    render() {
        this.container.innerHTML = `
            <h2>MISSION: ASSEMBLE ARCHITECTURE</h2>
            <p>Drag the hardware components to their correct slots on the motherboard.</p>
            
            <div class="pc-build-area">
                <!-- Parts Tray -->
                <div class="parts-tray">
                    <h3>COMPONENTS</h3>
                    <div class="draggable-item" draggable="true" data-type="cpu">
                        ⚡ CPU (Processor)
                    </div>
                    <div class="draggable-item" draggable="true" data-type="ram">
                        💾 RAM (Memory)
                    </div>
                    <div class="draggable-item" draggable="true" data-type="gpu">
                        🎮 GPU (Graphics)
                    </div>
                    <div class="draggable-item" draggable="true" data-type="storage">
                        💿 SSD (Storage)
                    </div>
                </div>

                <!-- Computer Case / Motherboard View -->
                <div class="computer-case" id="drop-target-area">
                    <!-- Drop Zones -->
                    
                    <!-- CPU Socket -->
                    <div class="drop-zone" data-accept="cpu" style="
                        top: 20%; left: 40%; width: 100px; height: 100px;
                    ">
                        SOCKET
                    </div>

                    <!-- RAM Slots -->
                    <div class="drop-zone" data-accept="ram" style="
                        top: 20%; left: 60%; width: 40px; height: 120px;
                    ">
                        DIMM
                    </div>

                    <!-- GPU Slot -->
                    <div class="drop-zone" data-accept="gpu" style="
                        top: 50%; left: 30%; width: 250px; height: 40px;
                    ">
                        PCIe X16
                    </div>

                    <!-- Storage Bay -->
                    <div class="drop-zone" data-accept="storage" style="
                        bottom: 10%; right: 10%; width: 80px; height: 120px;
                    ">
                        SATA BAY
                    </div>
                </div>
            </div>
        `;
    },

    attachEvents() {
        const draggables = this.container.querySelectorAll('.draggable-item');
        const zones = this.container.querySelectorAll('.drop-zone');

        draggables.forEach(drag => {
            drag.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.type);
                e.target.classList.add('dragging');
            });

            drag.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault(); // Allow drop
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
                this.handleDrop(zone, type);
            });
        });
    },

    handleDrop(zone, type) {
        if (zone.classList.contains('occupied')) return;

        if (zone.dataset.accept === type) {
            // Correct Drop
            zone.classList.add('occupied', 'correct');
            zone.innerHTML = `✅ ${type.toUpperCase()}`;

            // Remove from tray (find the dragging element)
            const dragger = this.container.querySelector(`.draggable-item[data-type="${type}"]`);
            if (dragger) dragger.remove();

            this.placedItems++;
            this.game.showFeedback('SYSTEM INTEGRITY INCREASING', `Component [${type.toUpperCase()}] installed successfully.`);

            if (this.placedItems >= this.totalItems) {
                this.finishLevel();
            }
        } else {
            // Incorrect Drop
            this.game.showFeedback('COMPATIBILITY ERROR', `Hardware mismatch! [${type.toUpperCase()}] cannot fit into [${zone.dataset.accept.toUpperCase()}] slot.`);
            // Penalize score?
            this.game.gameState.score -= 50;
            this.game.updateHUD();
        }
    },

    finishLevel() {
        const endTime = Date.now();
        const duration = Math.floor((endTime - this.startTime) / 1000);
        const timeBonus = Math.max(0, 600 - duration * 10); // Simple time bonus

        setTimeout(() => {
            this.game.completeLevel({
                success: true,
                score: 1000 + timeBonus,
                xp: 500,
                accuracy: 100, // Simplification for MVP
                timeBonus: timeBonus
            });
        }, 1500);
    }
};
