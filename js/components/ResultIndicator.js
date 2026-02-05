export default class ResultIndicator {
    /**
     * @param {Object} props
     * @param {boolean} props.isCorrect
     * @param {string} [props.message]
     */
    constructor({ isCorrect, message }) {
        this.isCorrect = isCorrect;
        this.message = message;
    }

    render() {
        const div = document.createElement('div');
        const color = this.isCorrect ? 'emerald' : 'rose';
        const icon = this.isCorrect ? 'solar:check-circle-bold' : 'solar:danger-circle-bold';

        div.className = `fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in`;

        div.innerHTML = `
            <div class="glass-panel px-6 py-3 rounded-full border border-${color}-500/30 flex items-center gap-3 shadow-2xl bg-slate-950/80 backdrop-blur-xl">
                <iconify-icon icon="${icon}" class="text-2xl text-${color}-400"></iconify-icon>
                <span class="text-sm font-bold text-white uppercase tracking-widest">${this.message || (this.isCorrect ? 'Correct!' : 'Incorrect')}</span>
            </div>
        `;

        // Auto remove
        setTimeout(() => {
            div.classList.replace('animate-bounce-in', 'animate-fade-out');
            setTimeout(() => div.remove(), 500);
        }, 2000);

        return div;
    }

    show() {
        const el = this.render();
        document.body.appendChild(el);
    }
}
