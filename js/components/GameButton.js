export default class GameButton {
    /**
     * @param {Object} props
     * @param {string} props.text - Button label
     * @param {string} props.variant - 'primary', 'secondary', 'disabled'
     * @param {Function} props.onClick - Click handler
     * @param {string} [props.icon] - Optional Iconify icon name
     * @param {string} [props.customClass] - Extra Tailwind classes
     */
    constructor({ text, variant = 'primary', onClick, icon, customClass = '' }) {
        this.text = text;
        this.variant = variant;
        this.onClick = onClick;
        this.icon = icon;
        this.customClass = customClass;
        this.element = null;
    }

    render() {
        let baseClasses = "relative px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-lg group overflow-hidden ";

        const variants = {
            primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 border border-indigo-500/50",
            secondary: "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 shadow-black/20",
            disabled: "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed grayscale pointer-events-none"
        };

        const className = `${baseClasses} ${variants[this.variant] || variants.primary} ${this.customClass}`;

        const iconHtml = this.icon ? `<iconify-icon icon="${this.icon}" class="text-lg transition-transform group-hover:scale-110"></iconify-icon>` : '';

        // Generate a unique ID for binding events later if using string return
        // Ideally we return a DOM node, but the current system uses innerHTML string injection.
        // So we'll return a string with a randomly generated ID and bind later? 
        // Or we can rely on the parent to bind.
        // Given the current architecture uses `container.innerHTML = x.render()`, we return string.
        // We will need a way to bind the onClick. 
        // Modification: We'll add a data-id to find it.

        this.id = `btn-${Math.random().toString(36).substr(2, 9)}`;

        return `
            <button id="${this.id}" class="${className}">
                ${iconHtml}
                <span class="relative z-10">${this.text}</span>
                ${this.variant === 'primary' ? '<div class="absolute inset-0 bg-indigo-400/0 hover:bg-indigo-400/10 transition-colors"></div>' : ''}
            </button>
        `;
    }

    attach(parentContainer) {
        const btn = parentContainer.querySelector(`#${this.id}`);
        if (btn && this.onClick && this.variant !== 'disabled') {
            btn.addEventListener('click', this.onClick);
        }
        this.element = btn;
    }
}
