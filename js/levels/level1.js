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
            <h2>${this.game.getText('L1_TITLE')}</h2>
            <p>${this.game.getText('L1_DESC')}</p>
            
            <div class="pc-build-area">
                <!-- Parts Tray -->
                <div class="parts-tray">
                    <h3>${this.game.getText('L1_TRAY_TITLE')}</h3>
                    <div class="draggable-item" draggable="true" data-type="cpu">
                        ${this.game.getText('L1_ITEM_CPU')}
                    </div>
                    <div class="draggable-item" draggable="true" data-type="ram">
                        ${this.game.getText('L1_ITEM_RAM')}
                    </div>
                    <div class="draggable-item" draggable="true" data-type="gpu">
                        ${this.game.getText('L1_ITEM_GPU')}
                    </div>
                    <div class="draggable-item" draggable="true" data-type="storage">
                        ${this.game.getText('L1_ITEM_SSD')}
                    </div>
                </div>

                <!-- Computer Case / Motherboard View -->
                <div class="computer-case" id="drop-target-area">
                    <!-- Drop Zones -->
                    
                    <!-- CPU Socket -->
                    <div class="drop-zone" data-accept="cpu" style="
                        top: 20%; left: 40%; width: 100px; height: 100px;
                    ">
                        ${this.game.getText('L1_ZONE_SOCKET')}
                    </div>

                    <!-- RAM Slots -->
                    <div class="drop-zone" data-accept="ram" style="
                        top: 20%; left: 60%; width: 40px; height: 120px;
                    ">
                        ${this.game.getText('L1_ZONE_DIMM')}
                    </div>

                    <!-- GPU Slot -->
                    <div class="drop-zone" data-accept="gpu" style="
                        top: 50%; left: 30%; width: 250px; height: 40px;
                    ">
                        ${this.game.getText('L1_ZONE_PCIE')}
                    </div>

                    <!-- Storage Bay -->
                    <div class="drop-zone" data-accept="storage" style="
                        bottom: 10%; right: 10%; width: 80px; height: 120px;
                    ">
                        ${this.game.getText('L1_ZONE_SATA')}
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
            // Assuming type matches key suffix for nice display, or just show type
            // To be proper, we probably want localized item names, but existing logic uses 'type' string.
            // Let's keep it simple: "CPU" etc are universal enough or we can map them.
            zone.innerHTML = `✅ ${type.toUpperCase()}`;

            // Remove from tray (find the dragging element)
            const dragger = this.container.querySelector(`.draggable-item[data-type="${type}"]`);
            if (dragger) dragger.remove();

            this.placedItems++;
            // Title: System Integrity? We don't have a key for that yet. Let's use a generic success title or add to LANG.
            // For now, using 'L1_MSG_SUCCESS' for body. Title can be hardcoded or new key.
            // Let's use "SYSTEM" for title.
            this.game.showFeedback('SYSTEM', this.game.getText('L1_MSG_SUCCESS'));

            if (this.placedItems >= this.totalItems) {
                this.finishLevel();
            }
        } else {
            // Incorrect Drop
            this.game.showFeedback(this.game.getText('L1_MSG_ERR_TITLE'), this.game.getText('L1_MSG_ERR_BODY'));
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
