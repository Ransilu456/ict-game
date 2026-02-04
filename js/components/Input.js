export default class Input {
    /**
     * @param {Object} props
     * @param {string} [props.label]
     * @param {string} [props.placeholder]
     * @param {string} [props.value]
     * @param {string} [props.type] - 'text', 'password', 'number'
     * @param {Function} [props.onChange]
     * @param {string} [props.icon]
     */
    constructor({ label, placeholder = '', value = '', type = 'text', onChange, icon }) {
        this.label = label;
        this.placeholder = placeholder;
        this.value = value;
        this.type = type;
        this.onChange = onChange;
        this.icon = icon;
        this.element = null;
    }

    render() {
        const container = document.createElement('div');
        container.className = "flex flex-col gap-2 w-full";

        if (this.label) {
            const lbl = document.createElement('label');
            lbl.className = "text-xs font-bold text-slate-400 uppercase tracking-wider ml-1";
            lbl.innerText = this.label;
            container.appendChild(lbl);
        }

        const wrap = document.createElement('div');
        wrap.className = "relative group";

        // Icon
        if (this.icon) {
            const iconContainer = document.createElement('div');
            iconContainer.className = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none";
            iconContainer.innerHTML = `<iconify-icon icon="${this.icon}" class="text-lg"></iconify-icon>`;
            wrap.appendChild(iconContainer);
        }

        const input = document.createElement('input');
        input.type = this.type;
        input.value = this.value;
        input.placeholder = this.placeholder;
        input.className = `w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all ${this.icon ? 'pl-10 pr-4' : 'px-4'}`;

        if (this.onChange) {
            input.addEventListener('input', (e) => this.onChange(e.target.value));
        }

        wrap.appendChild(input);
        container.appendChild(wrap);

        this.element = input;
        return container;
    }
}
