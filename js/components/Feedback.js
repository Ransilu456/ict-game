export default class Feedback {
    /**
     * @param {Object} props
     * @param {string} props.title
     * @param {string} props.message
     * @param {string} [props.type] - success, error, neutral
     */
    constructor({ title, message, type = 'neutral' }) {
        this.title = title;
        this.message = message;
        this.type = type;
    }

    render() {
        const div = document.createElement('div');

        const styles = {
            success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
            error: "bg-rose-500/10 border-rose-500/30 text-rose-300",
            neutral: "bg-slate-800/50 border-slate-700 text-slate-300"
        };
        const icons = {
            success: "solar:check-circle-bold",
            error: "solar:danger-triangle-bold",
            neutral: "solar:info-circle-bold"
        };

        div.className = `p-4 rounded-xl border flex items-start gap-4 mb-4 ${styles[this.type] || styles.neutral}`;

        div.innerHTML = `
            <iconify-icon icon="${icons[this.type] || icons.neutral}" class="text-xl mt-0.5 shrink-0"></iconify-icon>
            <div>
                <h4 class="font-bold text-sm mb-1 uppercase tracking-wide opacity-90">${this.title}</h4>
                <p class="text-sm opacity-80 leading-relaxed">${this.message}</p>
            </div>
        `;

        return div;
    }
}
