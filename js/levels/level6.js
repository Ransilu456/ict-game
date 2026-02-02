/**
 * Level 6: Final Exam (MCQ)
 * Topic: General Review (Hardware, Networking, Syntax, Logic)
 * Refactored for Dashboard UI + Tailwind
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentQ = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.selectedAnswer = -1;

        this.questions = [
            {
                q: "Which component is considered the 'Brain' of the computer?",
                options: ["GPU", "RAM", "CPU", "SSD"],
                answer: 2
            },
            {
                q: "In Python, which symbol is used for comments?",
                options: ["//", "#", "/*", "--"],
                answer: 1
            },
            {
                q: "Which OSI Layer handles IP Addressing?",
                options: ["Physical", "Data Link", "Network", "Transport"],
                answer: 2
            },
            {
                q: "What is the output of an AND gate if inputs are 1 and 0?",
                options: ["1", "0", "True", "High"],
                answer: 1
            },
            {
                q: "Convert Decimal '10' to Binary.",
                options: ["1010", "1100", "1001", "1110"],
                answer: 0
            },
            {
                q: "What does RAM stand for?",
                options: ["Read Access Memory", "Random Access Memory", "Run All Memory", "Ready Access Module"],
                answer: 1
            },
            {
                q: "Which logic gate outputs 1 only if BOTH inputs are different?",
                options: ["OR", "AND", "NAND", "XOR"],
                answer: 3
            },
            {
                q: "HTTP operates at which OSI layer?",
                options: ["Application", "Presentation", "Session", "Transport"],
                answer: 0
            }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = `
            <div class="flex flex-col items-center justify-center animate-fade-in max-w-4xl mx-auto gap-8">

                
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-white mb-2">${this.game.getText('L6_TITLE')}</h2>
                    <p class="text-slate-400">${this.game.getText('L6_DESC')}</p>
                </div>

                <div class="w-full glass-panel p-8 rounded-2xl border border-indigo-500/30 shadow-2xl bg-slate-900/40 relative" id="quiz-card">

                    
                    <!-- Progress Bar -->
                    <div class="absolute top-0 left-0 w-full h-1 bg-slate-800">
                        <div class="h-full bg-indigo-500 transition-all duration-500" id="progress-bar" style="width: 0%"></div>
                    </div>

                    <div class="flex justify-between items-center mb-6 text-sm font-mono text-slate-500">
                        <span class="bg-slate-900 px-3 py-1 rounded border border-slate-700">QUESTION <span id="q-num">1</span> / ${this.questions.length}</span>
                        <span class="text-indigo-400">SCORE: <span id="local-score">0</span></span>
                    </div>

                    <h3 class="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed" id="q-text">
                        Loading...
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="options-grid">
                        <!-- Options injected here -->
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button id="btn-submit" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2">
                            <span>CONFIRM ANSWER</span>
                            <iconify-icon icon="solar:arrow-right-bold"></iconify-icon>
                        </button>
                    </div>

                </div>

            </div>
        `;

        this.updateQuestion();
        this.attachEvents();
    },

    updateQuestion() {
        if (this.currentQ >= this.questions.length) {
            this.finishLevel();
            return;
        }

        const qData = this.questions[this.currentQ];
        this.selectedAnswer = -1;

        // Update Text
        this.container.querySelector('#q-text').innerText = qData.q;
        this.container.querySelector('#q-num').innerText = this.currentQ + 1;
        this.container.querySelector('#local-score').innerText = this.score;
        this.container.querySelector('#progress-bar').style.width = `${((this.currentQ) / this.questions.length) * 100}%`;

        // Update Options
        const grid = this.container.querySelector('#options-grid');
        grid.innerHTML = qData.options.map((opt, i) => `
            <button class="option-btn group w-full text-left p-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-500/50 transition-all relative overflow-hidden" data-idx="${i}">
                <div class="flex items-center gap-4 relative z-10">
                    <div class="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-300 transition-colors bg-slate-900/50 btn-marker">
                        ${String.fromCharCode(65 + i)}
                    </div>
                    <span class="text-slate-300 font-medium group-hover:text-white transition-colors">${opt}</span>
                </div>
                <!-- Selection Highlight Bg -->
                <div class="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
        `).join('');

        // Re-attach option clicks since we replaced innerHTML of grid
        grid.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectOption(btn));
        });

        // Disable submit
        const submitBtn = this.container.querySelector('#btn-submit');
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    },

    selectOption(btnElement) {
        // Deselect all
        this.container.querySelectorAll('.option-btn').forEach(b => {
            b.classList.remove('border-indigo-500', 'bg-indigo-600/20');
            b.querySelector('.btn-marker').classList.remove('bg-indigo-500', 'border-indigo-500', 'text-white');
            b.querySelector('.btn-marker').classList.add('border-slate-600', 'text-slate-400', 'bg-slate-900/50');
        });

        // Select clicked
        btnElement.classList.add('border-indigo-500', 'bg-indigo-600/20');
        const marker = btnElement.querySelector('.btn-marker');
        marker.classList.remove('border-slate-600', 'text-slate-400', 'bg-slate-900/50');
        marker.classList.add('bg-indigo-500', 'border-indigo-500', 'text-white');

        this.selectedAnswer = parseInt(btnElement.dataset.idx);

        // Enable submit
        const submitBtn = this.container.querySelector('#btn-submit');
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    },

    attachEvents() {
        this.container.querySelector('#btn-submit').addEventListener('click', () => this.handleSubmit());
    },

    handleSubmit() {
        if (this.selectedAnswer === -1) return;

        const qData = this.questions[this.currentQ];
        const isCorrect = this.selectedAnswer === qData.answer;

        if (isCorrect) {
            this.score += 250;
            this.game.showFeedback(this.game.getText('RES_SUCCESS'), 'Correct Answer Verified.');
        } else {
            this.game.showFeedback(this.game.getText('RES_FAIL'), `Incorrect. The correct answer was: ${qData.options[qData.answer]}`);
        }

        // Advance
        setTimeout(() => {
            this.currentQ++;
            this.updateQuestion();
        }, 1500);
    },

    finishLevel() {
        const total = this.questions.length * 250;
        const accuracy = Math.round((this.score / total) * 100);

        // Time Bonus
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        const timeBonus = Math.max(0, (180 - elapsedSec) * 5); // 3 mins par

        this.game.completeLevel({
            success: true,
            score: this.score + timeBonus,
            xp: this.score,
            accuracy: accuracy,
            timeBonus: timeBonus
        });
    }
};
