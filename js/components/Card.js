export default class Card {
    /**
     * @param {Object} props
     * @param {string} [props.title] - Optional Card Title
     * @param {string} [props.subtitle] - Optional Card Subtitle
     * @param {string|HTMLElement} props.content - Main content (HTML string or Node)
     * @param {string|HTMLElement} [props.footer] - Footer content
     * @param {string} [props.variant] - 'default', 'glass', 'flat'
     * @param {string} [props.customClass] - Extra classes
     */
    constructor({ title, subtitle, content, footer, variant = 'default', customClass = '' }) {
        this.title = title;
        this.subtitle = subtitle;
        this.content = content;
        this.footer = footer;
        this.variant = variant;
        this.customClass = customClass;
        this.element = null;
    }

    render() {
        const div = document.createElement('div');

        let baseClasses = ["rounded-xl", "flex", "flex-col", "overflow-hidden", "transition-all"];

        const variants = {
            default: "bg-slate-900 border border-slate-800 shadow-xl",
            glass: "glass-panel bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl",
            flat: "bg-transparent border border-transparent" // Useful for grid layouts just grouping things
        };

        div.className = `${baseClasses.join(' ')} ${variants[this.variant]} ${this.customClass}`;

        // Header
        if (this.title || this.subtitle) {
            const header = document.createElement('div');
            header.className = "p-6 border-b border-white/5 shrink-0";

            if (this.title) {
                const h3 = document.createElement('h3');
                h3.className = "text-lg font-bold text-white leading-tight";
                h3.innerText = this.title;
                header.appendChild(h3);
            }
            if (this.subtitle) {
                const p = document.createElement('p');
                p.className = "text-sm text-slate-400 mt-1";
                p.innerText = this.subtitle;
                header.appendChild(p);
            }
            div.appendChild(header);
        }

        // Body
        const body = document.createElement('div');
        body.className = "p-6 flex-1 min-h-0 overflow-auto custom-scrollbar"; // Allow scrolling if needed

        if (typeof this.content === 'string') {
            body.innerHTML = this.content;
        } else if (this.content instanceof HTMLElement) {
            body.appendChild(this.content);
        } else if (Array.isArray(this.content)) {
            this.content.forEach(el => body.appendChild(el));
        }
        div.appendChild(body);

        // Footer
        if (this.footer) {
            const foot = document.createElement('div');
            foot.className = "p-4 bg-black/20 border-t border-white/5 shrink-0";

            if (typeof this.footer === 'string') {
                foot.innerHTML = this.footer;
            } else if (this.footer instanceof HTMLElement) {
                foot.appendChild(this.footer);
            }
            div.appendChild(foot);
        }

        this.element = div;
        return div;
    }
}
