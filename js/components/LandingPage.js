import GameButton from './GameButton.js';

export default class LandingPage {
    constructor(game) {
        this.game = game;
    }

    render() {
        const hasSession = !!this.game.gameState.playerName;

        // Return container structure
        const container = document.createElement('div');
        container.className = "flex flex-col items-center justify-center h-screen w-full relative overflow-hidden bg-slate-950 bg-noise";

        container.innerHTML = `
            <!-- Ambient Background -->
            <div class="absolute inset-0 z-0">
                <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div class="z-10 flex flex-col items-center gap-12 max-w-lg w-full p-6 animate-fade-in text-center">
                
                <div class="flex flex-col items-center gap-4">
                    <div class="flex items-center gap-3">
                        <div class="h-px w-8 bg-slate-700"></div>
                        <span class="text-[10px] font-bold text-indigo-400 tracking-[0.5em] uppercase">System Access</span>
                        <div class="h-px w-8 bg-slate-700"></div>
                    </div>
                    
                    <h1 class="text-6xl font-black text-white tracking-tighter m-0 drop-shadow-2xl">
                        ICT QUEST
                    </h1>
                    
                    <p class="text-slate-400 text-sm leading-relaxed max-w-md">
                        Master the fundamentals of computing, networking, and logic in this interactive simulation.
                    </p>
                </div>

                <div class="flex flex-col gap-4 w-full" id="lp-actions">
                    <!-- Buttons Injected via JS -->
                </div>

                <div class="mt-8 flex gap-6 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    <span>v3.0.0 Stable</span>
                    <span>Server: Online</span>
                </div>
            </div>
        `;

        // Inject Buttons using Component
        const actionContainer = container.querySelector('#lp-actions');

        if (hasSession) {
            const resumeBtn = new GameButton({
                text: `Resume as ${this.game.gameState.playerName}`,
                variant: 'primary',
                size: 'lg',
                icon: 'solar:user-circle-bold',
                customClass: 'w-full shadow-xl shadow-indigo-500/10',
                onClick: () => this.game.startGame(true)
            });

            const newBtn = new GameButton({
                text: "Start New Session",
                variant: 'ghost',
                size: 'sm',
                onClick: () => {
                    this.game.gameState.playerName = '';
                    this.game.gameState.xp = 0;
                    this.game.gameState.score = 0;
                    this.game.gameState.maxLevel = 1;
                    this.game.saveData();
                    this.game.showScreen('intro');
                }
            });

            actionContainer.appendChild(resumeBtn.render());
            actionContainer.appendChild(newBtn.render());
        } else {
            const startBtn = new GameButton({
                text: "Initialize System",
                variant: 'primary',
                size: 'lg',
                icon: 'solar:power-bold',
                customClass: 'w-full shadow-xl shadow-indigo-500/10',
                onClick: () => this.game.showScreen('intro')
            });
            actionContainer.appendChild(startBtn.render());
        }

        // Since app.js expects a STRING return from render normally for innerHTML injection (legacy),
        // we might break things if app.js does `container.innerHTML = landingPage.render()`.
        // Let's check app.js usage.
        // app.js: this.landingPage = new LandingPage(this); ... this.showLanding() { ... this.landingContainer.innerHTML = this.landingPage.render(); attachEvents... }
        // So yes, it expects a string.
        // But my GameButton returns a DOM Element.
        // I can return container.outerHTML but events will be lost.
        // Refactoring: I should change app.js to handle DOM nodes or make LandingPage handle its own rendering into a container.

        // Workaround compliant with current app.js structure:
        // Return string, but I can't easily Serialize the GameButton events.
        // I must change `app.js` or `LandingPage` structure.

        // CHANGE STRATEGY: 
        // I will return a placeholder string, and use `attachEvents` to render the buttons into the placeholder.
        // app.js calls `attachEvents` AFTER rendering HTML.

        // But `LandingPage.render` creates the buttons.

        // Let's modify the `render` to just return the HTML structure, and move button creation to `attachEvents` or a new `setup` method.
        // app.js calls `this.landingPage.attachEvents(this.landingContainer)`.

        return container.outerHTML;
    }

    attachEvents(container) {
        // Clear buttons placeholder if any (re-render logic)
        const actionContainer = container.querySelector('#lp-actions');
        if (!actionContainer) return;
        actionContainer.innerHTML = '';

        const hasSession = !!this.game.gameState.playerName;

        if (hasSession) {
            const resumeBtn = new GameButton({
                text: `Resume as ${this.game.gameState.playerName}`,
                variant: 'primary',
                size: 'lg',
                icon: 'solar:user-circle-bold',
                customClass: 'w-full shadow-xl shadow-indigo-500/10',
                onClick: () => this.game.startGame(true)
            });

            const newBtn = new GameButton({
                text: "Start New Session",
                variant: 'ghost',
                size: 'sm',
                onClick: () => {
                    this.game.gameState.playerName = '';
                    this.game.gameState.xp = 0;
                    this.game.gameState.score = 0;
                    this.game.gameState.maxLevel = 1;
                    this.game.saveData();
                    this.game.showScreen('intro');
                }
            });

            actionContainer.appendChild(resumeBtn.render());
            actionContainer.appendChild(newBtn.render());
        } else {
            const startBtn = new GameButton({
                text: "Initialize System",
                variant: 'primary',
                size: 'lg',
                icon: 'solar:power-bold',
                customClass: 'w-full shadow-xl shadow-indigo-500/10',
                onClick: () => this.game.showScreen('intro')
            });
            actionContainer.appendChild(startBtn.render());
        }
    }
}
