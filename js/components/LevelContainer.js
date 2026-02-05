export default class LevelContainer {
    /**
     * @param {Object} props
     * @param {HTMLElement|string} props.content - Level content
     * @param {string} [props.customClass] - Extra classes
     */
    constructor({ content, customClass = '' }) {
        this.content = content;
        this.customClass = customClass;
    }

    render() {
        const container = document.createElement('div');
        // Mobile-first: full width, responsive padding, vertical layout on small screens
        container.className = `w-full h-full flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto ${this.customClass}`;

        if (typeof this.content === 'string') {
            container.innerHTML = this.content;
        } else if (this.content instanceof HTMLElement) {
            container.appendChild(this.content);
        } else if (Array.isArray(this.content)) {
            this.content.forEach(el => container.appendChild(el));
        }

        return container;
    }
}
