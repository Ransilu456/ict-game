export default class QuestionCard {
    /**
     * @param {Object} props
     * @param {string} props.question - Question text
     * @param {Array} props.options - Array of { id, text, isCorrect } (isCorrect hidden from view logic)
     * @param {Function} props.onSelect - Callback(optionId)
     * @param {string} props.selectedId - Currently selected option ID
     */
    constructor({ question, options, onSelect, selectedId }) {
        this.question = question;
        this.options = options;
        this.onSelect = onSelect;
        this.selectedId = selectedId;
        this.id = `q-card-${Math.random().toString(36).substr(2, 9)}`;
    }

    render() {
        const optionsHtml = this.options.map(opt => {
            const isSelected = this.selectedId === opt.id;
            const baseClass = "w-full p-4 rounded-lg border text-left transition-all duration-200 flex items-center justify-between group relative overflow-hidden";
            const activeClass = isSelected
                ? "bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-200";

            return `
                <button class="option-btn ${baseClass} ${activeClass}" data-id="${opt.id}">
                    <span class="relative z-10 font-medium">${opt.text}</span>
                    ${isSelected ? '<iconify-icon icon="solar:check-circle-bold" class="text-indigo-400 text-xl relative z-10"></iconify-icon>' : ''}
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                </button>
            `;
        }).join('');

        return `
            <div id="${this.id}" class="glass-panel p-6 rounded-2xl border border-slate-700/50 shadow-2xl relative bg-slate-900/40 backdrop-blur-sm max-w-2xl mx-auto animate-fade-in-up">
                <!-- Question Number/Decoration -->
                <div class="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-indigo-500 shadow-xl">
                    <iconify-icon icon="solar:question-circle-bold" class="text-2xl"></iconify-icon>
                </div>

                <div class="mb-8 mt-2">
                    <h3 class="text-xl md:text-2xl font-bold text-white leading-relaxed tracking-tight">
                        ${this.question}
                    </h3>
                </div>
                
                <div class="flex flex-col gap-3">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }

    attach(parentContainer) {
        const container = parentContainer.querySelector(`#${this.id}`);
        if (!container) return;

        const btns = container.querySelectorAll('.option-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (this.onSelect) this.onSelect(id);
            });
        });
    }
}
