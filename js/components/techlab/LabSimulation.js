/**
 * Base class for all Tech Lab simulations.
 */
export default class LabSimulation {
    constructor(container, stats, device) {
        this.container = container;
        this.stats = stats;
        this.device = device;
        this.controls = {};
        this.view = 'functional'; // Default view
    }

    init() {
        this.cacheControls();
        this.attachEvents();
        this.update();
    }

    cacheControls() {
        // Subclasses should call super.cacheControls() if they use standard view-toggle
        this.controls.viewBtns = document.querySelectorAll('.view-btn');
    }

    attachEvents() {
        // Subclasses should call super.attachEvents() if they use standard view-toggle
        if (this.controls.viewBtns) {
            this.controls.viewBtns.forEach(btn => {
                btn.onclick = () => {
                    this.view = btn.dataset.view;
                    this.updateViewToggleUI();
                    this.update();
                };
            });
        }
    }

    updateViewToggleUI() {
        if (this.controls.viewBtns) {
            this.controls.viewBtns.forEach(btn => {
                const active = btn.dataset.view === this.view;
                btn.classList.toggle('bg-indigo-600', active);
                btn.classList.toggle('text-white', active);
                btn.classList.toggle('bg-slate-800', !active);
                btn.classList.toggle('text-slate-400', !active);
            });
        }
    }

    renderViewToggle() {
        return `
            <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3 text-center">Simulation View</label>
                <div class="flex gap-2">
                    <button class="view-btn w-full p-2 rounded-lg bg-indigo-600 text-white border border-slate-700 text-[9px] font-black uppercase tracking-wider transition-all" data-view="functional">Functional</button>
                    <button class="view-btn w-full p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-black uppercase tracking-wider transition-all" data-view="circuitry">Circuitry</button>
                </div>
            </div>
        `;
    }

    update() {
        // To be implemented by subclasses
    }

    renderControls() {
        return this.renderViewToggle();
    }

    renderVisuals() {
        return `<div id="canvas-root" class="w-full h-full flex items-center justify-center"></div>`;
    }
}
