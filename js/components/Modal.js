import GameButton from './GameButton.js';

export default class Modal {
    /**
     * @param {Object} props
     * @param {string} props.title
     * @param {string} props.message
     * @param {string} [props.type] - 'info', 'success', 'error', 'warning'
     * @param {Function} [props.onClose]
     * @param {Array} [props.actions] - Array of button props
     */
    constructor({ title, message, type = 'info', onClose, actions = [] }) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.onClose = onClose;
        this.actions = actions;
        this.element = null;
    }

    render() {
        const overlay = document.createElement('div');
        overlay.className = "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in";
        overlay.onclick = (e) => {
            if (e.target === overlay && this.onClose) this.onClose();
        };

        const panel = document.createElement('div');
        panel.className = "w-full max-w-md glass-panel bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden transform transition-all scale-100";
        // Stop bubbling
        panel.onclick = (e) => e.stopPropagation();

        const typeColors = {
            info: "text-blue-400 bg-blue-500/10 border-blue-500/20",
            success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            error: "text-rose-400 bg-rose-500/10 border-rose-500/20",
            warning: "text-amber-400 bg-amber-500/10 border-amber-500/20"
        };
        const typeIcons = {
            info: "solar:info-circle-bold",
            success: "solar:check-circle-bold",
            error: "solar:danger-triangle-bold",
            warning: "solar:alert-circle-bold"
        };

        const colorClass = typeColors[this.type] || typeColors.info;
        const iconName = typeIcons[this.type] || typeIcons.info;

        // Content
        const contentDiv = document.createElement('div');
        contentDiv.className = "p-6";

        contentDiv.innerHTML = `
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl border shrink-0 ${colorClass}">
                    <iconify-icon icon="${iconName}"></iconify-icon>
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-white mb-2">${this.title}</h3>
                    <div class="text-slate-300 text-sm leading-relaxed">${this.message}</div>
                </div>
            </div>
        `;

        panel.appendChild(contentDiv);

        // Actions
        const footer = document.createElement('div');
        footer.className = "bg-slate-950/50 p-4 flex justify-end gap-3 border-t border-white/5";

        if (this.actions.length === 0) {
            // Default Close button
            const closeBtn = new GameButton({
                text: "Close",
                variant: 'secondary',
                size: 'sm',
                onClick: () => {
                    if (this.onClose) this.onClose();
                    this.destroy();
                }
            });
            footer.appendChild(closeBtn.render());
        } else {
            this.actions.forEach(act => {
                const btn = new GameButton({
                    ...act,
                    size: 'sm',
                    onClick: (e) => {
                        if (act.onClick) act.onClick(e);
                        // Unless specify explicit persist, close
                        if (!act.persist) this.destroy();
                    }
                });
                footer.appendChild(btn.render());
            });
        }

        panel.appendChild(footer);
        overlay.appendChild(panel);

        this.element = overlay;

        // Append to body immediately when rendered? Or return?
        // Usually return, let parent append.
        return overlay;
    }

    show() {
        document.body.appendChild(this.render());
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
