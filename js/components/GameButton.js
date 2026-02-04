export default class GameButton {
    /**
     * @param {Object} props
     * @param {string} props.text - Button label
     * @param {string} props.variant - 'primary', 'secondary', 'danger', 'ghost', 'disabled'
     * @param {string} props.size - 'sm', 'md', 'lg'
     * @param {Function} props.onClick - Click handler
     * @param {string} [props.icon] - Optional Iconify icon name
     * @param {string} [props.customClass] - Extra Tailwind classes
     */
    constructor({ text, variant = 'primary', size = 'md', onClick, icon, customClass = '' }) {
        this.text = text;
        this.variant = variant;
        this.size = size;
        this.onClick = onClick;
        this.icon = icon;
        this.customClass = customClass;
        this.element = null;
    }

    render() {
        const btn = document.createElement('button');

        // Base styles
        let classes = [
            "relative", "rounded-xl", "font-bold", "uppercase", "tracking-wider",
            "transition-all", "duration-300", "flex", "items-center", "justify-center",
            "gap-2", "active:scale-95", "group", "overflow-hidden", "select-none"
        ];

        // Size styles
        const sizes = {
            sm: "px-4 py-2 text-xs",
            md: "px-6 py-3 text-sm",
            lg: "px-8 py-4 text-base"
        };
        classes.push(sizes[this.size] || sizes.md);

        // Variant styles
        const variants = {
            primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 border border-indigo-500/50",
            secondary: "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 shadow-lg shadow-black/20",
            danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 border border-rose-500/50",
            ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white border border-transparent hover:border-slate-700",
            disabled: "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed grayscale pointer-events-none"
        };
        classes.push(variants[this.variant] || variants.primary);

        if (this.customClass) {
            classes.push(this.customClass);
        }

        btn.className = classes.join(' ');

        // Content
        let iconHtml = '';
        if (this.icon) {
            iconHtml = `<iconify-icon icon="${this.icon}" class="text-lg transition-transform group-hover:scale-110"></iconify-icon>`;
        }

        const span = document.createElement('span');
        span.className = "relative z-10";
        span.innerText = this.text;

        btn.innerHTML = `${iconHtml}`;
        btn.appendChild(span);

        // Hover Effect Overlay (for primary/danger)
        if (['primary', 'danger'].includes(this.variant)) {
            const overlay = document.createElement('div');
            overlay.className = "absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors pointer-events-none";
            btn.appendChild(overlay);
        }

        // Event Listener
        if (this.onClick && this.variant !== 'disabled') {
            btn.addEventListener('click', (e) => this.onClick(e));
        }

        this.element = btn;
        return btn;
    }
}
