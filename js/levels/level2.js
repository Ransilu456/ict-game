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
        this.completedTasks = new Set();

        // Data for challenges
        this.challenges = [
            {
                id: 1,
                title: "Variables & Types",
                desc: "Fix the type mismatch error.",
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
            <div class="flex flex-col h-full gap-6 animate-fade-in max-w-7xl mx-auto p-4 md:p-8 relative">
                
                <!-- Background Ambient Glow -->
                <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>

                <!-- Game Header -->
                <div class="flex items-center justify-between mb-2 relative z-10">
                    <div class="flex items-center gap-5">
                        <div class="relative group">
                            <div class="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div class="relative p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-indigo-400">
                                <iconify-icon icon="solar:code-square-bold" class="text-3xl"></iconify-icon>
                            </div>
                        </div>
                        <div>
                            <h2 class="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                                <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-400">
                                    ${this.game.getText('L2_TITLE')}
                                </span>
                            </h2>
                            <div class="flex items-center gap-3">
                                <span class="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em] bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/20">System Logic</span>
                                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${this.game.getText('L2_DESC')}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex flex-col items-end">
                            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Architecture Stability</span>
                            <div class="w-40 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <div class="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                     style="width: ${(this.completedTasks.size / this.challenges.length) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)] min-h-[600px] relative z-10">

                    <!-- Left Panel: Node Map Sidebar -->
                    <div class="w-full lg:w-72 flex flex-col gap-4 shrink-0">
                        <div class="glass-panel p-6 rounded-[2.5rem] border border-slate-800/50 flex flex-col h-full bg-slate-950/40 relative overflow-hidden">
                            <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
                            
                            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
                                <span>Module Map</span>
                                <iconify-icon icon="solar:globus-bold" class="text-indigo-500"></iconify-icon>
                            </h3>

                            <div class="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 h-full relative" id="task-list">
                                <!-- Connecting Line Decorative -->
                                <div class="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-indigo-500/30 via-slate-800 to-indigo-500/10 z-0"></div>

                                ${this.challenges.map((c, i) => {
            const isCurrent = i === this.currentChallengeIndex;
            const isDone = this.completedTasks.has(i);
            return `
                                        <button class="task-btn w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 group relative overflow-hidden
                                            ${isCurrent
                    ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                    : isDone
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400'
                        : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'}"
                                            data-idx="${i}">
                                            <div class="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-300 relative z-10
                                                ${isCurrent
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-900/20 shadow-lg'
                    : isDone
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-600 group-hover:border-slate-600 group-hover:text-slate-400'}">
                                                ${isDone ? '<iconify-icon icon="solar:check-circle-bold" class="text-xl"></iconify-icon>' : `<span class="text-xs font-black">${i + 1}</span>`}
                                            </div>
                                            <div class="flex flex-col overflow-hidden relative z-10">
                                                <span class="text-[9px] font-black uppercase tracking-widest ${isCurrent ? 'text-indigo-400' : isDone ? 'text-emerald-500/60' : 'text-slate-600'}">Node ${String(i + 1).padStart(2, '0')}</span>
                                                <span class="text-sm font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-500'}">${c.title}</span>
                                            </div>
                                            ${isCurrent ? `
                                                <div class="absolute -right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                                            ` : ''}
                                        </button>
                                    `;
        }).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Right Panel: Advanced IDE -->
                    <div class="flex-1 flex flex-col gap-6 min-w-0">
                        
                        <div class="flex-1 flex flex-col glass-panel rounded-[3rem] border border-slate-800/50 shadow-2xl overflow-hidden relative group/ide bg-slate-950/40">
                            <!-- Animated Scanning Line -->
                            <div id="exec-line" class="absolute inset-x-0 h-px bg-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,1)] z-20 pointer-events-none opacity-0"></div>

                            <!-- IDE Header -->
                            <div class="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/50 px-8 py-5 flex items-center justify-between">
                                <div class="flex items-center gap-5">
                                    <div class="flex gap-2">
                                        <div class="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
                                        <div class="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
                                        <div class="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
                                    </div>
                                    <div class="h-5 w-px bg-slate-800"></div>
                                    <div class="flex items-center gap-2">
                                        <iconify-icon icon="logos:python" class="text-sm"></iconify-icon>
                                        <span class="text-[12px] text-slate-400 font-mono tracking-wide">kernel_init.py</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                                        <iconify-icon icon="solar:history-bold"></iconify-icon>
                                        <span>UTF-8</span>
                                    </div>
                                    <div class="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-black text-indigo-400 uppercase tracking-widest">Master</div>
                                </div>
                            </div>

                            <!-- Editor Content -->
                            <div class="flex-1 flex overflow-hidden bg-[#0a0c10]">
                                <!-- Line Numbers -->
                                <div class="w-16 bg-slate-950/30 border-r border-slate-900/50 py-10 flex flex-col items-center gap-4 select-none text-[13px] font-mono text-slate-700">
                                    ${Array(12).fill(0).map((_, i) => `<div class="h-6 flex items-center justify-center">${i + 1}</div>`).join('')}
                                </div>
                                <div class="flex-1 p-10 overflow-auto custom-scrollbar font-mono text-xl md:text-2xl leading-relaxed selection:bg-indigo-500/30 text-slate-300 relative" id="code-display">
                                    <!-- Highlighter background -->
                                    <div class="absolute inset-x-0 h-10 bg-indigo-500/5 border-y border-indigo-500/10 top-[40px] pointer-events-none" id="line-highlighter"></div>
                                    <!-- Code injected here -->
                                </div>

                                <!-- Integrated Terminal (Bottom) -->
                                <div id="terminal-pocket" class="absolute bottom-6 right-8 w-[450px] max-w-[calc(100%-4rem)] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-lg p-6 translate-y-8 opacity-0 transition-all duration-500 pointer-events-none z-30">
                                    <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                        <div class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            <iconify-icon icon="solar:terminal-minimalistic-bold" class="text-indigo-400 text-lg"></iconify-icon>
                                            System Output
                                        </div>
                                        <div class="flex gap-1">
                                            <div class="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                                            <div class="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                                        </div>
                                    </div>
                                    <div id="terminal-log" class="text-xs font-mono leading-relaxed custom-scrollbar max-h-32 overflow-y-auto"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Bar -->
                        <div class="flex flex-col md:flex-row gap-5 shrink-0">
                            <!-- Proposal Selection -->
                            <div class="flex-1 glass-panel p-6 rounded-[2.5rem] border border-slate-800/50 bg-slate-950/40 flex flex-col">
                                <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                                    <iconify-icon icon="solar:tuning-bold" class="text-indigo-500"></iconify-icon>
                                    Resolution Protocols
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-3" id="options-grid">
                                    <!-- Options injected here -->
                                </div>
                            </div>
                            
                            <!-- Main Execution Trigger -->
                            <button id="btn-run-code" class="px-12 py-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] font-black shadow-lg transition-all flex flex-col items-center justify-center gap-1 active:scale-95 group relative overflow-hidden shrink-0">
                                <span class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                <div class="flex items-center gap-3 relative z-10">
                                    <iconify-icon icon="solar:play-bold" class="text-2xl"></iconify-icon>
                                    <span class="text-xl uppercase tracking-tighter">${this.game.getText('L2_BTN_RUN') || 'Execute Fix'}</span>
                                </div>
                                <span class="text-[9px] font-black text-indigo-200 uppercase tracking-[0.3em] opacity-60">Deploy Modules</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        `;

        this.attachEvents();
        this.loadChallenge();
    },

    attachEvents() {
        const taskBtns = this.container.querySelectorAll('.task-btn');
        taskBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                if (idx === this.currentChallengeIndex) return;
                this.currentChallengeIndex = idx;
                this.render();
            });
        });

        this.container.querySelector('#btn-run-code').addEventListener('click', () => this.checkAnswer());
    },

    loadChallenge() {
        const challenge = this.challenges[this.currentChallengeIndex];
        const codeDisplay = this.container.querySelector('#code-display');

        // Wrap code in a container for z-index management
        codeDisplay.innerHTML = `
            <div class="absolute inset-0 z-0 bg-transparent" id="active-line-backdrop"></div>
            <div class="relative z-10">${challenge.codeHTML}</div>
        `;

        const optsGrid = this.container.querySelector('#options-grid');
        optsGrid.innerHTML = '';

        challenge.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = `option-btn w-full text-left p-4 rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-white transition-all font-mono text-xs flex items-center gap-4 group relative overflow-hidden`;
            btn.innerHTML = `
                <div class="w-6 h-6 rounded-xl border-2 border-slate-800 flex items-center justify-center shrink-0 transition-all bg-slate-950 group-hover:border-indigo-500/50">
                    <div class="w-2.5 h-2.5 rounded-md bg-indigo-500 opacity-0 transition-all transform scale-50 dot shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                </div>
                <span class="relative z-10 font-bold">${opt.text}</span>
            `;

            btn.onclick = () => this.selectOption(btn, opt);
            optsGrid.appendChild(btn);
        });

        this.selectedOption = null;
    },

    selectOption(btnElement, optionData) {
        this.container.querySelectorAll('.option-btn').forEach(b => {
            b.classList.remove('border-indigo-500', 'text-white', 'bg-indigo-500/10');
            b.querySelector('.dot').classList.remove('opacity-100', 'scale-100');
            b.querySelector('.dot').classList.add('opacity-0', 'scale-50');
        });

        btnElement.classList.add('border-indigo-500', 'text-white', 'bg-indigo-500/10');
        const dot = btnElement.querySelector('.dot');
        dot.classList.remove('opacity-0', 'scale-50');
        dot.classList.add('opacity-100', 'scale-100');

        this.selectedOption = optionData;
    },

    logToTerminal(message, type = 'info') {
        const terminal = document.getElementById('terminal-pocket');
        const log = document.getElementById('terminal-log');
        if (!terminal || !log) return;

        // Reset timeout if exists
        if (this.termTimeout) clearTimeout(this.termTimeout);

        terminal.classList.remove('translate-y-8', 'opacity-0');
        terminal.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

        const colors = {
            success: 'text-emerald-400',
            error: 'text-[#ff5f56]',
            info: 'text-indigo-300'
        };
        const icons = {
            success: 'solar:check-circle-bold',
            error: 'solar:danger-bold',
            info: 'solar:info-circle-bold'
        };

        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        log.innerHTML = `
            <div class="animate-fade-in flex flex-col gap-1 mb-2 last:mb-0">
                <div class="flex items-center gap-2 opacity-50 text-[10px]">
                    <span>[${timestamp}]</span>
                    <span class="uppercase font-black tracking-widest">${type}</span>
                </div>
                <div class="flex items-start gap-2 ${colors[type] || colors.info}">
                    <iconify-icon icon="${icons[type]}" class="mt-0.5 shrink-0"></iconify-icon>
                    <span>${message}</span>
                </div>
            </div>
        `;

        // Hide after 6s
        this.termTimeout = setTimeout(() => {
            terminal.classList.remove('translate-y-0', 'opacity-100');
            terminal.classList.add('translate-y-8', 'opacity-0');
            terminal.classList.remove('pointer-events-auto');
        }, 6000);
    },

    checkAnswer() {
        if (!this.selectedOption) {
            this.logToTerminal('System requires specialized logic module. Please select a protocol.', 'info');
            return;
        }

        const challenge = this.challenges[this.currentChallengeIndex];
        const execLine = document.getElementById('exec-line');

        // Trigger "Execution" Animation
        if (execLine) {
            execLine.style.top = '0%';
            execLine.classList.remove('opacity-0');
            execLine.classList.add('opacity-100');

            // Animate line down
            let pos = 0;
            const interval = setInterval(() => {
                pos += 2;
                execLine.style.top = `${pos}%`;
                if (pos >= 100) {
                    clearInterval(interval);
                    execLine.classList.add('opacity-0');
                    execLine.classList.remove('opacity-100');
                    this.processResult(challenge);
                }
            }, 10);
        } else {
            this.processResult(challenge);
        }
    },

    processResult(challenge) {
        if (this.selectedOption.correct) {
            this.logToTerminal(`Logic Verified. ${challenge.feedback.correct}`, 'success');
            this.score += 100;
            this.completedTasks.add(this.currentChallengeIndex);

            setTimeout(() => {
                if (this.currentChallengeIndex < this.challenges.length - 1) {
                    this.currentChallengeIndex++;
                    this.render();
                } else {
                    this.finishLevel();
                }
            }, 2500);
        } else {
            this.score = Math.max(0, this.score - 50);
            this.logToTerminal(`Logic Conflict. ${challenge.feedback.incorrect}`, 'error');

            // Visual Shake
            const ide = this.container.querySelector('.group\\/ide');
            ide.classList.add('animate-shake');
            setTimeout(() => ide.classList.remove('animate-shake'), 400);
        }
    },

    finishLevel() {
        const total = this.challenges.length * 100;
        const accuracy = Math.round((this.score / total) * 100);
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, (90 - elapsedSec) * 5);

        this.game.completeLevel({
            success: true,
            score: this.score + timeBonus,
            xp: 750 + (accuracy >= 100 ? 250 : 0),
            accuracy: accuracy,
            timeBonus: timeBonus
        });
    }
};
