/**
 * Level 2: Python Logic
 * Mechanics: Multiple Choice / "Fix the Bug"
 * Refactored for Dashboard UI + Tailwind
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentChallengeIndex = 0;
        this.score = 0;
        this.startTime = Date.now();

        // Data for challenges
        this.challenges = [
            {
                id: 1,
                title: "Variables & Types",
                desc: "Fix the type mismatch error.",
                // Pre-colored HTML matches
                codeHTML: `<span class="text-sky-300">user_age</span> = <span class="text-orange-300">"twenty"</span>\n<span class="text-purple-400">if</span> <span class="text-sky-300">user_age</span> > <span class="text-emerald-300">18</span>:\n    <span class="text-blue-300">print</span>(<span class="text-orange-300">"Access Granted"</span>)`,
                rawCode: `user_age = "twenty"\nif user_age > 18:\n    print("Access Granted")`,
                options: [
                    { id: 'a', text: 'user_age = 20', correct: true },
                    { id: 'b', text: 'user_age = "20"', correct: false },
                    { id: 'c', text: 'int user_age = 20', correct: false }
                ],
                feedback: {
                    correct: "Correct! Ages must be integers (numbers) to be compared with > 18.",
                    incorrect: "Strings cannot be compared numerically. Remove quotes to make it an Integer."
                }
            },
            {
                id: 2,
                title: "Loops",
                desc: "Identify the syntax error.",
                codeHTML: `<span class="text-purple-400">for</span> <span class="text-sky-300">i</span> <span class="text-purple-400">in</span> <span class="text-blue-300">range</span>(<span class="text-emerald-300">5</span>)\n    <span class="text-blue-300">print</span>(<span class="text-sky-300">i</span>)`,
                rawCode: `for i in range(5)\n    print(i)`,
                options: [
                    { id: 'a', text: 'Add colon (:)', correct: true },
                    { id: 'b', text: 'Change to while', correct: false },
                    { id: 'c', text: 'i++', correct: false }
                ],
                feedback: {
                    correct: "Syntax Fixed! Python loops require a colon at the end of the statement.",
                    incorrect: "Look closely at the end of the 'for' line. Something is missing."
                }
            },
            {
                id: 3,
                title: "Conditionals",
                desc: "Fix the assignment vs comparison logic.",
                codeHTML: `<span class="text-sky-300">password</span> = <span class="text-orange-300">"secret"</span>\n<span class="text-purple-400">if</span> <span class="text-sky-300">password</span> = <span class="text-orange-300">"admin"</span>:\n    <span class="text-blue-300">print</span>(<span class="text-orange-300">"Welcome"</span>)`,
                rawCode: `password = "secret"\nif password = "admin":\n    print("Welcome")`,
                options: [
                    { id: 'a', text: 'Change = to ==', correct: true },
                    { id: 'b', text: 'Change "admin" to "secret"', correct: false },
                    { id: 'c', text: 'Remove :', correct: false }
                ],
                feedback: {
                    correct: "Bug Squashed! '=' is assignment. '==' is comparison.",
                    incorrect: "A single '=' assigns a value. We need to COMPARE."
                }
            },
            {
                id: 4,
                title: "Syntax Error",
                desc: "Fix the legacy syntax.",
                codeHTML: `<span class="text-blue-300">print</span> <span class="text-orange-300">"Hello World"</span>`,
                rawCode: `print "Hello World"`,
                options: [
                    { id: 'a', text: 'Add parentheses ()', correct: true },
                    { id: 'b', text: 'Add semicolon ;', correct: false },
                    { id: 'c', text: 'Capitalize Print', correct: false }
                ],
                feedback: {
                    correct: "Correct! Python 3 requires parentheses for print().",
                    incorrect: "Python 2 used print without parentheses, but we are using modern Python."
                }
            },
            {
                id: 5,
                title: "List Logic",
                desc: "Fix the IndexOutOfBounds error.",
                codeHTML: `<span class="text-sky-300">items</span> = [<span class="text-orange-300">"A"</span>, <span class="text-orange-300">"B"</span>]\n<span class="text-blue-300">print</span>(<span class="text-sky-300">items</span>[<span class="text-emerald-300">2</span>])`,
                rawCode: `items = ["A", "B"]\nprint(items[2])`,
                options: [
                    { id: 'a', text: 'Change index to 1', correct: true },
                    { id: 'b', text: 'Change index to 3', correct: false },
                    { id: 'c', text: 'Items are immutable', correct: false }
                ],
                feedback: {
                    correct: "Fixed! Index 2 is the 3rd item, but we only have 2 items (0 and 1).",
                    incorrect: "Lists are 0-indexed. Index 2 means the 3rd item."
                }
            }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="flex flex-col md:flex-row gap-6 animate-fade-in">

                
                <!-- Left Panel: Navigation & Info -->
                <div class="w-full md:w-1/3 flex flex-col gap-4">
                    <div class="glass-panel p-6 rounded-xl border border-indigo-500/30">
                        <h2 class="text-2xl font-bold text-white mb-2">${this.game.getText('L2_TITLE')}</h2>
                        <p class="text-sm text-slate-400">${this.game.getText('L2_DESC')}</p>
                    </div>

                    <div class="glass-panel p-4 rounded-xl border border-slate-700 flex-1 overflow-y-auto">
                        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Task Queue</h3>
                        <div class="flex flex-col gap-2" id="task-list">
                            ${this.challenges.map((c, i) => `
                                <button class="task-btn w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between group
                                    ${i === this.currentChallengeIndex
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}"
                                    data-idx="${i}">
                                    <div class="flex flex-col">
                                        <span class="text-xs opacity-70">Task ${String(i + 1).padStart(2, '0')}</span>
                                        <span class="font-medium truncate">${c.title}</span>
                                    </div>
                                    <iconify-icon icon="solar:code-circle-linear" class="text-xl opacity-50 group-hover:opacity-100"></iconify-icon>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Right Panel: IDE -->
                <div class="w-full md:w-2/3 flex flex-col gap-4">
                    
                    <!-- Editor Window -->
                <div class="glass-panel rounded-xl border border-slate-700 shadow-xl flex flex-col flex-1 relative">

                        <!-- Toolbar -->
                        <div class="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
                            <div class="flex gap-1.5">
                                <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                            </div>
                            <span class="text-xs text-slate-500 ml-2 font-mono">script.py</span>
                        </div>
                        
                        <!-- Content -->
                        <div class="p-6 bg-[#1e1e1e] flex-1 font-mono text-sm md:text-base leading-relaxed relative">
                            <!-- Line Numbers -->
                            <div class="absolute left-3 top-6 text-slate-600 text-right select-none w-6" style="line-height: inherit;">
                                1<br>2<br>3<br>4
                            </div>
                            <div class="pl-10" id="code-display"></div>
                        </div>
                    </div>

                    <!-- Fix Options -->
                    <div class="glass-panel p-6 rounded-xl border border-slate-700">
                        <h4 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Debug Options</h4>
                        <div class="grid grid-cols-1 gap-3" id="options-grid">
                            <!-- Options Injected Here -->
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 mt-auto">
                        <button id="btn-run-code" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
                            <iconify-icon icon="solar:play-circle-bold" class="text-xl"></iconify-icon>
                            <span>${this.game.getText('L2_BTN_RUN') || 'Run Code'}</span>
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.attachEvents();
        this.loadChallenge(); // Load first
    },

    attachEvents() {
        const taskBtns = this.container.querySelectorAll('.task-btn');
        taskBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentChallengeIndex = parseInt(btn.dataset.idx);
                this.render(); // Re-render full UI to update active state
            });
        });

        this.container.querySelector('#btn-run-code').addEventListener('click', () => this.checkAnswer());
    },

    loadChallenge() {
        const challenge = this.challenges[this.currentChallengeIndex];

        // Set Code
        const codeDisplay = this.container.querySelector('#code-display');
        codeDisplay.innerHTML = challenge.codeHTML;

        // Set Options
        const optsGrid = this.container.querySelector('#options-grid');
        optsGrid.innerHTML = '';

        challenge.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = `option-btn w-full text-left px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:border-indigo-500 hover:text-white transition-all font-mono text-sm flex items-center gap-3`;
            btn.innerHTML = `
                <div class="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center shrink-0">
                    <div class="w-2 h-2 rounded-full bg-transparent transition-all dot"></div>
                </div>
                <span>${opt.text}</span>
            `;

            btn.onclick = () => this.selectOption(btn, opt);
            optsGrid.appendChild(btn);
        });

        this.selectedOption = null;
    },

    selectOption(btnElement, optionData) {
        // Clear previous
        this.container.querySelectorAll('.option-btn').forEach(b => {
            b.classList.remove('bg-indigo-600/20', 'border-indigo-500', 'text-indigo-300');
            b.querySelector('.dot').classList.remove('bg-indigo-400');
        });

        // Set Active
        btnElement.classList.add('bg-indigo-600/20', 'border-indigo-500', 'text-indigo-300');
        btnElement.querySelector('.dot').classList.add('bg-indigo-400');

        this.selectedOption = optionData;
    },

    checkAnswer() {
        if (!this.selectedOption) {
            this.game.showFeedback('No Fix Selected', 'Please select a code fix before running the script.');
            return;
        }

        const challenge = this.challenges[this.currentChallengeIndex];

        if (this.selectedOption.correct) {
            this.game.showFeedback('BUILD SUCCESSFUL', `<span class="text-emerald-400">${challenge.feedback.correct}</span>`);
            this.score += 100;

            setTimeout(() => {
                if (this.currentChallengeIndex < this.challenges.length - 1) {
                    this.currentChallengeIndex++;
                    this.render();
                } else {
                    this.finishLevel();
                }
            }, 1500);
        } else {
            this.score = Math.max(0, this.score - 250);
            this.game.showFeedback('RUNTIME ERROR', `<span class="text-rose-400">${challenge.feedback.incorrect}</span>`);
        }
    },

    finishLevel() {
        const total = this.challenges.length * 100;
        const accuracy = Math.round((this.score / total) * 100);

        // Time Bonus
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, (90 - elapsedSec) * 5); // 90s par time

        this.game.completeLevel({
            success: true,
            score: this.score + timeBonus,
            xp: 750 + (accuracy >= 100 ? 250 : 0),
            accuracy: accuracy,
            timeBonus: timeBonus
        });
    }
};
