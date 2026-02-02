/**
 * Level 8: SQL Query Builder
 * Mechanic: Drag and Drop keywords to form valid SQL queries.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;

        // Tasks
        this.challenges = [
            {
                id: 1,
                desc: "Select all usernames from the 'users' table.",
                answer: ["SELECT", "username", "FROM", "users"],
                options: ["SELECT", "FROM", "users", "username", "WHERE", "id=1", "*"]
            },
            {
                id: 2,
                desc: "Find the user where id is 5.",
                answer: ["SELECT", "*", "FROM", "users", "WHERE", "id=5"],
                options: ["SELECT", "*", "FROM", "users", "WHERE", "id=5", "DELETE", "AND"]
            },
            {
                id: 3,
                desc: "Get emails of 'admin' users.",
                answer: ["SELECT", "email", "FROM", "users", "WHERE", "role='admin'"],
                options: ["SELECT", "email", "FROM", "WHERE", "role='admin'", "users", "update", "DROP"]
            }
        ];

        this.currentSlots = []; // To store what's in the droppable area

        this.render();
    },

    render() {
        const challenge = this.challenges[this.currentStage];
        this.currentSlots = []; // Reset current attempt

        this.container.innerHTML = `
            <div class="flex flex-col h-full max-w-4xl mx-auto space-y-6 animate-fade-in p-2">
                
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-white tracking-wider mb-2">${this.game.getText('L8_TITLE')}</h2>
                    <p class="text-slate-400">Task ${this.currentStage + 1}: ${challenge.desc}</p>
                </div>

                <!-- Query Builder Area -->
                <div class="glass-panel p-8 rounded-xl border border-slate-700 min-h-[150px] flex items-center justify-center relative bg-slate-900/50">
                    <div class="absolute top-2 left-4 text-xs font-mono text-slate-500 uppercase">Input Terminal</div>
                    
                    <div id="drop-zone" class="flex flex-wrap gap-3 items-center justify-start w-full min-h-[60px] p-4 rounded-lg border-2 border-dashed border-slate-700 bg-slate-950/30">
                        <span class="text-slate-600 text-sm italic select-none pointer-events-none w-full text-center" id="placeholder-text">Drag blocks here to build query</span>
                    </div>

                    <!-- Run Button position absolute or separate? -->
                </div>

                <!-- Block Palette -->
                <div class="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div class="text-xs font-mono text-slate-500 uppercase mb-4">Command Palette</div>
                    <div class="flex flex-wrap gap-3 justify-center" id="palette">
                        ${challenge.options.map((opt, idx) => `
                            <div class="draggable-item bg-indigo-600 hover:bg-indigo-500 text-white font-mono px-4 py-2 rounded shadow-lg cursor-grab active:cursor-grabbing border-b-4 border-indigo-800 transition-all select-none"
                                draggable="true" data-val="${opt}">
                                ${opt}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex justify-center gap-4 mt-auto">
                    <button id="btn-reset-sql" class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors">
                        Clear
                    </button>
                    <button id="btn-run-sql" class="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
                        <iconify-icon icon="solar:play-bold"></iconify-icon>
                        ${this.game.getText('L8_BTN_RUN')}
                    </button>
                </div>

            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const palette = this.container.querySelector('#palette');
        const dropZone = this.container.querySelector('#drop-zone');
        const placeholder = this.container.querySelector('#placeholder-text');

        // Drag Events
        let draggedItem = null;

        this.container.querySelectorAll('.draggable-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                e.dataTransfer.setData('text/plain', e.target.dataset.val);
                e.dataTransfer.effectAllowed = 'copy';
                setTimeout(() => item.classList.add('opacity-50'), 0);
            });
            item.addEventListener('dragend', () => {
                draggedItem.classList.remove('opacity-50');
                draggedItem = null;
            });
        });

        // Drop Zone Events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            dropZone.classList.add('border-indigo-500');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-indigo-500');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-indigo-500');
            const data = e.dataTransfer.getData('text/plain');

            if (data) {
                this.addBlockToZone(data);
            }
        });

        // Click to add support (for mobile mostly or ease)
        this.container.querySelectorAll('#palette .draggable-item').forEach(item => {
            item.addEventListener('click', () => {
                this.addBlockToZone(item.dataset.val);
            });
        });

        // Reset
        this.container.querySelector('#btn-reset-sql').addEventListener('click', () => {
            dropZone.innerHTML = '';
            dropZone.appendChild(placeholder);
            placeholder.style.display = 'block';
            this.currentSlots = [];
        });

        // Run
        this.container.querySelector('#btn-run-sql').addEventListener('click', () => {
            this.checkSolution();
        });
    },

    addBlockToZone(val) {
        const dropZone = this.container.querySelector('#drop-zone');
        const placeholder = this.container.querySelector('#placeholder-text');

        if (placeholder) placeholder.style.display = 'none';

        const block = document.createElement('div');
        block.className = "bg-slate-700 text-white font-mono px-3 py-1 rounded border border-slate-600 flex items-center gap-2 animate-fade-in";
        block.innerHTML = `
            <span>${val}</span>
            <button class="text-slate-400 hover:text-rose-400 ml-1 text-xs px-1">&times;</button>
        `;

        // Remove on click x
        block.querySelector('button').addEventListener('click', () => {
            block.remove();
            this.updateCurrentSlots();
            if (dropZone.querySelectorAll('div').length === 0) {
                placeholder.style.display = 'block';
            }
        });

        dropZone.appendChild(block);
        this.updateCurrentSlots();
    },

    updateCurrentSlots() {
        const dropZone = this.container.querySelector('#drop-zone');
        // Re-read children in order
        this.currentSlots = Array.from(dropZone.querySelectorAll('div > span')).map(el => el.innerText);
    },

    checkSolution() {
        const challenge = this.challenges[this.currentStage];
        const userQuery = this.currentSlots.join(' ');
        const expectedQuery = challenge.answer.join(' ');

        // Checking array equality simpler
        const isCorrect = JSON.stringify(this.currentSlots) === JSON.stringify(challenge.answer);

        if (isCorrect) {
            this.game.showFeedback(this.game.getText('RES_SUCCESS'), `Query Executed: <span class="text-emerald-400 font-mono">${userQuery}</span><br>Result: 1 Row(s) Returned.`);
            setTimeout(() => {
                this.nextStage();
            }, 1500);
        } else {
            this.game.showFeedback('SYNTAX ERROR', `Your Query: <span class="text-rose-400 font-mono">${userQuery}</span><br>Check syntax and order.`);
        }
    },

    nextStage() {
        this.currentStage++;
        if (this.currentStage < this.challenges.length) {
            this.render();
        } else {
            this.game.completeLevel({
                success: true,
                score: 3000,
                xp: 2500,
                accuracy: 100,
                timeBonus: 200
            }); // Final
        }
    }
};
