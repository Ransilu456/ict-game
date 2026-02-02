/**
 * Base class for all Tech Lab simulations.
 */
export default class LabSimulation {
    constructor(container, stats, device) {
        this.container = container;
        this.stats = stats;
        this.device = device;
        this.controls = {};
    }

    init() {
        this.cacheControls();
        this.attachEvents();
        this.update();
    }

    cacheControls() {
        // To be implemented by subclasses
    }

    attachEvents() {
        // To be implemented by subclasses
    }

    update() {
        // To be implemented by subclasses
    }

    renderControls() {
        return '';
    }

    renderVisuals() {
        return `<div id="canvas-root" class="w-full h-full flex items-center justify-center"></div>`;
    }
}
