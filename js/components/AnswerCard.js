export default class AnswerCard {
    /**
     * @param {Object} props
     * @param {string} props.id - Option ID
     * @param {string} props.text - Option text
     * @param {string} [props.icon] - Optional icon
     * @param {boolean} [props.isSelected] - Selection state
     * @param {boolean} [props.isCorrect] - Correctness (for post-submit)
     * @param {boolean} [props.isWrong] - Wrongness (for post-submit)
     * @param {Function} props.onClick - Click handler
     */
    constructor({ id, text, icon, isSelected = false, isCorrect = false, isWrong = false, onClick }) {
        this.id = id;
        this.text = text;
        this.icon = icon;
        this.isSelected = isSelected;
        this.isCorrect = isCorrect;
        this.isWrong = isWrong;
        this.onClick = onClick;
    }

    render() {
        const btn = document.createElement('button');

        let bgColor = "bg-slate-800/50";
        let borderColor = "border-slate-700";
        let textColor = "text-slate-300";

        if (this.isSelected) {
            bgColor = "bg-indigo-500/20";
            borderColor = "border-indigo-500";
            textColor = "text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]";
        }

        if (this.isCorrect) {
            bgColor = "bg-emerald-500/20";
            borderColor = "border-emerald-500";
            textColor = "text-emerald-400";
        } else if (this.isWrong) {
            bgColor = "bg-rose-500/20";
            borderColor = "border-rose-500";
            textColor = "text-rose-400";
        }

        btn.className = `w-full p-4 rounded-xl border-2 ${bgColor} ${borderColor} ${textColor} transition-all duration-200 flex items-center gap-4 group text-left relative overflow-hidden active:scale-[0.98]`;

        const iconHtml = this.icon ? `<iconify-icon icon="${this.icon}" class="text-2xl shrink-0"></iconify-icon>` : '';

        btn.innerHTML = `
            ${iconHtml}
            <span class="flex-1 font-semibold text-sm md:text-base">${this.text}</span>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
        `;

        if (this.isSelected || this.isCorrect) {
            const check = document.createElement('iconify-icon');
            check.setAttribute('icon', this.isCorrect ? 'solar:check-circle-bold' : 'solar:check-read-linear');
            check.className = "text-xl shrink-0";
            btn.appendChild(check);
        }

        if (this.onClick) {
            btn.onclick = () => this.onClick(this.id);
        }

        return btn;
    }
}
